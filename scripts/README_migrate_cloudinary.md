# Cloudinary & Listing migration

## Purpose

This helper migrates Cloudinary images stored under the folder `agrova_listings` to `Nguza_listings` and updates MongoDB Listing documents to reference the new public IDs and image URLs.

## Important notes

- Test in a staging environment first.
- Back up your database and Cloudinary account if possible.
- The script supports a dry-run mode and writes a mapping file (`cloudinary_migration_mapping.json`).

## Usage

1. Create a `.env` in the repo root (or ensure variables are exported):

```
MONGODB_URI=mongodb+srv://.../yourdb
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
# or CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME
```

2. Dry run (recommended):

```
node scripts/migrate_cloudinary.js --dry-run
```

3. Real run:

```
node scripts/migrate_cloudinary.js
```

## Options

- `--dry-run` : only prints planned operations, does not perform renames or DB updates.
- `--limit=N` : process up to N resources (useful for testing).
- `--continue` : continue on errors instead of aborting.

## After the run

- The script writes `cloudinary_migration_mapping.json` with details of changed resources.
- Verify a sample of listings and image URLs in your app.

If you want me to run a small test pass (dry-run) or generate a migration plan for production with a rollback strategy, tell me which environment (staging/production) and I'll prepare the exact commands and run notes.
