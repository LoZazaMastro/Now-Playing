$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Parent = Split-Path -Parent $Root
$Version = (Get-Content (Join-Path $Root "package.json") -Raw | ConvertFrom-Json).version
$Release = Join-Path $Root "release"
$Stage = Join-Path $Release "Now Playing"
$ProjectStage = Join-Path $Release "Now-Playing-project-$Version"
$Zip = Join-Path $Release "Now-Playing-decky_Installer-$Version.zip"
$PublicZip = Join-Path $Parent "Now-Playing-decky_Installer-$Version.zip"
$PublicProjectZip = Join-Path $Parent "Now-Playing-project-$Version.zip"

$ResolvedRoot = [IO.Path]::GetFullPath($Root).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
$ResolvedRelease = [IO.Path]::GetFullPath($Release)
if (-not $ResolvedRelease.StartsWith($ResolvedRoot, [StringComparison]::OrdinalIgnoreCase)) {
  throw "Refusing to recreate a release directory outside the Now Playing project"
}

if (Test-Path $Release) { Remove-Item $Release -Recurse -Force }
New-Item -ItemType Directory -Force -Path $Stage | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Stage "dist") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Stage "bin") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Stage "vendor") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Stage "licenses") | Out-Null

if (Test-Path (Join-Path $Root "bin/AppVolumeBridge.exe")) {
  throw "AppVolumeBridge.exe must not be shipped. Now Playing 2.1.0 uses direct Windows Core Audio."
}

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

New-Item -ItemType Directory -Force -Path $ProjectStage | Out-Null
$ProjectExclude = @("release", "node_modules", "__pycache__", ".pnpm-store")
Get-ChildItem -LiteralPath $Root -Force | Where-Object {
  $ProjectExclude -notcontains $_.Name
} | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $ProjectStage -Recurse -Force
}

$ResolvedProjectStage = [IO.Path]::GetFullPath($ProjectStage).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
$GeneratedDirectories = Get-ChildItem -LiteralPath $ProjectStage -Recurse -Directory -Force | Where-Object {
  $_.Name -in @("target", "__pycache__", ".pytest_cache", ".pnpm-store")
} | Sort-Object { $_.FullName.Length } -Descending
foreach ($GeneratedDirectory in $GeneratedDirectories) {
  $ResolvedGeneratedDirectory = [IO.Path]::GetFullPath($GeneratedDirectory.FullName)
  if (-not $ResolvedGeneratedDirectory.StartsWith($ResolvedProjectStage, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove generated project data outside the staging directory"
  }
  Remove-Item -LiteralPath $ResolvedGeneratedDirectory -Recurse -Force
}
Compress-Archive -Path $ProjectStage -DestinationPath $PublicProjectZip -CompressionLevel Optimal -Force

Write-Host "Created $Zip"
Write-Host "Updated $PublicZip"
Write-Host "Updated $PublicProjectZip"
