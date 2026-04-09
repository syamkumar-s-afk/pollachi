import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
import multer from 'multer';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { getDb } from './db';

const app = express();
const port = 3001;
const JWT_SECRET = 'your-super-secret-key-123';

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // For image uploads access
}));
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply rate limiting to all requests
app.use('/api/', limiter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Admin Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const db = await getDb();
  const { rows } = await db.query('SELECT * FROM admin WHERE username = $1', [username]);
  const admin = rows[0];
  
  if (admin && await bcrypt.compare(password, admin.password)) {
    const token = jwt.encode({ id: admin.id, exp: Date.now() + 1000 * 60 * 60 * 24 }, JWT_SECRET);
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
    if (decoded.exp < Date.now()) throw new Error('Token expired');
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Public Routes
app.get('/api/businesses', async (req, res) => {
  const db = await getDb();
  const { city, category, sub_category } = req.query;
  
  let q = 'SELECT * FROM businesses WHERE 1=1';
  const params: any[] = [];
  let paramIndex = 1;

  if (city) { q += ` AND LOWER(city) = LOWER($${paramIndex++})`; params.push(city); }
  if (category) { q += ` AND LOWER(category) = LOWER($${paramIndex++})`; params.push(category); }
  if (sub_category) { q += ` AND LOWER(sub_category) = LOWER($${paramIndex++})`; params.push(sub_category); }

  q += ' ORDER BY created_at DESC';

  const result = await db.query(q, params);
  res.json(result.rows);
});

// Admin Routes for Businesses
app.post('/api/businesses', auth, upload.single('imageFile'), async (req, res) => {
  const db = await getDb();
  const { name, category, sub_category, city, address, phone, whatsapp, adId } = req.body;
  let image = req.body.image || '';

  if (req.file) {
    image = `/uploads/${req.file.filename}`;
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
    image = `/uploads/${req.file.filename}`;
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

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
