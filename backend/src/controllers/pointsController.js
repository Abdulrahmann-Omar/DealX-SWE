// src/controllers/pointsController.js
import { User, Transaction } from '../models';

// Earn points
export const earnPoints = async (req, res) => {
  try {
    const { userId, points, description } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await Transaction.create({ user_id: userId, points_earned: points, description });
    user.total_points += points;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Redeem points
export const redeemPoints = async (req, res) => {
  try {
    const { userId, rewardId, points } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.total_points < points) return res.status(400).json({ error: 'Not enough points' });

    await Transaction.create({ user_id: userId, points_redeemed: points, description: 'Redeemed reward' });
    user.total_points -= points;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
