import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { getDb } from './db';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const app = express();
const port = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-123';

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // For image uploads access
}));
app.use(cors());
app.use(express.json());



// Storage for images in memory before uploading to Supabase
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper to upload to Supabase Storage
async function uploadToSupabase(file: Express.Multer.File): Promise<string> {
  const fileExt = path.extname(file.originalname).toLowerCase();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}${fileExt}`;
  const bucketName = 'product-images';
  
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) {
    console.error('Supabase upload error:', error);
    // Suggest bucket existence fix in error message
    throw new Error(`Failed to upload to Supabase bucket "${bucketName}". Please ensure the bucket exists and is public.`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return publicUrl;
}

// Admin Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const db = await getDb();
  const { rows } = await db.query('SELECT * FROM admin WHERE username = $1', [username]);
  const admin = rows[0];

  if (admin && await bcrypt.compare(password, admin.password)) {
    const token = jwt.encode({ id: admin.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Middleware
const auth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token');
    const decoded = jwt.decode(token, JWT_SECRET);
    if (decoded.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired');
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Public Routes
app.get('/api/businesses', async (req, res) => {
  const db = await getDb();
  const { city, category, sub_category, page: rawPage, limit: rawLimit } = req.query;

  const page = Math.max(1, parseInt(rawPage as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(rawLimit as string, 10) || 20));
  const offset = (page - 1) * limit;

  let whereClause = ' WHERE 1=1';
  const params: any[] = [];
  let paramIndex = 1;

  if (city) { whereClause += ` AND LOWER(city) = LOWER($${paramIndex++})`; params.push(city); }
  if (category) { whereClause += ` AND LOWER(category) = LOWER($${paramIndex++})`; params.push(category); }
  if (sub_category) { whereClause += ` AND LOWER(sub_category) = LOWER($${paramIndex++})`; params.push(sub_category); }

  // Get total count
  const countResult = await db.query(`SELECT COUNT(*) as total FROM businesses${whereClause}`, params);
  const total = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(total / limit);

  // Get paginated data
  const dataQuery = `SELECT * FROM businesses${whereClause} ORDER BY created_at ASC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  const result = await db.query(dataQuery, [...params, limit, offset]);

  res.json({
    data: result.rows,
    total,
    page,
    totalPages,
    limit,
  });
});

