Add-Type -AssemblyName System.Drawing
$imgPath = "images_migration\branding\logo_principal.png"
$img = [System.Drawing.Image]::FromFile($imgPath)
$size = [math]::Min($img.Width, $img.Height)
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Transparent)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse(0, 0, $size, $size)
$g.SetClip($path)
$g.DrawImage($img, 0, 0, $size, $size)
$bmp.Save("favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$img.Dispose()
$bmp.Dispose()
Write-Host "Favicon created"
