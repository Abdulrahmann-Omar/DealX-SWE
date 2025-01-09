import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Rewards = ({ onRedeem }) => {
  const API_URL = 'http://localhost:5000/api';

  const getRewards = () => {
    return axios.get(`${API_URL}/rewards`);
  };
  
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    // Fetch available rewards
    getRewards()
      .then((response) => setRewards(response.data))
      .catch((error) => console.error('Error fetching rewards:', error));
  }, []);

  return (
    <div>
      <h3>Available Rewards</h3>
      <ul>
        {rewards.map((reward) => (
          <li key={reward.id}>
            {reward.name} - {reward.points_required} points
            <button onClick={() => onRedeem(reward.id)}>Redeem</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rewards;
