import express from 'express';
import generateImageRoute from './routes/GenerateImage.js';  // Import the route you created
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS for cross-origin requests
app.use(cors());

// Route for image generation
app.use("/api/generate-image", generateImageRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
