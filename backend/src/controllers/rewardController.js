// src/controllers/rewardController.js
import { Reward } from '../models';

export const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.findAll();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
