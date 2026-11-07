# OVRStudio Cloud CMS deployment

## One-time setup

Prerequisites: Bun, Git, and an existing Wrangler login to the Cloudflare account that owns the `ovrstudio` and `ovrstudio-media-upload` Workers.

From the repository root, on the `feature/cloudflare-d1-cms-sync` branch, run:

```powershell
git fetch origin
git checkout feature/cloudflare-d1-cms-sync
git pull
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\setup-cloudflare-d1.ps1
```

The script performs the complete deployment:

1. Reuses the existing Wrangler authentication.
2. Finds or creates the remote `ovrstudio-cms` D1 database in APAC.
3. writes its database ID into `wrangler.jsonc` and applies the SQL schema.
4. Generates a strong CMS admin password and a separate signing secret locally.
5. uploads the secrets to the main Worker and shares the signing secret with the existing R2 upload Worker.
6. Installs dependencies, builds the Vite site, deploys the D1-backed website Worker, and deploys the R2 Worker update.

The generated CMS password is saved in the ignored local file `.cms-admin-password.txt`. Open that file locally to sign in. The JWT signing secret is saved in `.cms-jwt-secret.txt`; do not share either file. The script never reads, displays, replaces, or asks for the existing R2 `UPLOAD_TOKEN`.

The R2 Worker accepts either its existing upload token or a valid short-lived CMS admin session. Therefore, after signing into the CMS, media uploads use the CMS session automatically and no second token prompt is needed.

## First content migration

After deployment, open the website on the browser that contains the current OVRStudio CMS content and sign in using the generated password. On the first authenticated login, the browser's seven existing localStorage collections are copied into D1 as the initial canonical snapshot. The import runs only once; it will not overwrite a database that has already been initialized.

After that, CMS edits publish to D1 immediately. Other open clients refresh the shared content every five seconds. Browser localStorage remains a cache/fallback, not the shared source of truth.

## Important

- Do not commit `.cms-admin-password.txt` or `.cms-jwt-secret.txt`; both are ignored by Git.
- Keep the existing R2 bucket and public URL unchanged.
- This script deploys directly with Wrangler. If Workers Builds are also enabled for the main Worker, merge the feature branch into the configured build branch after setup so future source-controlled builds include the same Worker entry point and D1 binding.

## R2 media delivery

The existing `ovrstudio` R2 bucket remains unchanged. The media Worker now serves uploaded objects through its public `/media/<object-key>` route as well as accepting uploads at `/upload`. This route preserves the object's content type, supports browser byte-range requests for video playback, and returns CORS headers for the configured site origins.

New uploads save the Worker media URL in the CMS. Older records containing the public `pub-fffb5bb212294005837d690a745535a1.r2.dev` URL are automatically normalized by the frontend to the same media route, so existing R2 objects do not need to be uploaded again.

`VITE_R2_UPLOAD_ENDPOINT` should be the base URL of the existing `ovrstudio-media-upload` Worker (without `/upload`). `VITE_CMS_API_BASE` is optional; when unset, the frontend uses the `ovrstudio` CMS Worker URL so GitHub Pages deployments still publish to D1.
