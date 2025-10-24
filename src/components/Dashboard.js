import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DataGenerator from './DataGenerator';
import DataLibrary from './DataLibrary';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>AI Data Generator</h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          Generate Data
        </button>
        <button 
          className={`nav-btn ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          Data Library
        </button>
      </nav>

      <div className="dashboard-content">
        {activeTab === 'generator' && <DataGenerator />}
        {activeTab === 'library' && <DataLibrary />}
      </div>
    </div>
  );
};

export default Dashboard;
