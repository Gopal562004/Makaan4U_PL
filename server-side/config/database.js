import mongoose from "mongoose";
import dns from "dns";

// Fix for Windows Node.js querySrv and shard hostname resolution on restricted local router DNS (192.168.2.1)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }

  // Intercept dns.lookup for MongoDB Atlas hosts so they resolve via c-ares (Google DNS) rather than broken OS getaddrinfo
  const origLookup = dns.lookup;
  dns.lookup = (hostname, options, callback) => {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (hostname && (hostname.includes("mongodb.net") || hostname.includes("amazonaws.com"))) {
      dns.resolve4(hostname, (err, addresses) => {
        if (!err && addresses && addresses.length) {
          if (options && options.all) {
            return callback(null, addresses.map((a) => ({ address: a, family: 4 })));
          }
          return callback(null, addresses[0], 4);
        }
        return origLookup(hostname, options, callback);
      });
    } else {
      return origLookup(hostname, options, callback);
    }
  };
} catch (e) {
  // Ignore
}

const FALLBACK_DIRECT_URI =
  "mongodb://gopalgawas2004:GopalGawas2004@cluster0-shard-00-00.silzl.mongodb.net:27017,cluster0-shard-00-01.silzl.mongodb.net:27017,cluster0-shard-00-02.silzl.mongodb.net:27017/makaan4u?ssl=true&replicaSet=atlas-thcsyg-shard-0&authSource=admin&retryWrites=true&w=majority";

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const primaryUri = process.env.MONGODB_URI || FALLBACK_DIRECT_URI;

  try {
    cachedConnection = mongoose.connect(primaryUri, {
      bufferCommands: false,
    });
    await cachedConnection;
    console.log("✅ MongoDB connected successfully");
    return cachedConnection;
  } catch (primaryErr) {
    console.warn("⚠️ Primary connection error:", primaryErr.message);

    if (primaryUri !== FALLBACK_DIRECT_URI) {
      console.log("🔄 Retrying with direct MongoDB replica set connection...");
      try {
        cachedConnection = mongoose.connect(FALLBACK_DIRECT_URI, {
          bufferCommands: false,
        });
        await cachedConnection;
        console.log("✅ MongoDB connected successfully via direct replica set");
        return cachedConnection;
      } catch (fallbackErr) {
        console.error("❌ Fallback connection error:", fallbackErr.message);
        cachedConnection = null;
        throw fallbackErr;
      }
    }

    cachedConnection = null;
    throw primaryErr;
  }
};

export default connectDB;
