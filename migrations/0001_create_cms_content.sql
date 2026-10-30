-- OVRStudio CMS: one JSON document per editable content collection.
-- The API validates allowed keys and performs writes atomically per collection.
CREATE TABLE IF NOT EXISTS cms_content (
  content_key TEXT PRIMARY KEY,
  content_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_cms_content_updated_at
  ON cms_content(updated_at);
