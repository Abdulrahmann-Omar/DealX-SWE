import React, { useState } from 'react';
import UserDashboard from './UserDashboard';
import Rewards from './Rewards';
import RedeemReward from './RedeemReward'; // Make sure to import RedeemReward

function Reward() {
  const [userId] = useState(1); // Assume user ID 1 for now
  const [selectedRewardId, setSelectedRewardId] = useState(null);

  const handleRewardSelect = (rewardId) => {
    setSelectedRewardId(rewardId);
  };

  return (
    <div className="App">
      <h1>Reward Points System</h1>
      <UserDashboard userId={userId} />
      <Rewards onRedeem={handleRewardSelect} />
      {selectedRewardId && (
        <div>
          <h3>Redeem Reward</h3>
          <RedeemReward userId={userId} rewardId={selectedRewardId} />
        </div>
      )}


    </div>
  );
}

export default Reward;
