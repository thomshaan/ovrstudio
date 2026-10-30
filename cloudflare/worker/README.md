# OVRStudio Cloudflare R2 media uploads

This Worker accepts authenticated media uploads and stores the binary files in R2. The website receives a public URL under the configured R2 public base URL. CMS records still live in browser localStorage; this integration changes **media storage only**.

## 1. Prepare the bucket

1. In Cloudflare, open **R2 Object Storage** and create (or select) the bucket you want to use.
2. Make sure public access is enabled for the bucket's public development URL, or use a custom R2 domain.
3. Copy the exact bucket name into `wrangler.toml` at `bucket_name`.
4. The public URL configured for this project is currently:
   `https://pub-fffb5bb212294005837d690a745535a1.r2.dev`

The public URL is for file delivery only. Do not use it as the upload endpoint.

## 2. Deploy the Worker

From the repository root, with Node.js installed:

```bash
npx wrangler login
npx wrangler r2 bucket list
# Edit cloudflare/worker/wrangler.toml and replace REPLACE_WITH_YOUR_R2_BUCKET_NAME
npx wrangler secret put UPLOAD_TOKEN
npx wrangler deploy --config cloudflare/worker/wrangler.toml
```

When prompted for `UPLOAD_TOKEN`, enter a long random value (at least 32 random characters). Keep it private. The Worker checks this token before accepting any upload.

The Worker configuration restricts browser origins to `https://thomshaan.github.io` and `http://localhost:5173`. If the OVRStudio website uses a different/custom domain, add that exact origin to `ALLOWED_ORIGINS` in `wrangler.toml` and deploy again.

After deployment, copy the Worker URL. It will look similar to:

`https://ovrstudio-media-upload.<your-account-subdomain>.workers.dev`

## 3. Configure the website build

Set this environment variable in the environment that builds/deploys the website:

```env
VITE_R2_UPLOAD_ENDPOINT=https://YOUR-WORKER.workers.dev
```

The value is the Worker base URL, not the R2 public URL and not a URL ending in `/upload`. Rebuild/redeploy the website after setting it.

For local development, put the same value in a local `.env.local` file (do not commit secrets).

## 4. Upload from the CMS

Open the OVRStudio CMS and upload an image, video, audio file, gallery image, or 3D model. The first upload in a browser tab asks for the Worker upload token. It is kept only in that tab's session storage and is cleared when the tab session ends. The token is never compiled into the public website bundle.

Files up to 50MB are accepted. Uploaded objects are grouped into `images/`, `videos/`, `audio/`, and `models/` prefixes and get unique names.

## Notes

- R2 public access means anyone with a media URL can read that object. Do not upload private or confidential files.
- The Worker token protects the upload endpoint, but anyone who can access the CMS and knows the token can upload files. Rotate it with `npx wrangler secret put UPLOAD_TOKEN` if it is exposed.
- Existing Data URLs already saved in a browser's localStorage are not migrated automatically. Re-upload those assets through the CMS to move them into R2.
- CMS text/settings (projects, team, disciplines, and other configuration) remain in localStorage. This scope intentionally changes media storage only.
- For a production site, prefer a custom domain on the R2 bucket over the rate-limited `r2.dev` development URL.
