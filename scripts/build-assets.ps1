# EXPERIUM asset pipeline
# Sources (read-only): ..\assets (videos, stills) + pre-extracted frame ZIPs (scratchpad)
# Output: ..\public\media\{video,poster,seq,still}
# - removes generator watermarks (delogo), strips audio, re-encodes for web
# - builds scroll-scrub WebP frame sequences (estate = clip3, drop = clip8)
param(
  [string]$FramesRoot = "C:\Users\LENOVO\AppData\Local\Temp\claude\c--REACT-Experium\732a65e8-e2a6-48ef-88e2-1927f1de69a6\scratchpad\zips"
)
$ErrorActionPreference = "Stop"
$root   = Split-Path $PSScriptRoot -Parent
$srcVid = Join-Path (Split-Path $root -Parent) "assets\video"
$srcImg = Join-Path (Split-Path $root -Parent) "assets\images"
$out    = Join-Path $root "public\media"
foreach ($d in "video","poster","seq\estate","seq\drop","still") {
  New-Item -ItemType Directory -Force (Join-Path $out $d) | Out-Null
}

# watermark regions: animated diamond cluster + "Veo" text (1280x720 video),
# diamond cluster only (1376x768 stills)
$dlVid   = "delogo=x=1080:y=530:w=185:h=175,delogo=x=1216:y=664:w=60:h=40"
$dlStill = "delogo=x=1185:y=615:w=145:h=148"

Write-Host "== videos =="
$clips = "clip2","clip3","clip4","clip5","clip6","clip7"
foreach ($c in $clips) {
  ffmpeg -y -v error -i (Join-Path $srcVid "$c.mp4") -an -vf $dlVid `
    -c:v libx264 -crf 21 -preset slow -pix_fmt yuv420p -movflags +faststart `
    (Join-Path $out "video\$c.mp4")
  ffmpeg -y -v error -i (Join-Path $out "video\$c.mp4") -frames:v 1 -q:v 3 `
    (Join-Path $out "poster\$c.jpg")
  Write-Host "  $c done"
}
ffmpeg -y -v error -i (Join-Path $srcVid "Experium.mp4") -an -vf $dlVid `
  -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart `
  (Join-Path $out "video\reveal.mp4")
# last frame of the reveal = wordmark still (finale hold + og fallback)
ffmpeg -y -v error -sseof -0.15 -i (Join-Path $out "video\reveal.mp4") -frames:v 1 -q:v 3 `
  (Join-Path $out "poster\reveal-end.jpg")
ffmpeg -y -v error -i (Join-Path $out "video\reveal.mp4") -frames:v 1 -q:v 3 `
  (Join-Path $out "poster\reveal.jpg")
Write-Host "  reveal done"

Write-Host "== scrub sequences =="
# estate: clip3 frames 1..238 step 3 (80 frames)
$i = 0
for ($n = 1; $n -le 238; $n += 3) {
  $src = Join-Path $FramesRoot ("clip3\ezgif-frame-{0:d3}.jpg" -f $n)
  $dst = Join-Path $out ("seq\estate\estate-{0:d3}.webp" -f $i)
  ffmpeg -y -v error -i $src -vf "$dlVid,scale=1152:-2" -c:v libwebp -quality 72 -preset picture $dst
  $i++
}
Write-Host "  estate: $i frames"
# drop: clip8 frames 1..199 step 2 (100 frames, ends fully black)
$i = 0
for ($n = 1; $n -le 199; $n += 2) {
  $src = Join-Path $FramesRoot ("clip8\ezgif-frame-{0:d3}.jpg" -f $n)
  $dst = Join-Path $out ("seq\drop\drop-{0:d3}.webp" -f $i)
  ffmpeg -y -v error -i $src -vf "$dlVid,scale=1152:-2" -c:v libwebp -quality 72 -preset picture $dst
  $i++
}
Write-Host "  drop: $i frames"

Write-Host "== stills =="
$stills = @{
  "arrival"   = "Frame1.jpg"
  "estate"    = "Frame3.jpg"
  "terrace"   = "Frame5.jpg"
  "hall"      = "Frame6.jpg"
  "hall-clean"= "Frame6 (2).jpg"
  "stair"     = "Frame7.jpg"
  "gameroom"  = "Frame8.jpg"
  "shot"      = "Frame9.jpg"
}
foreach ($k in $stills.Keys) {
  $src = Join-Path $srcImg $stills[$k]
  ffmpeg -y -v error -i $src -vf $dlStill -c:v libwebp -quality 82 -preset picture (Join-Path $out "still\$k.webp")
  ffmpeg -y -v error -i $src -vf "$dlStill,scale=800:-2" -c:v libwebp -quality 78 -preset picture (Join-Path $out "still\$k-800.webp")
}
# Frame2 (threshold, PNG, no watermark) - portrait-ish crop
ffmpeg -y -v error -i (Join-Path $srcImg "Frame2.png") -c:v libwebp -quality 82 -preset picture (Join-Path $out "still\threshold.webp")
ffmpeg -y -v error -i (Join-Path $srcImg "Frame2.png") -vf "scale=800:-2" -c:v libwebp -quality 78 -preset picture (Join-Path $out "still\threshold-800.webp")
# og image from arrival still
ffmpeg -y -v error -i (Join-Path $srcImg "Frame1.jpg") -vf "$dlStill,crop=1376:722:0:23,scale=1200:630" -q:v 4 (Join-Path $out "..\og.jpg")

Write-Host "== summary =="
$sz = (Get-ChildItem $out -Recurse -File | Measure-Object -Property Length -Sum).Sum
"total media: {0:n1} MB, {1} files" -f ($sz/1MB), (Get-ChildItem $out -Recurse -File).Count
