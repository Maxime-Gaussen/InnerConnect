import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import apiRouter from './router/api.js';

const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:4200',
    credentials: true
}));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.listen(process.env.PORT);
app.use(express.json());
app.use(cookieParser());

app.use('/api/session', authLimiter);
app.use('/api', apiRouter);
app.use('/', express.static('public'));

app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status ?? err.statusCode ?? 500;
    res.status(status).json({ message: err.message ?? 'Une erreur interne est survenue.' });
});

