/**
 * Run once to drop stale indexes from all role collections.
 *
 * Drops:
 *   - user_1  (stale reference field index, no longer in schema)
 *
 * Usage:
 *   node scripts/drop-stale-indexes.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('No MONGO_URI found in environment. Check your .env file.');
  process.exit(1);
}

// Index names that are stale and should be dropped
const STALE_INDEX_NAMES = ['user_1'];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB\n');

  const db = mongoose.connection.db;
  const collections = ['doctors', 'patients', 'admins', 'users'];

  for (const col of collections) {
    try {
      const indexes = await db.collection(col).indexes();

      for (const idx of indexes) {
        if (STALE_INDEX_NAMES.includes(idx.name)) {
          await db.collection(col).dropIndex(idx.name);
          console.log(`✓ Dropped "${idx.name}" from "${col}"`);
        }
      }
    } catch (err) {
      // Collection may not exist — skip silently
      if (err.codeName !== 'NamespaceNotFound') {
        console.warn(`  Could not process "${col}": ${err.message}`);
      }
    }
  }

  console.log('\nDone. Restart your backend server.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
