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
$Marker = Join-Path $Root ".playhub-release.json"

@{
  repository = "Now-Playing"
  version = $Version
} | ConvertTo-Json | Set-Content -LiteralPath $Marker -Encoding utf8

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
  throw "AppVolumeBridge.exe must not be shipped. Now Playing 2.5.0 uses direct Windows Core Audio."
}

if (Test-Path (Join-Path $Root "node_modules")) {
  if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }
  } elseif (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm run check:i18n
    if ($LASTEXITCODE -ne 0) { throw "Translation validation failed" }
    pnpm run check:types
    if ($LASTEXITCODE -ne 0) { throw "TypeScript validation failed" }
    pnpm exec rollup -c
    if ($LASTEXITCODE -ne 0) { throw "Rollup build failed" }
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
    & $Python.Source -3 -m py_compile (Join-Path $Root "main.py") (Join-Path $Root "ytmusic_service.py")
  } else {
    & $Python.Source -m py_compile (Join-Path $Root "main.py") (Join-Path $Root "ytmusic_service.py")
  }
  if ($LASTEXITCODE -ne 0) { throw "main.py failed Python syntax validation" }
} else {
  Write-Host "Python not found: skipping main.py syntax validation"
}

Copy-Item (Join-Path $Root "plugin.json") $Stage
Copy-Item (Join-Path $Root "main.py") $Stage
Copy-Item (Join-Path $Root "ytmusic_service.py") $Stage
Copy-Item (Join-Path $Root "dist/index.js") (Join-Path $Stage "dist")
Copy-Item (Join-Path $Root "bin/MediaBridge.exe") (Join-Path $Stage "bin")
Copy-Item (Join-Path $Root "bin/ThumbnailBridge.exe") (Join-Path $Stage "bin")
Copy-Item (Join-Path $Root "bin/SpotifyPlaybackBridge.exe") (Join-Path $Stage "bin")
Copy-Item (Join-Path $Root "vendor/*") (Join-Path $Stage "vendor") -Recurse -Force
Copy-Item (Join-Path $Root "licenses/*") (Join-Path $Stage "licenses") -Recurse -Force
Copy-Item (Join-Path $Root "package.json") $Stage
Copy-Item $Marker $Stage
Copy-Item (Join-Path $Root "LICENSE") $Stage
Copy-Item (Join-Path $Root "NOTICE") $Stage

$ResolvedStage = [IO.Path]::GetFullPath($Stage).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
$InstallerGeneratedDirectories = Get-ChildItem -LiteralPath $Stage -Recurse -Directory -Force | Where-Object {
  $_.Name -in @("__pycache__", ".pytest_cache")
} | Sort-Object { $_.FullName.Length } -Descending
foreach ($GeneratedDirectory in $InstallerGeneratedDirectories) {
  $ResolvedGeneratedDirectory = [IO.Path]::GetFullPath($GeneratedDirectory.FullName)
  if (-not $ResolvedGeneratedDirectory.StartsWith($ResolvedStage, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove generated installer data outside the staging directory"
  }
  Remove-Item -LiteralPath $ResolvedGeneratedDirectory -Recurse -Force
}

if (Test-Path $Zip) { Remove-Item $Zip -Force }
Compress-Archive -Path $Stage -DestinationPath $Zip -Force
Copy-Item $Zip $PublicZip -Force

New-Item -ItemType Directory -Force -Path $ProjectStage | Out-Null
$ProjectExclude = @(".git", "release", "node_modules", "__pycache__", ".pnpm-store")
Get-ChildItem -LiteralPath $Root -Force | Where-Object {
  $ProjectExclude -notcontains $_.Name
} | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $ProjectStage -Recurse -Force
}

$ResolvedProjectStage = [IO.Path]::GetFullPath($ProjectStage).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
$GeneratedDirectories = Get-ChildItem -LiteralPath $ProjectStage -Recurse -Directory -Force | Where-Object {
  $_.Name -in @("obj", "target", "publish", "publish_tmp", "__pycache__", ".pytest_cache", ".pnpm-store")
} | Sort-Object { $_.FullName.Length } -Descending
foreach ($GeneratedDirectory in $GeneratedDirectories) {
  $ResolvedGeneratedDirectory = [IO.Path]::GetFullPath($GeneratedDirectory.FullName)
  if (-not $ResolvedGeneratedDirectory.StartsWith($ResolvedProjectStage, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove generated project data outside the staging directory"
  }
    Remove-Item -LiteralPath $ResolvedGeneratedDirectory -Recurse -Force
}
$GeneratedFiles = Get-ChildItem -LiteralPath $ProjectStage -Recurse -File -Force | Where-Object {
  $_.Name -eq "SOURCE_RECOVERY.md" -or $_.Extension -in @(".map", ".pyc", ".pyo", ".tmp", ".temp", ".bak", ".orig", ".rej", ".log")
}
foreach ($GeneratedFile in $GeneratedFiles) {
  $ResolvedGeneratedFile = [IO.Path]::GetFullPath($GeneratedFile.FullName)
  if (-not $ResolvedGeneratedFile.StartsWith($ResolvedProjectStage, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove generated project data outside the staging directory"
  }
  Remove-Item -LiteralPath $ResolvedGeneratedFile -Force
}
Compress-Archive -Path $ProjectStage -DestinationPath $PublicProjectZip -CompressionLevel Optimal -Force

Write-Host "Created $Zip"
Write-Host "Updated $PublicZip"
Write-Host "Updated $PublicProjectZip"
