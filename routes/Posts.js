import express from "express";
import { createPost, getAllPosts } from "../controllers/Posts.js";


const router = express.Router();

router.get("/", getAllPosts);
router.post("/", createPost);

const app = express();

// Increase payload size limits for large image data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Other middlewares like CORS
import cors from 'cors';
app.use(cors());

export default router;
