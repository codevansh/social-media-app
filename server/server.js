import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import db from './configs/db.js';
import { inngest, functions } from './inngest/index.js'
import {serve} from 'inngest/express'
const app = express();

app.use(express.json());
app.use(cors());

await db();


app.get('/', (req, res) => {
    res.send('Server is running')
})

app.use("/api/inngest", serve({ client: inngest, functions }));

const PORT = process.env.port || 4000

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
