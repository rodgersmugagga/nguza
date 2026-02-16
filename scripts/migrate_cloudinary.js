#!/usr/bin/env node
/**
 * migrate_cloudinary.js
 *
 * Migration helper to move Cloudinary resources from the old folder
 * (agrova_listings) to the new folder (Nguza_listings) and update
 * MongoDB Listing documents to reference the new public IDs and URLs.
 *
 * Usage:
 *  - Copy your env vars (CLOUDINARY_URL or CLOUDINARY_API_KEY/SECRET and MONGODB_URI) into a .env file or export them.
 *  - Run a dry-run first:
 *      node scripts/migrate_cloudinary.js --dry-run
 *  - To perform the migration:
 *      node scripts/migrate_cloudinary.js
 *
 * Options:
 *  --dry-run    : only prints planned renames and DB updates
 *  --limit=N    : max resources to process (for testing)
 *  --continue   : continue even if an individual rename/update fails
 *
 * IMPORTANT: Run with care. Test in a staging environment first. Keep backups.
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import cloudinary from 'cloudinary';
import { MongoClient } from 'mongodb';

dotenv.config();

const OLD_PREFIX = 'agrova_listings';
const NEW_PREFIX = 'Nguza_listings';

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run') || process.env.DRY_RUN === '1';
const CONTINUE_ON_ERROR = argv.includes('--continue');
const limitArg = argv.find(a => a.startsWith('--limit='));
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : undefined;

const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
if (!CLOUDINARY_URL && (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME)) {
  console.error('Cloudinary credentials not found. Set CLOUDINARY_URL or CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET/CLOUDINARY_CLOUD_NAME in env.');
  process.exit(1);
}

cloudinary.v2.config(process.env.CLOUDINARY_URL || {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is required to update listing documents. Set it in env.');
  process.exit(1);
}

async function listResources(prefix, maxResults = 500) {
  // Cloudinary api.resources supports prefix and pagination
  const resources = [];
  let next_cursor = undefined;
  do {
    const opts = { type: 'upload', resource_type: 'image', prefix, max_results: Math.min(maxResults, 500) };
    if (next_cursor) opts.next_cursor = next_cursor;
    // eslint-disable-next-line no-await-in-loop
    const res = await cloudinary.v2.api.resources(opts);
    resources.push(...(res.resources || []));
    next_cursor = res.next_cursor;
    if (LIMIT && resources.length >= LIMIT) break;
  } while (next_cursor);
  return resources.slice(0, LIMIT || resources.length);
}

async function renameResource(oldPublicId, newPublicId) {
  // cloudinary.uploader.rename will move/rename the resource
  return cloudinary.v2.uploader.rename(oldPublicId, newPublicId, { overwrite: true });
}

function newPublicIdFor(oldPublicId) {
  if (oldPublicId.startsWith(`${OLD_PREFIX}/`)) return oldPublicId.replace(OLD_PREFIX, NEW_PREFIX);
  // fallback: just prefix
  return `${NEW_PREFIX}/${oldPublicId}`;
}

async function run() {
  console.log(`Migration start. DRY_RUN=${DRY_RUN} LIMIT=${LIMIT || 'none'}`);
  const resources = await listResources(OLD_PREFIX, 5000);
  console.log(`Found ${resources.length} resources under prefix '${OLD_PREFIX}'.`);

  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db();
  const listings = db.collection('listings');

  const mapping = [];

  for (const r of resources) {
    try {
      const oldId = r.public_id; // e.g. agrova_listings/abc123
      const newId = newPublicIdFor(oldId);
      const oldUrl = r.secure_url || r.url;

      console.log(` -> ${oldId}  ->  ${newId}`);
      if (DRY_RUN) {
        mapping.push({ oldId, newId, oldUrl, dryRun: true });
        continue;
      }

      // rename on Cloudinary
      // eslint-disable-next-line no-await-in-loop
      const renameRes = await renameResource(oldId, newId);
      const newUrl = renameRes.secure_url || renameRes.url;

      // update DB: replace occurrences in imagePublicIds arrays and imageUrls
      // find listings that reference the old public id
      // eslint-disable-next-line no-await-in-loop
      const cursor = listings.find({ imagePublicIds: oldId });
      // eslint-disable-next-line no-await-in-loop
      const docs = await cursor.toArray();
      for (const doc of docs) {
        const newPublicIds = (doc.imagePublicIds || []).map(pid => (pid === oldId ? newId : pid));
        const newImageUrls = (doc.imagePublicIds || []).map((pid, idx) => {
          const currentUrl = (doc.imageUrls || [])[idx] || '';
          if (pid === oldId) return newUrl || currentUrl;
          return currentUrl;
        });
        // eslint-disable-next-line no-await-in-loop
        await listings.updateOne({ _id: doc._id }, { $set: { imagePublicIds: newPublicIds, imageUrls: newImageUrls } });
        console.log(`    Updated listing ${doc._id} -> replaced public id in DB.`);
      }

      mapping.push({ oldId, newId, oldUrl, newUrl });
    } catch (err) {
      console.error('Error migrating resource', r.public_id, err?.message || err);
      if (!CONTINUE_ON_ERROR) {
        console.error('Aborting due to error. Use --continue to proceed on errors.');
        break;
      }
    }
  }

  // persist mapping to disk
  const outPath = path.resolve(process.cwd(), 'cloudinary_migration_mapping.json');
  fs.writeFileSync(outPath, JSON.stringify(mapping, null, 2));
  console.log(`Wrote mapping to ${outPath}`);

  await client.close();
  console.log('Migration finished.');
}

run().catch(err => {
  console.error('Migration failed:', err?.message || err);
  process.exit(1);
});
