import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import db from './configs/db.js';
import { inngest, functions } from './inngest/index.js'
import {serve} from 'inngest/express'
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRoutes.js';
import postsRouter from './routes/postsRoute.js';
import storyRouter from './routes/storyRoutes.js';
import messageRouter from './routes/messageRoute.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

await db();

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/user', userRouter)
app.use('/api/post', postsRouter)
app.use('/api/story', storyRouter)
app.use('/api/message', messageRouter)

const PORT = process.env.POST || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))