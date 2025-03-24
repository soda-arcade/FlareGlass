const fs = require('fs');
const path = require('path');

// Get the current version from command line arguments
const env = process.argv[2];
if (!env) {
    console.error('Please provide the environment name.');
    process.exit(1);
}

// This script will copy the contents of the specified environment file to the .env file
// ../frontend/env/.env.{env} -> ../frontend/.env.production

const sourcePath = path.join(__dirname, `../frontend/env/.env.${env}`);
const destinationPath = path.join(__dirname, `../frontend/.env.production`);

fs.copyFile(sourcePath, destinationPath, (err) => {
    if (err) {
        console.error(`Error copying file ${sourcePath} to ${destinationPath}:`, err);
    } else {
        console.log(`Copied environment file ${sourcePath} to ${destinationPath}`);
    }
});