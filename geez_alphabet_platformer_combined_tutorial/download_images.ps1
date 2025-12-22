# PowerShell script to download images for the Geez Alphabet Game

$words = @(
    "breakfast",
    "hello",
    "world",
    "book",
    "friend",
    "water",
    "sun",
    "moon",
    "tree",
    "flower",
    "lunch",
    "dinner",
    "mother",
    "father",
    "sister",
    "brother"
)

$assetsFolder = "assets"

# Create assets folder if it doesn't exist
if (-not (Test-Path $assetsFolder)) {
    New-Item -ItemType Directory -Path $assetsFolder
}

Write-Host "Downloading images..." -ForegroundColor Green

foreach ($word in $words) {
    $outputPath = Join-Path $assetsFolder "$word.jpg"
    
    if (Test-Path $outputPath) {
        Write-Host "Skipping $word.jpg (already exists)" -ForegroundColor Yellow
        continue
    }
    
    try {
        # Using Unsplash Source API for free images
        $url = "https://source.unsplash.com/600x400/?$word"
        Write-Host "Downloading image for: $word" -ForegroundColor Cyan
        
        Invoke-WebRequest -Uri $url -OutFile $outputPath -TimeoutSec 10
        
        if (Test-Path $outputPath) {
            Write-Host "✓ Successfully downloaded: $word.jpg" -ForegroundColor Green
        }
        
        Start-Sleep -Milliseconds 500
    }
    catch {
        Write-Host "✗ Failed to download image for: $word" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nDownload complete!" -ForegroundColor Green
Write-Host "Images saved to: $(Resolve-Path $assetsFolder)" -ForegroundColor Cyan
