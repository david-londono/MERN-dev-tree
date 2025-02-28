import express from 'express'; // Module JS
// const express = require('express') => common JS
import 'dotenv/config'
import router from './router';
import { connectDB } from './config/db'
import cors from 'cors';
import { corsConfig } from './config/cors';

connectDB();

const app = express();

// CORS
app.use(cors(corsConfig));


// Leer datos de formularios
app.use(express.json());
app.use('/api', router);


export default app;

