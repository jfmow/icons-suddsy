const fs = require('fs');
const path = require('path');

const publicFolder = path.join(__dirname, 'public/round'); // Replace 'public' with your folder path

// Read the files in the public folder
fs.readdir(publicFolder, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    const svgFiles = files.filter(file => path.extname(file) === '.svg');
    const svgNamesWithExtension = svgFiles.map(file => file); // Keep the file names with the ".svg" extension

    const jsonData = JSON.stringify(svgNamesWithExtension, null, 2);

    // Write the JSON data to a file
    fs.writeFile('svgList.json', jsonData, 'utf8', (writeErr) => {
        if (writeErr) {
            console.error('Error writing JSON file:', writeErr);
            return;
        }
        console.log('SVG names with extensions have been written to svgList.json');
    });
});
