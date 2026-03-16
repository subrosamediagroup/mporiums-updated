import sharp from 'sharp';

const generateOGImage = async () => {
  try {
    // Create SVG overlay with text
    const svgOverlay = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><style>.title-white { font-size: 120px; font-weight: bold; fill: white; font-family: Arial, sans-serif; }.title-red { font-size: 120px; font-weight: bold; fill: #FF5555; font-family: Arial, sans-serif; }.overlay { fill: rgba(0, 0, 0, 0.35); }</style></defs><rect class="overlay" width="1200" height="630"/><text class="title-white" x="80" y="200">Buy &amp; Sell</text><text class="title-red" x="80" y="330">Premium Gear</text></svg>`;
    
    // Create the OG preview image
    const result = await sharp('./public/images/hero-bg.jpg')
      .resize(1200, 630, { fit: 'cover' })
      .composite([
        {
          input: Buffer.from(svgOverlay),
          blend: 'over'
        }
      ])
      .jpeg({ quality: 90 })
      .toFile('./public/images/og-preview.jpg');
    
    console.log(`✓ OG preview image generated!`);
    console.log(`  Dimensions: ${result.width}x${result.height}px`);
    console.log(`  File size: ${(result.size / 1024).toFixed(2)}KB`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

generateOGImage();
