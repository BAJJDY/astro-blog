import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'src', 'assets', 'images');

async function optimizeImages() {
  try {
    const files = fs.readdirSync(imagesDir);
    
    for (const file of files) {
      const inputPath = path.join(imagesDir, file);
      const tempOutputPath = path.join(imagesDir, `temp_${file}`);
      
      console.log(`Optimizing ${file}...`);
      
      await sharp(inputPath)
        .resize({
          width: 1200, // 适当调整宽度
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .jpeg({
          quality: 80,
          progressive: true
        })
        .png({
          quality: 80,
          compressionLevel: 6
        })
        .toFile(tempOutputPath);
      
      // Replace original file with optimized version
      fs.unlinkSync(inputPath);
      fs.renameSync(tempOutputPath, inputPath);
      
      console.log(`Optimized ${file}`);
    }
    
    console.log('All images optimized successfully!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();
