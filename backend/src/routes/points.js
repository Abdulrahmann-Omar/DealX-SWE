// src/routes/pointsRoutes.js
import express from 'express';
import { earnPoints, redeemPoints } from '../controllers/pointsController.js';

const PointsRouter = express.Router();

PointsRouter.post('/earn', earnPoints);
PointsRouter.post('/redeem', redeemPoints);

export default PointsRouter;