// GET a single business by ID (public)
app.get('/api/businesses/:id', async (req, res) => {
  try {
    const db = await getDb();
    const businessId = parseInt(req.params.id, 10);

    if (!businessId || isNaN(businessId)) {
      return res.status(400).json({ error: 'Invalid business ID' });
    }

    const result = await db.query(
      'SELECT * FROM businesses WHERE id = $1',
      [businessId]
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch business' });
  }
});

// Admin Routes for Businesses
app.post('/api/businesses', auth, upload.single('imageFile'), async (req, res) => {
  const db = await getDb();
  const { name, category, sub_category, city, address, phone, whatsapp, adId } = req.body;
  let image = req.body.image || '';

  if (req.file) {
    try {
      image = await uploadToSupabase(req.file);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Image upload failed' });
    }
  }

  const result = await db.query(
    `INSERT INTO businesses (name, category, sub_category, city, address, phone, whatsapp, image, adId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
    [name, category, sub_category, city, address, phone, whatsapp, image, adId]
  );
  res.json({ id: result.rows[0].id });
});

app.put('/api/businesses/:id', auth, upload.single('imageFile'), async (req, res) => {
  const db = await getDb();
  const { name, category, sub_category, city, address, phone, whatsapp, adId } = req.body;
  let image = req.body.image;

  if (req.file) {
    try {
      image = await uploadToSupabase(req.file);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Image upload failed' });
    }
  }

  if (req.file) {
    await db.query(
      `UPDATE businesses SET name=$1, category=$2, sub_category=$3, city=$4, address=$5, phone=$6, whatsapp=$7, image=$8, adId=$9 WHERE id=$10`,
      [name, category, sub_category, city, address, phone, whatsapp, image, adId, req.params.id]
    );
  } else {
    await db.query(
      `UPDATE businesses SET name=$1, category=$2, sub_category=$3, city=$4, address=$5, phone=$6, whatsapp=$7, adId=$8 WHERE id=$9`,
      [name, category, sub_category, city, address, phone, whatsapp, adId, req.params.id]
    );
  }
  res.json({ success: true });
});

app.delete('/api/businesses/:id', auth, async (req, res) => {
  const db = await getDb();
  await db.query('DELETE FROM businesses WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// Helper function to generate slug
const generateSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\p{L}\p{N}_\-]/gu, '').substring(0, 100);
};

// Helper function to get business count for a category
const getBusinessCountForCategory = async (db: any, categoryName: string): Promise<number> => {
  const result = await db.query('SELECT COUNT(*) as cnt FROM businesses WHERE LOWER(category) = LOWER($1)', [categoryName]);
  return parseInt(result.rows[0].cnt, 10);
};

// Helper function to get business count for a subcategory
const getBusinessCountForSubcategory = async (db: any, subcategoryName: string): Promise<number> => {
  const result = await db.query('SELECT COUNT(*) as cnt FROM businesses WHERE LOWER(sub_category) = LOWER($1)', [subcategoryName]);
  return parseInt(result.rows[0].cnt, 10);
};

// ─── CATEGORY ENDPOINTS ───

// GET /api/categories - Fetch all categories with nested subcategories (public)
app.get('/api/categories', async (req, res) => {
  try {
    const db = await getDb();
    const categoriesResult = await db.query(
      'SELECT id, name, slug, description, display_order, is_priority, created_at, updated_at FROM categories ORDER BY display_order ASC, is_priority DESC'
    );

    const categories = categoriesResult.rows;
    const categoriesWithSubs = await Promise.all(
      categories.map(async (cat: any) => {
        const subsResult = await db.query(
          'SELECT id, category_id, name, slug, display_order, created_at, updated_at FROM subcategories WHERE category_id = $1 ORDER BY display_order ASC',
          [cat.id]
        );
        return {
          ...cat,
          subcategories: subsResult.rows
        };
      })
    );

    res.json({ data: categoriesWithSubs, total: categoriesWithSubs.length });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch categories', code: 'ERROR' });
  }
});

// POST /api/categories - Create category (protected)
app.post('/api/categories', auth, async (req, res) => {
  try {
    const db = await getDb();
    const { name, description, display_order } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        error: 'Category name must be between 2 and 100 characters',
        code: 'INVALID_NAME'
      });
    }

    const slug = generateSlug(name);
    const trimmedName = name.trim();

    // Check for duplicate (case-insensitive)
    const duplicateCheck = await db.query(
      'SELECT id FROM categories WHERE LOWER(name) = LOWER($1)',
      [trimmedName]
    );

    if (duplicateCheck.rowCount && duplicateCheck.rowCount > 0) {
      return res.status(409).json({
        error: `Category '${trimmedName}' already exists`,
        code: 'DUPLICATE_NAME'
      });
    }

    // Determine display_order: if not provided, use max existing + 1
    let finalDisplayOrder = display_order;
    if (finalDisplayOrder === undefined || finalDisplayOrder === null) {
      const maxOrderResult = await db.query('SELECT MAX(display_order) as max_order FROM categories');
      const maxOrder = maxOrderResult.rows[0]?.max_order || 0;
      finalDisplayOrder = maxOrder + 1;
    }

    const result = await db.query(
      'INSERT INTO categories (name, slug, description, display_order, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, name, slug, description, display_order, created_at, updated_at',
      [trimmedName, slug, description || null, finalDisplayOrder]
    );

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create category', code: 'ERROR' });
  }
});

// PUT /api/categories/:id - Update category (protected)
app.put('/api/categories/:id', auth, async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { name, description, is_priority, display_order } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        error: 'Category name must be between 2 and 100 characters',
        code: 'INVALID_NAME'
      });
    }

    const trimmedName = name.trim();

    // Check if category exists
    const categoryCheck = await db.query('SELECT name FROM categories WHERE id = $1', [id]);
    if (!categoryCheck.rowCount || categoryCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Category not found', code: 'NOT_FOUND' });
    }

    const originalName = categoryCheck.rows[0].name;

    // Check for duplicate (case-insensitive, excluding current)
    if (trimmedName.toLowerCase() !== originalName.toLowerCase()) {
      const duplicateCheck = await db.query(
        'SELECT id FROM categories WHERE LOWER(name) = LOWER($1) AND id != $2',
        [trimmedName, id]
      );

      if (duplicateCheck.rowCount && duplicateCheck.rowCount > 0) {
        return res.status(409).json({
          error: `Category '${trimmedName}' already exists`,
          code: 'DUPLICATE_NAME'
        });
      }
    }

    const slug = generateSlug(trimmedName);
    const priorityValue = is_priority === true ? true : false;
    const displayOrderValue = display_order !== undefined ? display_order : null;

    await db.query(
      'UPDATE categories SET name = $1, slug = $2, description = $3, is_priority = $4, display_order = COALESCE($5, display_order), updated_at = NOW() WHERE id = $6',
      [trimmedName, slug, description || null, priorityValue, displayOrderValue, id]
    );

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update category', code: 'ERROR' });
  }
});

// PATCH /api/categories/:id/priority - Toggle category priority (protected)
app.patch('/api/categories/:id/priority', auth, async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { is_priority } = req.body;

    // Check if category exists
    const categoryCheck = await db.query('SELECT id, is_priority FROM categories WHERE id = $1', [id]);
    if (!categoryCheck.rowCount || categoryCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Category not found', code: 'NOT_FOUND' });
    }

    const priorityValue = is_priority === true ? true : false;

    await db.query(
      'UPDATE categories SET is_priority = $1, updated_at = NOW() WHERE id = $2',
      [priorityValue, id]
    );

    res.json({ success: true, is_priority: priorityValue });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update category priority', code: 'ERROR' });
  }
});

// DELETE /api/categories/:id - Delete category with usage validation (protected)
app.delete('/api/categories/:id', auth, async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;

    // Check if category exists
    const categoryCheck = await db.query('SELECT name FROM categories WHERE id = $1', [id]);
    if (!categoryCheck.rowCount || categoryCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Category not found', code: 'NOT_FOUND' });
    }

    const categoryName = categoryCheck.rows[0].name;

    // Check if any business uses this category
    const usageCount = await getBusinessCountForCategory(db, categoryName);
    if (usageCount > 0) {
      return res.status(409).json({
        error: `Cannot delete: ${usageCount} business${usageCount !== 1 ? 'es' : ''} use${usageCount !== 1 ? '' : 's'} this category`,
        code: 'IN_USE',
        usageCount
      });
    }

    // Delete category (subcategories cascade due to FK constraint)
    await db.query('DELETE FROM categories WHERE id = $1', [id]);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete category', code: 'ERROR' });
  }
});

// ─── SUBCATEGORY ENDPOINTS ───

// POST /api/categories/:id/subcategories - Create subcategory (protected)
app.post('/api/categories/:id/subcategories', auth, async (req, res) => {
  try {
    const db = await getDb();
    const { id: categoryId } = req.params;
    const { name, display_order } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        error: 'Subcategory name must be between 2 and 100 characters',
        code: 'INVALID_NAME'
      });
    }

    // Check if category exists
    const categoryCheck = await db.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
    if (!categoryCheck.rowCount || categoryCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Category not found', code: 'NOT_FOUND' });
    }

    const trimmedName = name.trim();

    // Check for duplicate within this category (case-insensitive)
    const duplicateCheck = await db.query(
      'SELECT id FROM subcategories WHERE category_id = $1 AND LOWER(name) = LOWER($2)',
      [categoryId, trimmedName]
    );

    if (duplicateCheck.rowCount && duplicateCheck.rowCount > 0) {
      return res.status(409).json({
        error: `Subcategory '${trimmedName}' already exists in this category`,
        code: 'DUPLICATE_NAME'
      });
    }

    const slug = generateSlug(trimmedName);

    // Determine display_order: if not provided, use max existing + 1 for this category
    let finalDisplayOrder = display_order;
    if (finalDisplayOrder === undefined || finalDisplayOrder === null) {
      const maxOrderResult = await db.query(
        'SELECT MAX(display_order) as max_order FROM subcategories WHERE category_id = $1',
        [categoryId]
      );
      const maxOrder = maxOrderResult.rows[0]?.max_order || 0;
      finalDisplayOrder = maxOrder + 1;
    }

    const result = await db.query(
      'INSERT INTO subcategories (category_id, name, slug, display_order, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, category_id, name, slug, display_order, created_at, updated_at',
      [categoryId, trimmedName, slug, finalDisplayOrder]
    );

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create subcategory', code: 'ERROR' });
  }
});

// PUT /api/subcategories/:id - Update subcategory (protected)
app.put('/api/subcategories/:id', auth, async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { name, display_order } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        error: 'Subcategory name must be between 2 and 100 characters',
        code: 'INVALID_NAME'
      });
    }

    // Check if subcategory exists
    const subcatCheck = await db.query('SELECT category_id, name FROM subcategories WHERE id = $1', [id]);
    if (!subcatCheck.rowCount || subcatCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Subcategory not found', code: 'NOT_FOUND' });
    }

    const categoryId = subcatCheck.rows[0].category_id;
    const originalName = subcatCheck.rows[0].name;
    const trimmedName = name.trim();

    // Check for duplicate within same category (case-insensitive, excluding current)
    if (trimmedName.toLowerCase() !== originalName.toLowerCase()) {
      const duplicateCheck = await db.query(
        'SELECT id FROM subcategories WHERE category_id = $1 AND LOWER(name) = LOWER($2) AND id != $3',
        [categoryId, trimmedName, id]
      );

      if (duplicateCheck.rowCount && duplicateCheck.rowCount > 0) {
        return res.status(409).json({
          error: `Subcategory '${trimmedName}' already exists in this category`,
          code: 'DUPLICATE_NAME'
        });
      }
    }

    const slug = generateSlug(trimmedName);
    const displayOrderValue = display_order !== undefined ? display_order : null;

    await db.query(
      'UPDATE subcategories SET name = $1, slug = $2, display_order = COALESCE($3, display_order), updated_at = NOW() WHERE id = $4',
      [trimmedName, slug, displayOrderValue, id]
    );

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update subcategory', code: 'ERROR' });
  }
});

// DELETE /api/subcategories/:id - Delete subcategory (protected)
app.delete('/api/subcategories/:id', auth, async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;

    // Check if subcategory exists
    const subcatCheck = await db.query('SELECT name FROM subcategories WHERE id = $1', [id]);
    if (!subcatCheck.rowCount || subcatCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Subcategory not found', code: 'NOT_FOUND' });
    }

    const subcategoryName = subcatCheck.rows[0].name;

    // Check if any business uses this subcategory
    const usageCount = await getBusinessCountForSubcategory(db, subcategoryName);
    if (usageCount > 0) {
      return res.status(409).json({
        error: `Cannot delete: ${usageCount} business${usageCount !== 1 ? 'es' : ''} use${usageCount !== 1 ? '' : 's'} this subcategory`,
        code: 'IN_USE',
        usageCount
      });
    }

    // Delete subcategory
    await db.query('DELETE FROM subcategories WHERE id = $1', [id]);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete subcategory', code: 'ERROR' });
  }
});

// ─── ADVERTISEMENT ENDPOINTS ───

// GET /api/advertisements - Fetch all advertisements (public)
app.get('/api/advertisements', async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.query('SELECT id, slot, image_url, link_url, updated_at FROM advertisements ORDER BY slot ASC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch advertisements', code: 'ERROR' });
  }
});

// PUT /api/advertisements/:slot - Update advertisement (protected)
app.put('/api/advertisements/:slot', auth, upload.single('imageFile'), async (req, res) => {
  try {
    const db = await getDb();
    const { slot } = req.params;
    const { link_url } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
      try {
        image_url = await uploadToSupabase(req.file);
      } catch (err) {
        return res.status(500).json({ error: 'Image upload failed' });
      }
    }

    const check = await db.query('SELECT * FROM advertisements WHERE slot = $1', [slot]);
    if (!check.rowCount || check.rowCount === 0) {
      // Create slot dynamically if it doesn't exist
      await db.query(
        'INSERT INTO advertisements (slot, image_url, link_url, updated_at) VALUES ($1, $2, $3, NOW())',
        [slot, image_url || '', link_url || '']
      );
    } else {
      // Update existing slot
      if (req.file || image_url !== undefined) {
        await db.query(
          'UPDATE advertisements SET image_url=$1, link_url=$2, updated_at=NOW() WHERE slot=$3',
          [image_url, link_url || '', slot]
        );
      } else {
        await db.query(
          'UPDATE advertisements SET link_url=$1, updated_at=NOW() WHERE slot=$2',
          [link_url || '', slot]
        );
      }
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update advertisement', code: 'ERROR' });
  }
});

// ─── BANNER ENDPOINTS ───

// GET /api/banners - Fetch all banners (public)
app.get('/api/banners', async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.query('SELECT id, slot, image_url, link_url, updated_at FROM banners ORDER BY slot ASC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch banners', code: 'ERROR' });
  }
});

// PUT /api/banners/:slot - Update banner image/link (protected)
app.put('/api/banners/:slot', auth, upload.single('imageFile'), async (req, res) => {
  try {
    const db = await getDb();
    const { slot } = req.params;
    const { link_url } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
      try {
        image_url = await uploadToSupabase(req.file);
      } catch (err) {
        return res.status(500).json({ error: 'Image upload failed' });
      }
    }

    const check = await db.query('SELECT id FROM banners WHERE slot = $1', [slot]);
    if (!check.rowCount || check.rowCount === 0) {
      await db.query(
        'INSERT INTO banners (slot, image_url, link_url, updated_at) VALUES ($1, $2, $3, NOW())',
        [slot, image_url || '', link_url || '']
      );
    } else {
      if (req.file || image_url !== undefined) {
        await db.query(
          'UPDATE banners SET image_url=$1, link_url=$2, updated_at=NOW() WHERE slot=$3',
          [image_url, link_url || '', slot]
        );
      } else {
        await db.query(
          'UPDATE banners SET link_url=$1, updated_at=NOW() WHERE slot=$2',
          [link_url || '', slot]
        );
      }
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update banner', code: 'ERROR' });
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
