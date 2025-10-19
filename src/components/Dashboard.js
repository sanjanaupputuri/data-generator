import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateBatch, getOptions } from '../utils/startupGenerator';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    count: 50,
    industry: '',
    stage: '',
    location: '',
    businessModel: '',
    minEmployees: '',
    maxEmployees: '',
    minFunding: '',
    maxFunding: '',
    maxRevenue: ''
  });

  const options = getOptions();

  const handleGenerate = async () => {
    setLoading(true);
    setTimeout(() => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const newStartups = generateBatch(filters.count, cleanFilters);
      setStartups(newStartups);
      setLoading(false);
    }, 1000);
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(startups, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `startups_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Startup Data Generator</h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="generator-section">
        <h2>Customize Your Data</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Count</label>
            <input
              type="number"
              value={filters.count}
              onChange={(e) => setFilters({...filters, count: parseInt(e.target.value)})}
              min="1"
              max="1000"
            />
          </div>
          
          <div className="filter-group">
            <label>Industry</label>
            <select value={filters.industry} onChange={(e) => setFilters({...filters, industry: e.target.value})}>
              <option value="">Any</option>
              {options.industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Stage</label>
            <select value={filters.stage} onChange={(e) => setFilters({...filters, stage: e.target.value})}>
              <option value="">Any</option>
              {options.stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <select value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})}>
              <option value="">Any</option>
              {options.locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Min Employees</label>
            <input
              type="number"
              value={filters.minEmployees}
              onChange={(e) => setFilters({...filters, minEmployees: e.target.value})}
              placeholder="2"
            />
          </div>

          <div className="filter-group">
            <label>Max Employees</label>
            <input
              type="number"
              value={filters.maxEmployees}
              onChange={(e) => setFilters({...filters, maxEmployees: e.target.value})}
              placeholder="500"
            />
          </div>
        </div>

        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="generate-btn"
        >
          {loading ? 'Generating...' : 'Generate Data'}
        </button>
      </div>

      {startups.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h3>Generated {startups.length} Startups</h3>
            <button onClick={downloadJSON} className="download-btn">
              Download JSON
            </button>
          </div>
          
          <div className="startup-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Industry</th>
                  <th>Stage</th>
                  <th>Location</th>
                  <th>Employees</th>
                  <th>Funding</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {startups.slice(0, 10).map((startup) => (
                  <tr key={startup.id}>
                    <td>{startup.name}</td>
                    <td>{startup.industry}</td>
                    <td>{startup.stage}</td>
                    <td>{startup.location}</td>
                    <td>{startup.employees}</td>
                    <td>${startup.fundingRaised.toLocaleString()}</td>
                    <td>${startup.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {startups.length > 10 && (
              <p className="table-note">Showing first 10 results. Download JSON for complete data.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
