const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/images/garage';
const WIDTH = 800;
const HEIGHT = 450; // 16:9 aspect ratio

async function cropImages() {
  const files = fs.readdirSync(inputDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const tempPath = inputPath + '.tmp';

    try {
      await sharp(inputPath)
        .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
        .toFile(tempPath);

      fs.renameSync(tempPath, inputPath);
      console.log(`Cropped: ${file}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }

  console.log('Done!');
}

cropImages();
