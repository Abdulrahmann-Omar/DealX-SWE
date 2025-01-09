import React, { useState } from 'react';
import axios from 'axios';

const RedeemReward = ({ userId, rewardId }) => {

const API_URL = 'http://localhost:5000/api';



 const redeemReward = (userId, rewardId) => {
  return axios.post(`${API_URL}/rewards/redeem`, {
    userId,
    rewardId
  });
};

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRedeem = () => {
    redeemReward(userId, rewardId)
      .then((response) => {
        setSuccess('Reward redeemed successfully!');
        setError(null);
      })
      .catch((error) => {
        setSuccess(null);
        setError('Failed to redeem reward.');
      });
  };

  return (
    <div>
      <button onClick={handleRedeem}>Redeem Reward</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default RedeemReward;
