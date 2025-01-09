import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = ({ userId }) => {
  const API_URL = 'http://localhost:5000/api';

 const getUserPoints = (userId) => {
  return axios.get(`${API_URL}/users/${userId}`);
};


 const getUserTransactions = (userId) => {
  return axios.get(`${API_URL}/points/${userId}`);
};

  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch user points and transactions
    getUserPoints(userId)
      .then((response) => setPoints(response.data.total_points))
      .catch((error) => console.error('Error fetching points:', error));

    getUserTransactions(userId)
      .then((response) => setTransactions(response.data))
      .catch((error) => console.error('Error fetching transactions:', error));
  }, [userId]);

  return (
    <div>
      <h2>User Dashboard</h2>
      <p>Total Points: {points}</p>
      <h3>Transactions</h3>
      <ul>
        {transactions.map((txn) => (
          <li key={txn.id}>
            {txn.description} - {txn.points_earned} points earned / {txn.points_redeemed} points redeemed
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
