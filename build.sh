#!/bin/bash

# Exit on any error
set -e

# Run Tailwind build
echo "Building Tailwind CSS..."
npm run tailwind:build || { echo "Error building Tailwind CSS"; exit 1; }

# Check if dist directory exists, if not run build
if [ ! -d "dist" ]; then
    echo "dist directory not found. Running build..."
    npm run build || { echo "Error running build"; exit 1; }
fi

# Create a temporary directory for packaging
mkdir -p package/dist
mkdir -p package/imgs
mkdir -p package/src

# Copy necessary files and directories
echo "Copying files..."
cp -r dist/* package/dist/ || { echo "Error copying dist"; exit 1; }
cp imgs/logo-64.png package/imgs/ || { echo "Error copying logo"; exit 1; }
cp manifest.json package/ || { echo "Error copying manifest.json"; exit 1; }

# Copy all files from src except .ts files
find src -type f ! -name "*.ts" -exec cp --parents {} package/ \; || { echo "Error copying src files"; exit 1; }

# Create the zip file (removing old one if it exists)
version=$(grep '"version"' manifest.json | sed -E 's/.*"version": "([0-9.]+)".*/\1/')
zipfile="UdemySpeedup-$version.zip"
echo "Creating zip file..."
cd package && zip -r ../$zipfile . && cd ..

# Clean up
echo "Cleaning up..."
rm -rf package

echo "Extension packaged successfully as $zipfile"
