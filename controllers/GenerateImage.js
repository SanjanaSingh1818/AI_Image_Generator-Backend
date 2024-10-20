import axios from 'axios';
import * as dotenv from 'dotenv';
import { createError } from '../error.js';

dotenv.config();

// Verify if API key is being loaded
console.log("Loaded Hugging Face API Key:", process.env.HUGGING_FACE_API_KEY);

export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      console.error("Prompt not provided in request.");
      return next(createError(400, "Prompt is required."));
    }

    console.log("Prompt received:", prompt);

    // Making request to Hugging Face API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`, // Use API key from .env file
        },
        responseType: 'arraybuffer', // Ensure we're getting binary data (for images)
      }
    );

    // Check if response was successful
    if (response.status !== 200) {
      console.error("Error with Hugging Face API:", response.status, response.data);
      return next(createError(500, `Hugging Face API Error: ${response.status}`));
    }

    // Convert image to base64
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    if (!base64Image) {
      console.error("Failed to generate image from response data:", response.data);
      return next(createError(500, "Image generation failed."));
    }

    
    // Send generated image in base64 format
    res.status(200).json({ photo: base64Image });

  } catch (error) {
    console.error("Error in image generation:", error);

    // Check if the error has a response (coming from the API)
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
      next(createError(error.response.status, error.response.data));
    } else {
      next(createError(500, error.message || "Internal Server Error"));
    }
  }
};
