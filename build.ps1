$ErrorActionPreference = 'Stop'

function Invoke-Step {
    param(
        [scriptblock]$Command,
        [string]$ErrorMessage
    )

    & $Command
    if ($LASTEXITCODE -ne 0) {
        Write-Error $ErrorMessage
        exit 1
    }
}

# Run Tailwind build
Write-Host "Building Tailwind CSS..."
Invoke-Step { npm run tailwind:build } "Error building Tailwind CSS"

# Check if dist directory exists, if not run build
if (-not (Test-Path "dist")) {
    Write-Host "dist directory not found. Running build..."
    Invoke-Step { npm run build } "Error running build"
}

# Create a temporary directory for packaging
New-Item -ItemType Directory -Force -Path "package/dist" | Out-Null
New-Item -ItemType Directory -Force -Path "package/imgs" | Out-Null
New-Item -ItemType Directory -Force -Path "package/src" | Out-Null

# Copy necessary files and directories
Write-Host "Copying files..."
Copy-Item -Path "dist/*" -Destination "package/dist/" -Recurse -Force
Copy-Item -Path "imgs/logo-64.png" -Destination "package/imgs/" -Force
Copy-Item -Path "manifest.json" -Destination "package/" -Force

# Copy all files from src except .ts files, preserving their folder structure
$projectRoot = (Get-Location).Path
Get-ChildItem -Path "src" -Recurse -File | Where-Object { $_.Extension -ne ".ts" } | ForEach-Object {
    $relativePath = $_.FullName.Substring($projectRoot.Length + 1)
    $destination = Join-Path "package" $relativePath
    New-Item -ItemType Directory -Force -Path (Split-Path $destination) | Out-Null
    Copy-Item -Path $_.FullName -Destination $destination -Force
}

# Create the zip file (removing old one if it exists)
$manifest = Get-Content "manifest.json" -Raw | ConvertFrom-Json
$version = $manifest.version
$zipfile = "UdemySpeedup-$version.zip"

Write-Host "Creating zip file..."
if (Test-Path $zipfile) {
    Remove-Item $zipfile -Force
}
Compress-Archive -Path "package/*" -DestinationPath $zipfile

# Clean up
Write-Host "Cleaning up..."
Remove-Item -Recurse -Force "package"

Write-Host "Extension packaged successfully as $zipfile"
