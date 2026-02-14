import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'src', 'assets', 'images');

async function optimizeImage(inputPath, outputDir) {
  const fileName = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath).toLowerCase();
  
  // 跳过已经是 webp 或 avif 的文件
  if (ext === '.webp' || ext === '.avif') {
    console.log(`Skipping ${fileName}${ext} (already optimized format)`);
    return;
  }
  
  console.log(`Optimizing ${fileName}${ext}...`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // 设置合理的最大宽度
    const maxWidth = 1920;
    const width = metadata.width > maxWidth ? maxWidth : metadata.width;
    
    // 生成 WebP 格式（更好的压缩率和浏览器支持）
    await image
      .clone()
      .resize({
        width: width,
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .webp({
        quality: 85,
        effort: 6
      })
      .toFile(path.join(outputDir, `${fileName}.webp`));
    
    console.log(`✓ Created ${fileName}.webp`);
    
    // 可选：生成 AVIF 格式（最佳压缩率，但编码较慢）
    // await image
    //   .clone()
    //   .resize({
    //     width: width,
    //     fit: sharp.fit.inside,
    //     withoutEnlargement: true
    //   })
    //   .avif({
    //     quality: 80,
    //     effort: 4
    //   })
    //   .toFile(path.join(outputDir, `${fileName}.avif`));
    
    // console.log(`✓ Created ${fileName}.avif`);
    
    // 优化原始格式作为后备
    if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .clone()
        .resize({
          width: width,
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .jpeg({
          quality: 85,
          progressive: true,
          mozjpeg: true
        })
        .toFile(path.join(outputDir, `${fileName}${ext}`));
      console.log(`✓ Optimized ${fileName}${ext}`);
    } else if (ext === '.png') {
      await image
        .clone()
        .resize({
          width: width,
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .png({
          quality: 85,
          compressionLevel: 9,
          palette: true
        })
        .toFile(path.join(outputDir, `${fileName}${ext}`));
      console.log(`✓ Optimized ${fileName}${ext}`);
    }
    
  } catch (error) {
    console.error(`Error optimizing ${fileName}${ext}:`, error.message);
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      await optimizeImage(filePath, dir);
    }
  }
}

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');
  
  try {
    // 优化 src/assets/images 目录
    if (fs.existsSync(imagesDir)) {
      console.log('Processing src/assets/images...');
      await processDirectory(imagesDir);
    } else {
      console.error('❌ Directory not found: src/assets/images');
      process.exit(1);
    }
    
    console.log('\n✅ All images optimized successfully!');
    console.log('\n💡 Tips:');
    console.log('   - WebP format provides ~30% better compression than JPEG');
    console.log('   - Modern browsers support WebP (95%+ coverage)');
    console.log('   - Original formats are kept as fallback');
  } catch (error) {
    console.error('❌ Error optimizing images:', error);
    process.exit(1);
  }
}

optimizeImages();
