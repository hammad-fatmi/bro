import express from 'express';
import 'dotenv/config';
import dns from 'node:dns/promises';
import cors from 'cors';

import connectDB from './database/db.js';

import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import uploadRoute from './routes/uploadRoutes.js';

import trendingRoutes from './routes/trendingRoutes.js';
import techMovesRoutes from './routes/techMovesRoutes.js';

import newsRoute from './routes/newsRoute.js';
import ytRoute from "./routes/ytRoute.js";
import networkingRoute from "./routes/networkingRoute.js";


const app = express();

// Optional DNS fix
dns.setServers(['8.8.8.8', '8.8.4.4']);

/* =========================
   MIDDLEWARE
========================= */

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',   // ✅ ADD THIS
  'http://codefeed.duckdns.org'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use('/api/v1/user', userRoute);
app.use('/api/v1/product', productRoute);
app.use("/api/news/networking", networkingRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/news', newsRoute);

app.use('/api/news/trending', trendingRoutes);
app.use('/api/news/tech-moves', techMovesRoutes);
app.use("/api/youtube", ytRoute);

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

startServer();