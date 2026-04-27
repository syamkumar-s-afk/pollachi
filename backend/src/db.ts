import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { backfillBusinessAdIds } from './adIds';
dotenv.config();

let dbInstance: Pool | null = null;

function getBootstrapAdminPassword(): string | null {
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD?.trim();
  if (!password) {
    return null;
  }

  if (password.length < 12) {
    throw new Error('ADMIN_BOOTSTRAP_PASSWORD must be at least 12 characters long.');
  }

  return password;
}

export async function getDb() {
  if (dbInstance) return dbInstance;

  dbInstance = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  await dbInstance.query(`
    CREATE TABLE IF NOT EXISTS businesses (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      sub_category TEXT NOT NULL,
      city TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      map_url TEXT,
      image TEXT,
      adId TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      slug VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      display_order INT DEFAULT 0,
      is_priority BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subcategories (
      id SERIAL PRIMARY KEY,
      category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(category_id, name)
    );

    CREATE TABLE IF NOT EXISTS advertisements (
      id SERIAL PRIMARY KEY,
      slot TEXT NOT NULL UNIQUE,
      image_url TEXT,
      link_url TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS banners (
      id SERIAL PRIMARY KEY,
      slot TEXT NOT NULL UNIQUE,
      image_url TEXT,
      link_url TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_settings (
      id SERIAL PRIMARY KEY,
      setting_key VARCHAR(100) NOT NULL UNIQUE,
      setting_value VARCHAR(255) NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add is_priority column if it doesn't exist (migration)
  await dbInstance.query(`
    ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS is_priority BOOLEAN DEFAULT FALSE;
  `);

  await dbInstance.query(`
    ALTER TABLE businesses
    ADD COLUMN IF NOT EXISTS map_url TEXT;
  `);

  // Bootstrap the first admin only when an explicit password is configured.
  const adminRes = await dbInstance.query('SELECT id FROM admin WHERE username = $1', ['admin']);
  if (adminRes.rowCount === 0) {
    const bootstrapPassword = getBootstrapAdminPassword();
    if (bootstrapPassword) {
      const hash = await bcrypt.hash(bootstrapPassword, 10);
      await dbInstance.query('INSERT INTO admin (username, password) VALUES ($1, $2)', ['admin', hash]);
    } else {
      console.warn('[DB] No admin user exists. Set ADMIN_BOOTSTRAP_PASSWORD to create the first admin.');
    }
  }

  // Initialize default admin settings
  const settingsRes = await dbInstance.query(
    'SELECT id FROM admin_settings WHERE setting_key = $1',
    ['business_display_mode']
  );
  if (settingsRes.rowCount === 0) {
    await dbInstance.query(
      'INSERT INTO admin_settings (setting_key, setting_value) VALUES ($1, $2)',
      ['business_display_mode', 'category-based']
    );
  }

  await backfillBusinessAdIds(dbInstance);
  console.log('[DB] Business Ad IDs synchronized');

  // NOTE: Categories and subcategories are now managed exclusively through the admin panel.
  // No hardcoded seeding is performed. All categories must be created via the API.

  // Synchronize businesses back to subcategories table if missing (Import custom subcategories)
  const usedSubcats = await dbInstance.query('SELECT DISTINCT category, sub_category FROM businesses');
  for (const row of usedSubcats.rows) {
    const { category: catName, sub_category: subName } = row;
    if (!subName || !catName) continue;

    const catCheck = await dbInstance.query('SELECT id FROM categories WHERE name = $1', [catName]);
    if (catCheck.rowCount && catCheck.rowCount > 0) {
      const categoryId = catCheck.rows[0].id;
      const subCheck = await dbInstance.query(
        'SELECT id FROM subcategories WHERE category_id = $1 AND name = $2',
        [categoryId, subName]
      );
      
      if (subCheck.rowCount === 0) {
        const subSlug = subName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        await dbInstance.query(
          'INSERT INTO subcategories (category_id, name, slug, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
          [categoryId, subName, subSlug]
        );
      }
    }
  }

  console.log('[DB] Categories and Subcategories synchronized');

  // Advertisement slots (no sample businesses - admins must create categories first)
  const slots = ['ad1', 'ad2', 'ad3', 'inline-ad'];
  for (const slot of slots) {
    await dbInstance.query(
      `INSERT INTO advertisements (slot, image_url, link_url) VALUES ($1, $2, $3)
       ON CONFLICT (slot) DO NOTHING`,
      [slot, '', '']
    );
  }

  // Seed banner slots robustly
  const bannerSlots = ['banner1', 'banner2', 'banner3', 'banner4', 'banner5'];
  for (const slot of bannerSlots) {
    await dbInstance.query(
      `INSERT INTO banners (slot, image_url, link_url) VALUES ($1, $2, $3)
       ON CONFLICT (slot) DO NOTHING`,
      [slot, '', '']
    );
  }

  return dbInstance;
}
