Add-Type -AssemblyName System.Drawing

$baseDir = $PSScriptRoot
$srcPath = Join-Path $baseDir "public/assets/dio_talk_logo.png"
if (-not (Test-Path $srcPath)) {
    Write-Error "Cannot find source logo at $srcPath"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($srcPath)

$densities = @(
    @{ dir = "mipmap-mdpi"; size = 48; fgSize = 108 },
    @{ dir = "mipmap-hdpi"; size = 72; fgSize = 162 },
    @{ dir = "mipmap-xhdpi"; size = 96; fgSize = 216 },
    @{ dir = "mipmap-xxhdpi"; size = 144; fgSize = 324 },
    @{ dir = "mipmap-xxxhdpi"; size = 192; fgSize = 432 }
)

foreach ($d in $densities) {
    $outDir = Join-Path $baseDir "android/app/src/main/res/$($d.dir)"
    if (-not (Test-Path $outDir)) {
        New-Item -ItemType Directory -Force -Path $outDir | Out-Null
    }

    # 1. Standard full-bleed launcher icon (ic_launcher.png & ic_launcher_round.png)
    $bmp = New-Object System.Drawing.Bitmap($d.size, $d.size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($srcImg, 0, 0, $d.size, $d.size)
    $g.Dispose()

    $bmp.Save((Join-Path $outDir "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save((Join-Path $outDir "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    # 2. Adaptive Icon Foreground (ic_launcher_foreground.png)
    # Android Adaptive Icon spec: 108x108 total canvas, 66-72 safe viewport in center
    $fgBmp = New-Object System.Drawing.Bitmap($d.fgSize, $d.fgSize)
    $fgG = [System.Drawing.Graphics]::FromImage($fgBmp)
    $fgG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $fgG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $fgG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $fgG.Clear([System.Drawing.Color]::Transparent)

    $contentSize = [int]($d.fgSize * 0.70)
    $offset = [int](($d.fgSize - $contentSize) / 2)
    $fgG.DrawImage($srcImg, $offset, $offset, $contentSize, $contentSize)
    $fgG.Dispose()

    $fgBmp.Save((Join-Path $outDir "ic_launcher_foreground.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $fgBmp.Dispose()

    Write-Host "Generated centered launcher icons for $($d.dir) (size=$($d.size), fg=$($d.fgSize))"
}

$srcImg.Dispose()
Write-Host "Icon generation completed successfully."
