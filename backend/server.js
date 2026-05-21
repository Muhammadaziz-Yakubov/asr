import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import dashboardRouter from './routes/dashboard.js';
import storesRouter from './routes/stores.js';
import ordersRouter from './routes/orders.js';
import paymentsRouter from './routes/payments.js';
import financeRouter from './routes/finance.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/asr_tracker';

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());

// Routes Middleware
app.use('/api/dashboard', dashboardRouter);
app.use('/api/stores', storesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/finance', financeRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ASR Debt Tracker Backend is running' });
});

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB database connection established successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB database connection error:', err);
    process.exit(1);
  });
