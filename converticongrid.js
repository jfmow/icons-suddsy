const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const svgFolderPath = path.join(__dirname, 'public/round'); // Replace with your SVG folder path
const gridSize = 48; // Size of each SVG in pixels
const gridSpacing = 4; // Spacing between SVGs

const gridData = []; // Array to store SVG position data

// Read the SVG files in the folder
fs.readdir(svgFolderPath, async (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    const svgFiles = files.filter(file => path.extname(file) === '.svg');

    if (svgFiles.length === 0) {
        console.log('No SVG files found.');
        return;
    }

    // Calculate the canvas size based on the number of SVGs and the grid size
    const canvasWidth = Math.ceil(Math.sqrt(svgFiles.length)) * (gridSize + gridSpacing) - gridSpacing;
    const canvasHeight = Math.ceil(svgFiles.length / Math.ceil(Math.sqrt(svgFiles.length))) * (gridSize + gridSpacing) - gridSpacing;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    let x = 0;
    let y = 0;

    for (const svgFile of svgFiles) {
        const svgPath = path.join(svgFolderPath, svgFile);
        const svgData = await fs.promises.readFile(svgPath, 'utf-8');

        const image = await loadImage(`data:image/svg+xml;base64,${Buffer.from(svgData).toString('base64')}`);

        // Draw the SVG image on the canvas
        ctx.drawImage(image, x, y, gridSize, gridSize);

        // Store SVG position data
        gridData.push({
            fileName: svgFile,
            x,
            y,
        });

        // Move to the next position
        x += gridSize + gridSpacing;

        if (x + gridSize > canvasWidth) {
            x = 0;
            y += gridSize + gridSpacing;
        }
    }

    // Save the SVG position data to a JSON file
    const jsonFilePath = path.join(__dirname, 'svgGridData.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(gridData, null, 2));

    const outputFilePath = path.join(__dirname, 'svgGrid.png');
    const out = fs.createWriteStream(outputFilePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('Image saved:', outputFilePath));
});
