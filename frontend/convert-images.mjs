import sharp from 'sharp';
import fs from 'fs/promises';
import toIco from 'to-ico';

const sizes = [
    { width: 16, height: 16, name: 'favicon-16x16.png' },
    { width: 32, height: 32, name: 'favicon-32x32.png' },
    { width: 180, height: 180, name: 'apple-touch-icon.png' },
    { width: 192, height: 192, name: 'android-chrome-192x192.png' },
    { width: 512, height: 512, name: 'android-chrome-512x512.png' }
];

async function convertImages() {
    try {
        // Read the SVG files
        const faviconSvg = await fs.readFile('favicon.svg');
        const ogImageSvg = await fs.readFile('og-image.svg');

        // Create public directory if it doesn't exist
        try {
            await fs.access('public');
        } catch {
            await fs.mkdir('public');
        }

        // Convert favicon to different sizes
        for (const size of sizes) {
            await sharp(faviconSvg)
                .resize(size.width, size.height)
                .png()
                .toFile(`public/${size.name}`);
            console.log(`Created ${size.name}`);
        }

        // Create favicon.ico from 16x16 and 32x32 PNGs
        const favicon16Buffer = await sharp(faviconSvg)
            .resize(16, 16)
            .png()
            .toBuffer();

        const favicon32Buffer = await sharp(faviconSvg)
            .resize(32, 32)
            .png()
            .toBuffer();

        const icoBuffer = await toIco([favicon16Buffer, favicon32Buffer]);
        await fs.writeFile('public/favicon.ico', icoBuffer);
        console.log('Created favicon.ico');

        // Convert OG image
        await sharp(ogImageSvg)
            .resize(1200, 630)
            .png()
            .toFile('public/og-image.png');
        console.log('Created og-image.png');

        // Create twitter image (same as OG image)
        await sharp(ogImageSvg)
            .resize(1200, 630)
            .png()
            .toFile('public/twitter-image.png');
        console.log('Created twitter-image.png');

        console.log('All conversions completed successfully!');
    } catch (error) {
        console.error('Error converting images:', error);
        // Log more detailed error information
        if (error.stack) {
            console.error('Error stack:', error.stack);
        }
    }
}

convertImages();