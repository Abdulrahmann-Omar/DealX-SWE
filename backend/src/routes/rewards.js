// src/routes/rewardRoutes.js
import express from 'express';
import { getAllRewards } from '../controllers/rewardController.js';

const RewardRouter = express.Router();

RewardRouter.get('/', getAllRewards);

export default RewardRouter;
