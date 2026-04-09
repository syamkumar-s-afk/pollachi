import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

let dbInstance: Pool | null = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  dbInstance = new Pool({
    connectionString: process.env.DATABASE_URL
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
  `);

  // Insert default admin if no admin
  const adminRes = await dbInstance.query('SELECT id FROM admin WHERE username = $1', ['admin']);
  if (adminRes.rowCount === 0) {
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('admin123', 10);
    await dbInstance.query('INSERT INTO admin (username, password) VALUES ($1, $2)', ['admin', hash]);
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
  }

  return dbInstance;
}
