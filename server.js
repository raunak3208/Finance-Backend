const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// 404 middleware 
const notFound = require('./middleware/notFound');

dotenv.config();
connectDB();

const app = express();

// Middleware 
app.use(cors());         
app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Finance Dashboard API is running!' });
});

// 404 Handler (VERY IMPORTANT: always after routes)
app.use(notFound);

// Start Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});