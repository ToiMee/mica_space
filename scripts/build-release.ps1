$ErrorActionPreference = 'Stop'

$root = Split-Path $PSScriptRoot -Parent
$package = Get-Content (Join-Path $root 'package.json') -Raw | ConvertFrom-Json
$version = [string]$package.version
$stage = Join-Path $root ("dist\mica-space-" + $version)
$zip = Join-Path $root ("dist\mica-space-" + $version + "-demo.zip")

if (Test-Path (Join-Path $root 'dist')) {
  Remove-Item (Join-Path $root 'dist') -Recurse -Force
}
New-Item -ItemType Directory -Path $stage -Force | Out-Null

$files = @(
  'index.js',
  'client.js',
  'package.json',
  'package-lock.json',
  'cordis.patch.yml',
  'README.md',
  'README.en.md',
  'CHANGELOG.md',
  'LICENSE',
  'PRIVACY.md',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'icon.svg'
)
foreach ($file in $files) {
  Copy-Item (Join-Path $root $file) (Join-Path $stage $file) -Force
}
Copy-Item (Join-Path $root 'copy') (Join-Path $stage 'copy') -Recurse -Force
Copy-Item (Join-Path $root 'locale') (Join-Path $stage 'locale') -Recurse -Force
Copy-Item (Join-Path $root 'packaging\INSTALL.md') (Join-Path $stage 'INSTALL.md') -Force

Push-Location $stage
try {
  & 'C:\Program Files\nodejs\npm.cmd' ci --omit=dev --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) { throw "npm ci failed with exit code $LASTEXITCODE" }
} finally {
  Pop-Location
}

Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zip -CompressionLevel Optimal
$size = [Math]::Round((Get-Item $zip).Length / 1MB, 1)
Write-Output ("Built " + $zip + " (" + $size + " MB)")
