// import fs from "fs";
// import path from "path";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Property from "../models/Property.js"; // correct model

// dotenv.config();

// async function generateSitemap() {
//   console.log("🔄 Generating Sitemap...");

//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("📦 Connected to MongoDB");

//     const baseUrl = "https://makaan4u-clean.vercel.app";

//     // Static pages
//     const staticUrls = ["/", "/properties", "/contact", "/about"];

//     let urlSet = "";

//     staticUrls.forEach((url) => {
//       urlSet += `
//         <url>
//           <loc>${baseUrl}${url}</loc>
//           <changefreq>weekly</changefreq>
//           <priority>0.8</priority>
//         </url>
//       `;
//     });

//     // Dynamic property pages using SLUG
//     const properties = await Property.find({}, "slug _id");

//     properties.forEach((p) => {
//       const slug = p.slug || p._id;
//       urlSet += `
//         <url>
//           <loc>${baseUrl}/property-details/${slug}</loc>
//           <changefreq>weekly</changefreq>
//           <priority>1.0</priority>
//         </url>
//       `;
//     });

//     // Build XML
//     const sitemap = `
//       <?xml version="1.0" encoding="UTF-8"?>
//       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//         ${urlSet}
//       </urlset>
//     `;

//     // Save sitemap in public/
//     const filePath = path.join("public", "sitemap.xml");
//     fs.writeFileSync(filePath, sitemap.trim());

//     console.log(`✅ Sitemap created at: ${filePath}`);
//     process.exit();
//   } catch (error) {
//     console.error("❌ Error generating sitemap:", error);
//     process.exit(1);
//   }
// }

// generateSitemap();
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "../models/Property.js";

dotenv.config({ path: path.resolve("./.env") });

export async function generateSitemap() {
  console.log("♻️ Auto Updating Sitemap...");

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    const baseUrl = "https://makaan4u-clean.vercel.app";

    const staticUrls = ["/", "/properties", "/contact", "/about"];
    let urlSet = "";

    staticUrls.forEach((url) => {
      urlSet += `
        <url>
          <loc>${baseUrl}${url}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>`;
    });

    const properties = await Property.find({}, "slug _id");
    properties.forEach((p) => {
      const slug = p.slug || p._id;
      urlSet += `
        <url>
          <loc>${baseUrl}/property/${slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>1.0</priority>
        </url>`;
    });

    const sitemap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urlSet}
      </urlset>`;

    const filePath = path.join("public", "sitemap.xml");
    fs.writeFileSync(filePath, sitemap.trim());

    console.log("✅ Sitemap Updated Automatically");
  } catch (err) {
    console.error("❌ Sitemap Generation Failed:", err);
  }
}

// If script is run manually
if (process.argv[1]?.includes("generateSitemap.js")) {
  generateSitemap().then(() => process.exit());
}
