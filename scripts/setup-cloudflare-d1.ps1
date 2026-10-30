[CmdletBinding()]
param(
  [string]$DatabaseName = "ovrstudio-cms",
  [string]$BindingName = "CMS_DB",
  [switch]$SkipDeploy
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$configPath = Join-Path $repoRoot "wrangler.jsonc"
$migrationPath = Join-Path $repoRoot "migrations/0001_create_cms_content.sql"
$passwordPath = Join-Path $repoRoot ".cms-admin-password.txt"
$jwtPath = Join-Path $repoRoot ".cms-jwt-secret.txt"

function Invoke-Wrangler {
  param([string[]]$Arguments)
  Push-Location $repoRoot
  try {
    & npx --yes wrangler@latest @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Wrangler command failed: wrangler $($Arguments -join ' ')" }
  } finally { Pop-Location }
}

function New-SecretValue([int]$Bytes = 32) {
  $buffer = [byte[]]::new($Bytes)
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  try { $rng.GetBytes($buffer) } finally { $rng.Dispose() }
  return [Convert]::ToBase64String($buffer).TrimEnd('=').Replace('+','-').Replace('/','_')
}

function Set-WorkerSecret([string]$Name, [string]$Path, [string]$WorkerName = "") {
  $value = (Get-Content -Path $Path -Raw).Trim()
  $wranglerArgs = @("secret", "put", $Name)
  if ($WorkerName) { $wranglerArgs += @("--name", $WorkerName) }
  $value | & npx --yes wrangler@latest @wranglerArgs
  if ($LASTEXITCODE -ne 0) { throw "Could not configure Worker secret $Name on $WorkerName." }
}

if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
  throw "Bun is required. Install it from https://bun.sh, then rerun this script."
}
if (-not (Test-Path $configPath)) { throw "Could not find wrangler.jsonc at $configPath" }
if (-not (Test-Path $migrationPath)) { throw "Could not find the D1 schema migration at $migrationPath" }

Write-Host "`n[1/6] Checking your existing Cloudflare login..." -ForegroundColor Cyan
Invoke-Wrangler -Arguments @("whoami")

