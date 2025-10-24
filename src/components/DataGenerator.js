import React, { useState } from 'react';
import aiService from '../utils/aiService';
import dataStorage from '../utils/dataStorage';

const DataGenerator = () => {
  const [requirements, setRequirements] = useState({
    dataType: 'startups',
    count: 50,
    fields: '',
    description: '',
    name: ''
  });
  const [generatedData, setGeneratedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dataTypes = [
    { value: 'startups', label: 'Startups/Companies' },
    { value: 'customers', label: 'Customers/Users' },
    { value: 'products', label: 'Products/Services' },
    { value: 'employees', label: 'Employees/Staff' },
    { value: 'sales', label: 'Sales/Transactions' },
    { value: 'custom', label: 'Custom Data' }
  ];

  const handleGenerate = async () => {
    if (!requirements.description.trim()) {
      setError('Please provide a description of what data you need');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await aiService.generateData(requirements);
      setGeneratedData({
        ...requirements,
        data,
        generatedAt: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedData) return;

    const dataset = dataStorage.saveDataset({
      name: requirements.name || `${requirements.dataType} Dataset`,
      description: requirements.description,
      dataType: requirements.dataType,
      data: generatedData.data
    });

    alert(`Dataset saved successfully! ID: ${dataset.id}`);
  };

  const handleExport = (format) => {
    if (!generatedData) return;

    const tempDataset = {
      id: 'temp',
      name: requirements.name || `${requirements.dataType}_data`,
      data: generatedData.data
    };

    dataStorage.exportAsJSON(tempDataset, tempDataset.name);
  };

  return (
    <div className="data-generator">
      <h2>AI Data Generator</h2>
      
      <div className="generator-form">
        <div className="form-row">
          <div className="form-group">
            <label>Data Type</label>
            <select 
              value={requirements.dataType}
              onChange={(e) => setRequirements({...requirements, dataType: e.target.value})}
            >
              {dataTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Count</label>
            <input
              type="number"
              value={requirements.count}
              onChange={(e) => setRequirements({...requirements, count: parseInt(e.target.value)})}
              min="1"
              max="1000"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Dataset Name (optional)</label>
          <input
            type="text"
            value={requirements.name}
            onChange={(e) => setRequirements({...requirements, name: e.target.value})}
            placeholder="My Dataset"
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={requirements.description}
            onChange={(e) => setRequirements({...requirements, description: e.target.value})}
            placeholder="Describe what kind of data you need. Be specific about the context, industry, or use case..."
            rows="4"
            required
          />
        </div>

        {requirements.dataType === 'custom' && (
          <div className="form-group">
            <label>Fields (comma-separated)</label>
            <input
              type="text"
              value={requirements.fields}
              onChange={(e) => setRequirements({...requirements, fields: e.target.value})}
              placeholder="name, email, age, location"
            />
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <button 
          onClick={handleGenerate}
          disabled={loading || !requirements.description.trim()}
          className="generate-btn"
        >
          {loading ? 'Generating...' : 'Generate Data'}
        </button>
      </div>

      {generatedData && (
        <div className="results-section">
          <div className="results-header">
            <h3>Generated {generatedData.data.length} Records</h3>
            <div className="action-buttons">
              <button onClick={handleSave} className="save-btn">
                Save Dataset
              </button>
              <button onClick={() => handleExport('json')} className="export-btn">
                Export JSON
              </button>
            </div>
          </div>

          <div className="data-preview">
            <h4>Preview (First 5 records)</h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {Object.keys(generatedData.data[0] || {}).map(key => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {generatedData.data.slice(0, 5).map((record, index) => (
                    <tr key={index}>
                      {Object.values(record).map((value, i) => (
                        <td key={i}>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {generatedData.data.length > 5 && (
              <p className="preview-note">
                Showing 5 of {generatedData.data.length} records. Save or export to access all data.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataGenerator;
