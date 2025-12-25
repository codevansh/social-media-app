import express from 'express';
import upload from '../configs/multer.js';
import { addPost, getPost, likePosts } from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const postsRouter = express.Router();

postsRouter.post('/add', protect, upload.array('images', 4), addPost)
postsRouter.get('/feed', protect, getPost)
postsRouter.post('/:id/like', protect, likePosts)

export default postsRouter