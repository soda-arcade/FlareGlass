const fs = require('fs');
const path = require('path');

// List of files to update
const filesToUpdate = [
    '../backend/services/update.go',
    "../build/config.yml",
    "../build/windows/info.json",
    "../build/windows/nsis/wails_tools.nsh",
    "../frontend/.env.development",
    "../frontend/.env.production",
    "../frontend/env/.env.development",
    "../frontend/env/.env.production",
    "../frontend/env/.env.staging",
];

// Function to update version in a Go file
function updateVersionInGoFile(filePath, currentVersion, newVersion) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        // Replace the version number
        const updatedData = data.replace(new RegExp(currentVersion, 'g'), newVersion);

        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file ${filePath}:`, err);
            } else {
                console.log(`Updated version in ${filePath} to ${newVersion}`);
            }
        });
    });
}

// Function to update version in a JSON file
function updateVersionInJsonFile(filePath, newVersion) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        // Replace both the version numbers
        let updatedData = data.replace(/"file_version": "[^"]+"/, `"file_version": "${newVersion}"`);
        updatedData = updatedData.replace(/"ProductVersion": "[^"]+"/, `"ProductVersion": "${newVersion}"`);

        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file ${filePath}:`, err);
            } else {
                console.log(`Updated version in ${filePath} to ${newVersion}`);
            }
        });
    });
}

// Function to update version in a NSIS file
function updateVersionInNSISFile(filePath, newVersion) {

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        // Replace the version number
        const updatedData = data.replace(/!define INFO_PRODUCTVERSION "[^"]+"/, `!define INFO_PRODUCTVERSION "${newVersion}"`);

        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file ${filePath}:`, err);
            } else {
                console.log(`Updated version in ${filePath} to ${newVersion}`);
            }
        });
    });

}

// Function to update version in a YML file
function updateVersionInYMLFile(filePath, newVersion) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        // Replace the version number
        const updatedData = data.replace(/version: "[^"]+"/, `version: "${newVersion}"`);

        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file ${filePath}:`, err);
            } else {
                console.log(`Updated version in ${filePath} to ${newVersion}`);
            }
        });
    });
}

// Function to update version in a plist/xml file
function updateVersionInPlistFile(filePath, newVersion) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        // Replace the version numbers for CFBundleVersion and CFBundleShortVersionString
        let updatedData = data.replace(/<key>CFBundleVersion<\/key>\s*<string>[^<]+<\/string>/, `<key>CFBundleVersion</key><string>${newVersion}</string>`);
        updatedData = updatedData.replace(/<key>CFBundleShortVersionString<\/key>\s*<string>[^<]+<\/string>/, `<key>CFBundleShortVersionString</key><string>${newVersion}</string>`);

        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file ${filePath}:`, err);
            } else {
                console.log(`Updated version in ${filePath} to ${newVersion}`);
            }
        });
    });
}

function updateVersionInEnvFile(filePath, newVersion) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        // Replace the version number
        const updatedData = data.replace(/APP_VERSION=[^ ]+/, `APP_VERSION=${newVersion}`);

        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file ${filePath}:`, err);
            } else {
                console.log(`Updated version in ${filePath} to ${newVersion}`);
            }
        });
    });
}

// Get the current version from command line arguments
const currentVersion = process.argv[2];
if (!currentVersion) {
    console.error('Please provide the current version number.');
    process.exit(1);
}

// Get the new version from command line arguments
const newVersion = process.argv[3];
if (!newVersion) {
    console.error('Please provide a new version number.');
    process.exit(1);
}

// Update version in all specified files
filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    const fileExtension = path.extname(file);

    // Is environment file?
    if (fileExtension === '.env') {
        updateVersionInEnvFile(filePath, newVersion);
    }

    else if (fileExtension === '.plist' || fileExtension === '.xml') {
        updateVersionInPlistFile(filePath, newVersion);
    } 
    else if (fileExtension === '.json') {
        updateVersionInJsonFile(filePath, newVersion);
    }
    else if (fileExtension === '.nsh') {
        updateVersionInNSISFile(filePath, newVersion);
    }
    else if (fileExtension === '.yml') {
        updateVersionInYMLFile(filePath, newVersion);
    }
    else {
        updateVersionInGoFile(filePath, currentVersion, newVersion);
    }
});