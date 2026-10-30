-- OVRStudio CMS: JSON documents for editable collections and one-time import marker.
CREATE TABLE IF NOT EXISTS cms_content (
 content_key TEXT PRIMARY KEY,
 content_json TEXT NOT NULL,
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_cms_content_updated_at ON cms_content(updated_at);
CREATE TABLE IF NOT EXISTS cms_meta (
 meta_key TEXT PRIMARY KEY,
 meta_value TEXT NOT NULL,
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
