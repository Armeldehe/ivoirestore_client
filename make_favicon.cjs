const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function makeFavicons() {
  const input = path.join(__dirname, "public", "logo_ivoirestore.png");

  // Make 192x192 transparent padded version
  await sharp(input)
    .resize(192, 192, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .toFile(path.join(__dirname, "public", "favicon-192.png"));

  // Make 512x512 transparent padded version (common format)
  await sharp(input)
    .resize(512, 512, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .toFile(path.join(__dirname, "public", "favicon-512.png"));

  console.log("Favicons generated successfully.");
}

makeFavicons().catch(console.error);
