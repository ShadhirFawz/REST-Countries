// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';

dotenv.config();

const app = express();
// CORS Configuration
const allowedOrigins = [
  'https://rest-countries-pearl-five.vercel.app',
  // Add other domains if needed
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Handle OPTIONS requests
app.options('*', cors());

// Additional headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://rest-countries-pearl-five.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/favorites', favoriteRoutes);

export const server = app.listen(0); // 0 means random port
export default app;