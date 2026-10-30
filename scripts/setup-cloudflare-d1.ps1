[CmdletBinding()]
param(
  [string]$DatabaseName = "ovrstudio-cms",
  [string]$BindingName = "CMS_DB"
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$configPath = Join-Path $repoRoot "wrangler.jsonc"
$migrationPath = Join-Path $repoRoot "migrations/0001_create_cms_content.sql"

function Invoke-Wrangler {
  param([string[]]$Arguments)
  Push-Location $repoRoot
  try {
    & npx --yes wrangler@latest @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Wrangler command failed: wrangler $($Arguments -join ' ')" }
  } finally {
    Pop-Location
  }
}

if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
  throw "Bun is required. Install it from https://bun.sh, then run this script again."
}
if (-not (Test-Path $configPath)) { throw "Could not find wrangler.jsonc at $configPath" }
if (-not (Test-Path $migrationPath)) { throw "Could not find the D1 schema migration at $migrationPath" }

Write-Host "`n[1/4] Checking Cloudflare authentication..." -ForegroundColor Cyan
Invoke-Wrangler -Arguments @("whoami")

Write-Host "`n[2/4] Finding or creating the D1 database..." -ForegroundColor Cyan
Push-Location $repoRoot
try {
  $listOutput = & npx --yes wrangler@latest d1 list --json 2>$null
  $databaseId = $null
  if ($LASTEXITCODE -eq 0) {
    $listText = $listOutput -join "`n"
    try {
      $parsed = $listText | ConvertFrom-Json
      $entries = @()
      if ($parsed -is [array]) { $entries = $parsed }
      elseif ($parsed.result -is [array]) { $entries = $parsed.result }
      elseif ($parsed.databases -is [array]) { $entries = $parsed.databases }
      foreach ($entry in $entries) {
        $name = if ($entry.database_name) { $entry.database_name } else { $entry.name }
        if ($name -eq $DatabaseName) {
          $databaseId = if ($entry.database_id) { $entry.database_id } elseif ($entry.uuid) { $entry.uuid } else { $entry.id }
          break
        }
      }
    } catch {
      Write-Warning "Could not parse the D1 list response; attempting database creation."
    }
  }

  if (-not $databaseId) {
    Write-Host "Creating $DatabaseName in the Asia-Pacific region..."
    & npx --yes wrangler@latest d1 create $DatabaseName --binding $BindingName --update-config --location apac
    if ($LASTEXITCODE -ne 0) { throw "D1 creation failed. Check the Wrangler output above." }
  } else {
    Write-Host "Found existing database $DatabaseName ($databaseId). Ensuring the Worker binding exists..."
    $configText = Get-Content $configPath -Raw
    $config = $configText | ConvertFrom-Json
    if (-not $config.d1_databases) { $config | Add-Member -NotePropertyName d1_databases -NotePropertyValue @() }
    $existing = @($config.d1_databases | Where-Object { $_.binding -eq $BindingName })
    if ($existing.Count -eq 0) {
      $binding = [ordered]@{
        binding = $BindingName
        database_name = $DatabaseName
        database_id = $databaseId
      }
      $config.d1_databases = @($config.d1_databases) + $binding
      $config | ConvertTo-Json -Depth 20 | Set-Content -Path $configPath -Encoding utf8
    } elseif ($existing[0].database_id -ne $databaseId) {
      throw "Binding $BindingName already points to a different D1 database. Refusing to overwrite it automatically."
    }
  }
} finally {
  Pop-Location
}

Write-Host "`n[3/4] Applying the CMS schema to the remote database..." -ForegroundColor Cyan
Invoke-Wrangler -Arguments @("d1", "execute", $DatabaseName, "--remote", "--file", $migrationPath, "--yes")

Write-Host "`n[4/4] Verifying database details..." -ForegroundColor Cyan
Invoke-Wrangler -Arguments @("d1", "info", $DatabaseName, "--json")

Write-Host "`nD1 is ready. Database: $DatabaseName | Binding: $BindingName" -ForegroundColor Green
Write-Host "The script does not touch your existing R2 bucket or upload token."
Write-Host "Next: deploy the CMS Worker/API code that uses this binding."
