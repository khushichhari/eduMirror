import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // ✅ Import mongoose
import simulateRoute from './routes/simulate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/simulate', simulateRoute);

app.get('/', (req, res) => {
  res.send('Edumirror Backend Running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
