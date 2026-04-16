import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

let dbInstance: Pool | null = null;

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
  `);

  // Add is_priority column if it doesn't exist (migration)
  await dbInstance.query(`
    ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS is_priority BOOLEAN DEFAULT FALSE;
  `);

  // Insert default admin if no admin
  const adminRes = await dbInstance.query('SELECT id FROM admin WHERE username = $1', ['admin']);
  if (adminRes.rowCount === 0) {
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('admin123', 10);
    await dbInstance.query('INSERT INTO admin (username, password) VALUES ($1, $2)', ['admin', hash]);
  }

  // Seed categories if not exists
  const catRes = await dbInstance.query('SELECT COUNT(*) as cnt FROM categories');
  if (parseInt(catRes.rows[0].cnt, 10) === 0) {
    const categoryData = [
      { name: 'Education', slug: 'education', subcategories: ['School', 'College'] },
      { name: 'Finance', slug: 'finance', subcategories: [] },
      { name: 'Food & Beverage', slug: 'food-beverage', subcategories: ['Cafe'] },
      { name: 'Healthcare', slug: 'healthcare', subcategories: ['Hospital', 'Clinic', 'Pharmacy'] },
      { name: 'Real Estate', slug: 'real-estate', subcategories: [] },
      { name: 'Retail', slug: 'retail', subcategories: ['Supermarket', "Men's Wear", "Women's Wear", 'Electronics'] },
      { name: 'Services', slug: 'services', subcategories: ['Hotels'] },
      { name: 'Technology', slug: 'technology', subcategories: [] },
      { name: 'Travel & Transport', slug: 'travel-transport', subcategories: [] },
      { name: 'Automotive', slug: 'automotive', subcategories: ['Automotive Repair'] },
      { name: 'Grocery', slug: 'grocery', subcategories: ['Vegetable, Milk'] },
      { name: 'Restaurant', slug: 'restaurant', subcategories: ['Veg', 'Non-veg', 'Restaurant'] }
    ];

    for (const cat of categoryData) {
      const catInsert = await dbInstance.query(
        'INSERT INTO categories (name, slug, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id',
        [cat.name, cat.slug]
      );
      const categoryId = catInsert.rows[0].id;

      for (const subcat of cat.subcategories) {
        const subcatSlug = subcat.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        await dbInstance.query(
          'INSERT INTO subcategories (category_id, name, slug, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
          [categoryId, subcat, subcatSlug]
        );
      }
    }
    console.log('[DB] Categories seeded successfully');
  }

  // Insert sample data if no businesses
  const bRes = await dbInstance.query('SELECT COUNT(*) as cnt FROM businesses');
  if (parseInt(bRes.rows[0].cnt, 10) === 0) {
    const sampleBusinesses = [
      {
        name: 'Amman Maligai',
        category: 'Grocery',
        sub_category: 'Vegetable, Milk',
        city: 'Coimbatore',
        address: '4/758-d5, Ravanan Complex, Andavar, Namakkal, Tamil Nadu, India- 637001',
        phone: '+919876543210',
        whatsapp: '+919876543210',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
        adId: '#AdSR001'
      },
      {
        name: 'SK Briyani',
        category: 'Restaurant',
        sub_category: 'Non-veg',
        city: 'Coimbatore',
        address: '4/758-d5, Ravanan Complex, Andavar, Namakkal, Tamil Nadu, India- 637001',
        phone: '+919876543210',
        whatsapp: '+919876543210',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=800&q=80',
        adId: '#AdSR002'
      }
    ];

    for (const sb of sampleBusinesses) {
      await dbInstance.query(
        `INSERT INTO businesses (name, category, sub_category, city, address, phone, whatsapp, image, adId)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [sb.name, sb.category, sb.sub_category, sb.city, sb.address, sb.phone, sb.whatsapp, sb.image, sb.adId]
      );
    }
    console.log('[DB] Businesses seeded successfully');
  }

  // Seed advertisements robustly
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
