import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Import the connection function
import authRoutes from './routes/authRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/favorites', favoriteRoutes);

// Connect to MongoDB first, then start the server
const startServer = async () => {
  try {
    await connectDB(); // Wait for DB connection
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();