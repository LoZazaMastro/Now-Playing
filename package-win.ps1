$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Release = Join-Path $Root "release"
$Stage = Join-Path $Release "Now-Playing-decky-installable"
$Zip = Join-Path $Release "Now-Playing-decky-installable.zip"

if (Test-Path $Release) { Remove-Item $Release -Recurse -Force }
New-Item -ItemType Directory -Force -Path $Stage | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Stage "dist") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Stage "bin") | Out-Null

if (Test-Path (Join-Path $Root "node_modules")) {
  npm run build
} else {
  Write-Host "node_modules not found: using existing dist/index.js"
}

Copy-Item (Join-Path $Root "plugin.json") $Stage
Copy-Item (Join-Path $Root "main.py") $Stage
Copy-Item (Join-Path $Root "dist/index.js") (Join-Path $Stage "dist")
Copy-Item (Join-Path $Root "bin/MediaBridge.exe") (Join-Path $Stage "bin")

if (Test-Path $Zip) { Remove-Item $Zip -Force }
Compress-Archive -Path (Join-Path $Stage "*") -DestinationPath $Zip -Force
Write-Host "Created $Zip"
