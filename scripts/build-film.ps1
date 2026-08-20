# EXPERIUM film pipeline — EVERY frame of clip1..clip8, in order, globally numbered.
# Output: public/media/film/{1280,640}/f0000.webp .. f1887.webp
# Validates: source frame count == emitted frame count per size (hard failure otherwise).
param(
  [string]$FramesRoot = "C:\Users\LENOVO\AppData\Local\Temp\claude\c--REACT-Experium\732a65e8-e2a6-48ef-88e2-1927f1de69a6\scratchpad\zips"
)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$out  = Join-Path $root "public\media\film"
# animated diamond cluster + "Veo" text (all frames are 1280x720)
$dl = "delogo=x=1080:y=530:w=185:h=175,delogo=x=1216:y=664:w=60:h=40"

$clips = @(
  @{ n = 1; count = 240 }, @{ n = 2; count = 240 }, @{ n = 3; count = 240 },
  @{ n = 4; count = 240 }, @{ n = 5; count = 240 }, @{ n = 6; count = 208 },
  @{ n = 7; count = 240 }, @{ n = 8; count = 240 }
)
$sizes = @(
  @{ w = 1280; q = 70 },
  @{ w = 640;  q = 66 }
)

$sourceTotal = 0
foreach ($c in $clips) {
  $actual = (Get-ChildItem (Join-Path $FramesRoot "clip$($c.n)") -File).Count
  if ($actual -ne $c.count) { throw "clip$($c.n): expected $($c.count) source frames, found $actual" }
  $sourceTotal += $actual
}
Write-Host "source frames: $sourceTotal"

foreach ($s in $sizes) {
  $dir = Join-Path $out "$($s.w)"
  New-Item -ItemType Directory -Force $dir | Out-Null
  $offset = 0
  foreach ($c in $clips) {
    $in = Join-Path $FramesRoot "clip$($c.n)\ezgif-frame-%03d.jpg"
    ffmpeg -y -v error -start_number 1 -i $in `
      -vf "$dl,scale=$($s.w):-2" -c:v libwebp -quality $($s.q) -preset picture `
      -start_number $offset (Join-Path $dir "f%04d.webp")
    Write-Host ("  {0}px clip{1}: frames {2}..{3}" -f $s.w, $c.n, $offset, ($offset + $c.count - 1))
    $offset += $c.count
  }
  $used = (Get-ChildItem $dir -File).Count
  $mb = [math]::Round(((Get-ChildItem $dir -File | Measure-Object -Property Length -Sum).Sum) / 1MB, 1)
  Write-Host ("{0}px: SOURCE={1} USED={2} ({3} MB)" -f $s.w, $sourceTotal, $used, $mb)
  if ($used -ne $sourceTotal) { throw "FRAME VALIDATION FAILED at $($s.w)px: source=$sourceTotal used=$used" }
}
Write-Host "FRAME VALIDATION PASSED: every source frame is used."
