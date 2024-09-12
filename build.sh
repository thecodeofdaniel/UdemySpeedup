#!/bin/env bash

# Get version
version=$(grep '"version"' manifest.json | sed -E 's/.*"version": "([0-9.]+)".*/\1/')

# Generate css
npm i
npm run tailwind:build

# Zip necessary files
zip -r -FS ./UdemySpeedup-$version.zip src icons manifest.json