Write-Host "`n[2/6] Finding or creating the D1 database..." -ForegroundColor Cyan
$databaseId = $null
$listOutput = & npx --yes wrangler@latest d1 list --json 2>$null
if ($LASTEXITCODE -eq 0) {
  try {
    $parsed = ($listOutput -join "`n") | ConvertFrom-Json
    $entries = if ($parsed -is [array]) { $parsed } elseif ($parsed.result -is [array]) { $parsed.result } elseif ($parsed.databases -is [array]) { $parsed.databases } else { @() }
    foreach ($entry in $entries) {
      $name = if ($entry.database_name) { $entry.database_name } else { $entry.name }
      if ($name -eq $DatabaseName) {
        $databaseId = if ($entry.database_id) { $entry.database_id } elseif ($entry.uuid) { $entry.uuid } else { $entry.id }
        break
      }
    }
  } catch { Write-Warning "Could not parse the database list; checking the create response next." }
}
if (-not $databaseId) {
  Write-Host "Creating $DatabaseName in the Asia-Pacific region..."
  $createOutput = & npx --yes wrangler@latest d1 create $DatabaseName --location apac 2>&1
  if ($LASTEXITCODE -ne 0) { throw "D1 creation failed: $($createOutput -join "`n")" }
  $createText = $createOutput -join "`n"
  if ($createText -match '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}') {
    $databaseId = $Matches[0]
  } else {
    $listOutput = & npx --yes wrangler@latest d1 list --json
    $parsed = ($listOutput -join "`n") | ConvertFrom-Json
    $entries = if ($parsed -is [array]) { $parsed } elseif ($parsed.result -is [array]) { $parsed.result } elseif ($parsed.databases -is [array]) { $parsed.databases } else { @() }
    $entry = $entries | Where-Object { (($_.database_name) -or ($_.name)) -eq $DatabaseName } | Select-Object -First 1
    if ($entry) { $databaseId = if ($entry.database_id) { $entry.database_id } elseif ($entry.uuid) { $entry.uuid } else { $entry.id } }
  }
}
if (-not $databaseId) { throw "Could not resolve the D1 database ID after creation. No Worker deployment was attempted." }

$config = Get-Content $configPath -Raw | ConvertFrom-Json
if (-not $config.d1_databases) { $config | Add-Member -NotePropertyName d1_databases -NotePropertyValue @() }
$bindings = @($config.d1_databases)
$existing = @($bindings | Where-Object { $_.binding -eq $BindingName })
if ($existing.Count -gt 0) {
  $existing[0].database_name = $DatabaseName
  $existing[0].database_id = $databaseId
} else {
  $bindings += [pscustomobject]@{ binding = $BindingName; database_name = $DatabaseName; database_id = $databaseId }
}
$config.d1_databases = $bindings
$config | ConvertTo-Json -Depth 30 | Set-Content -Path $configPath -Encoding utf8

Write-Host "`n[3/6] Applying the D1 schema..." -ForegroundColor Cyan
Invoke-Wrangler -Arguments @("d1", "execute", $DatabaseName, "--remote", "--file", $migrationPath, "--yes")

Write-Host "`n[4/7] Saving the generated D1 binding to the current Git branch..." -ForegroundColor Cyan
if (Get-Command git -ErrorAction SilentlyContinue) {
  Push-Location $repoRoot
  try {
    $branch = (& git branch --show-current).Trim()
    if ($branch -and $branch -notin @("main", "master")) {
      & git add -- wrangler.jsonc
      & git commit --only wrangler.jsonc -m "Configure OVRStudio D1 database binding"
      if ($LASTEXITCODE -ne 0) { throw "Could not commit the generated D1 binding." }
      & git push origin $branch
      if ($LASTEXITCODE -ne 0) { throw "Could not push the generated D1 binding. Push the current branch, then rerun the setup script." }
    } else {
      Write-Warning "Current branch is main/master; the D1 binding was updated locally but not pushed automatically."
    }
  } finally { Pop-Location }
} else {
  Write-Warning "Git is not installed; the D1 binding was updated locally only."
}

Write-Host "`n[5/7] Creating secure CMS credentials..." -ForegroundColor Cyan
if (-not (Test-Path $passwordPath)) {
  $password = New-SecretValue 24
  [System.IO.File]::WriteAllText($passwordPath, $password, [System.Text.UTF8Encoding]::new($false))
}
if (-not (Test-Path $jwtPath)) {
  $jwt = New-SecretValue 48
  [System.IO.File]::WriteAllText($jwtPath, $jwt, [System.Text.UTF8Encoding]::new($false))
}
Set-WorkerSecret -Name "CMS_ADMIN_PASSWORD" -Path $passwordPath
Set-WorkerSecret -Name "CMS_JWT_SECRET" -Path $jwtPath
# Share the signed CMS session with the existing media Worker so uploads need no second token prompt.
Set-WorkerSecret -Name "CMS_JWT_SECRET" -Path $jwtPath -WorkerName "ovrstudio-media-upload"

if (-not $SkipDeploy) {
  Write-Host "`n[6/7] Installing dependencies and building the site..." -ForegroundColor Cyan
  Push-Location $repoRoot
  try {
    & bun install
    if ($LASTEXITCODE -ne 0) { throw "bun install failed." }
    & bun run build
    if ($LASTEXITCODE -ne 0) { throw "The Vite production build failed. Worker deployment was stopped." }
  } finally { Pop-Location }

  Write-Host "`n[7/7] Deploying the Worker and static website..." -ForegroundColor Cyan
  Invoke-Wrangler -Arguments @("deploy")
  Write-Host "`nDeploying the updated R2 upload Worker with CMS-session support..." -ForegroundColor Cyan
  Invoke-Wrangler -Arguments @("deploy", "--config", "cloudflare/worker/wrangler.toml")
} else {
  Write-Host "`n[5/6] Deployment skipped by request." -ForegroundColor Yellow
  Write-Host "Run 'bun install; bun run build; npx wrangler deploy' and 'npx wrangler deploy --config cloudflare/worker/wrangler.toml' when ready."
}

Write-Host "`nOVRStudio D1 CMS infrastructure is configured." -ForegroundColor Green
Write-Host "Admin password saved locally at: $passwordPath" -ForegroundColor Yellow
Write-Host "Open that local file and use its contents to sign in to the CMS."
Write-Host "The R2 media bucket and its existing upload token were not modified."
