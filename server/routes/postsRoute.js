import express from 'express';
import upload from '../configs/multer.js';
import { protect } from '../middleware/auth.js';
import { addPost, getPost, likePosts } from '../controllers/postController.js';

const postsRouter = express.Router();

postsRouter.post('/add', upload.array('images', 4), protect, addPost)
postsRouter.get('/feed', protect, getPost)
postsRouter.post('/like', protect, likePosts)

export default postsRouter