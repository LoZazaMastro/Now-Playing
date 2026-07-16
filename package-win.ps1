$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Release = Join-Path $Root "release"
$Stage = Join-Path $Release "Now Playing"
$Zip = Join-Path $Release "Now-Playing-decky_Installer-2.0.0.zip"
$PublicZip = Join-Path (Split-Path -Parent $Root) "Now-Playing-decky_Installer-2.0.0.zip"

if (Test-Path $Release) { Remove-Item $Release -Recurse -Force }
New-Item -ItemType Directory -Force -Path $Stage | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Stage "dist") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Stage "bin") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Stage "vendor") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Stage "licenses") | Out-Null

if (Test-Path (Join-Path $Root "node_modules")) {
  if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm run build
  } elseif (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm run check:i18n
    pnpm run check:types
    pnpm exec rollup -c
  } else {
    throw "Neither npm nor pnpm is available to rebuild dist/index.js"
  }
} else {
  Write-Host "node_modules not found: using existing dist/index.js"
}

$Python = Get-Command python -ErrorAction SilentlyContinue
if (-not $Python) { $Python = Get-Command py -ErrorAction SilentlyContinue }
if ($Python) {
  if ($Python.Name -eq "py.exe" -or $Python.Name -eq "py") {
    & $Python.Source -3 -m py_compile (Join-Path $Root "main.py")
  } else {
    & $Python.Source -m py_compile (Join-Path $Root "main.py")
  }
  if ($LASTEXITCODE -ne 0) { throw "main.py failed Python syntax validation" }
} else {
  Write-Host "Python not found: skipping main.py syntax validation"
}

Copy-Item (Join-Path $Root "plugin.json") $Stage
Copy-Item (Join-Path $Root "main.py") $Stage
Copy-Item (Join-Path $Root "dist/index.js") (Join-Path $Stage "dist")
Copy-Item (Join-Path $Root "bin/MediaBridge.exe") (Join-Path $Stage "bin")
Copy-Item (Join-Path $Root "bin/ThumbnailBridge.exe") (Join-Path $Stage "bin")
Copy-Item (Join-Path $Root "bin/AppVolumeBridge.exe") (Join-Path $Stage "bin")
Copy-Item (Join-Path $Root "bin/SpotifyPlaybackBridge.exe") (Join-Path $Stage "bin")
Copy-Item (Join-Path $Root "vendor/*") (Join-Path $Stage "vendor") -Recurse -Force
Copy-Item (Join-Path $Root "licenses/*") (Join-Path $Stage "licenses") -Recurse -Force
Copy-Item (Join-Path $Root "package.json") $Stage
Copy-Item (Join-Path $Root "LICENSE") $Stage
Copy-Item (Join-Path $Root "NOTICE") $Stage
Copy-Item (Join-Path $Root "README.md") $Stage

if (Test-Path $Zip) { Remove-Item $Zip -Force }
Compress-Archive -Path $Stage -DestinationPath $Zip -Force
Copy-Item $Zip $PublicZip -Force
Write-Host "Created $Zip"
Write-Host "Updated $PublicZip"
