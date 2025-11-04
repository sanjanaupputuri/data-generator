import React from 'react';
import { useAuth } from '../context/AuthContext';
import DataGenerator from './DataGenerator';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🤖 AI Data Generator</h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <DataGenerator />
      </div>
    </div>
  );
};

export default Dashboard;
