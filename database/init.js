const fs = require('fs');
const path = require('path');
const sqlite3 = require('../backend/node_modules/sqlite3').verbose();

const dbPath = path.join(__dirname, 'delish.db');
const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.sql');

console.log('--- Initializing Delish House Database ---');
console.log('Database target:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

// Run schema and seed
const schemaSql = fs.readFileSync(schemaPath, 'utf8');
const seedSql = fs.readFileSync(seedPath, 'utf8');

db.serialize(() => {
  db.exec(schemaSql, (err) => {
    if (err) {
      console.error('Error executing schema.sql:', err.message);
      return;
    }
    console.log('✓ Schema applied successfully.');

    db.exec(seedSql, (seedErr) => {
      if (seedErr) {
        console.error('Error executing seed.sql:', seedErr.message);
        return;
      }
      console.log('✓ Seed data populated successfully.');

      // Verify count
      db.get('SELECT COUNT(*) AS count FROM merchants', (cErr, row) => {
        if (!cErr) {
          console.log(`✓ Total merchants in database: ${row.count}`);
        }
        db.get('SELECT COUNT(*) AS count FROM menus', (mErr, mRow) => {
          if (!mErr) {
            console.log(`✓ Total culinary menu items: ${mRow.count}`);
          }
          console.log('🎉 Database initialization complete!');
          db.close();
        });
      });
    });
  });
});

