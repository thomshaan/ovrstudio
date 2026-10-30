# Cloudflare D1 setup

Run this once from the repository root in PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\setup-cloudflare-d1.ps1
```

The script uses your existing Wrangler login, creates (or reuses) the remote
`ovrstudio-cms` database in the Asia-Pacific region, adds the `CMS_DB`
binding to `wrangler.jsonc`, applies the schema, and verifies the database.
It never asks for or prints your Cloudflare API token or R2 upload token.

The script is safe to rerun. It does not drop tables or delete existing content.
