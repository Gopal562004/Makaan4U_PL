// middlewares/apiMonitor.js

// Your API Monitor server URL
const MONITOR_URL = process.env.MONITOR_URL || "https://lognexis-node.onrender.com/api/logs";
const API_KEY = process.env.MONITOR_API_KEY || "ak_46d8b687d92b463582f1bf8b7be9ad41";

export default function apiMonitorMiddleware(req, res, next) {
  // Skip these paths and methods
  const skipPaths = ["/health", "/cloudinary-status", "/favicon.ico"];
  if (skipPaths.includes(req.path) || req.method === "OPTIONS") {
    return next();
  }

  const startTime = Date.now();
  
  // 1. Intercept response to calculate size
  let capturedSize = 0;
  const originalSend = res.send;
  res.send = function (body) {
    if (body) {
      try {
        const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
        capturedSize = Buffer.byteLength(bodyStr, 'utf8');
      } catch (e) {
        capturedSize = 0;
      }
    }
    return originalSend.apply(this, arguments);
  };

  // Wait for the response to finish sending
  res.on('finish', () => {
    const latency = Date.now() - startTime;
    
    // Use Content-Length header if available, otherwise use our captured size
    const headerSize = res.getHeader("content-length");
    const finalResponseSize = headerSize ? parseInt(headerSize, 10) : capturedSize;

    // Grab the region at runtime, default to ap-south-1 based on your AWS URL
    const region = process.env.AWS_REGION || process.env.VERCEL_REGION || "ap-south-1";

    // AWS API Gateway usually passes real IP in x-forwarded-for
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || req.connection?.remoteAddress || "unknown";

    const logData = {
      endpoint: req.originalUrl,
      method: req.method,
      statusCode: res.statusCode,
      latency: latency,
      responseSize: finalResponseSize || 0,
      region: region,
      ipAddress: clientIp,
      userAgent: req.get("user-agent") || "unknown",
      timestamp: new Date().toISOString(),
    };

    console.log(`📊 [Monitor] ${req.method} ${req.originalUrl} → ${res.statusCode} (${latency}ms) [${logData.responseSize} bytes, Region: ${region}]`);

    fetch(`${MONITOR_URL}/${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(logData),
      signal: AbortSignal.timeout(2000)
    })
    .then(response => {
      if (response.ok) {
        console.log(`✅ [Monitor] Log sent successfully`);
      } else {
        console.error(`❌ [Monitor] Failed to send log, status:`, response.status);
      }
    })
    .catch(error => {
      console.error(`❌ [Monitor] Failed to send log:`, error.message);
    });
  });

  next();
}
