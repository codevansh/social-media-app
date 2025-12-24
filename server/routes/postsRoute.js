import express from 'express';
import upload from '../configs/multer.js';
import { addPost, getPost, likePosts } from '../controllers/postController.js';

const postsRouter = express.Router();

postsRouter.post('/add', upload.array('images', 4), addPost)
postsRouter.get('/feed', getPost)
postsRouter.post('/like', likePosts)

export default postsRouter