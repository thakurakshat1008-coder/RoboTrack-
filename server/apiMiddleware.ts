import express from 'express';
import { apiRouter } from './routes.ts';

export const apiApp = express();
apiApp.use(express.json());
apiApp.use('/api', apiRouter);
