import React, { useState } from 'react';
import aiService from '../utils/aiService';

const DataGenerator = ({ onDataGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [requirements, setRequirements] = useState({
    dataType: 'startups',
    count: 10,
    fields: '',
    description: ''
  });

  const dataTypes = [
    { value: 'startups', label: 'Startup Companies' },
    { value: 'customers', label: 'Customer Profiles' },
    { value: 'products', label: 'Product Catalog' },
    { value: 'employees', label: 'Employee Records' },
    { value: 'sales', label: 'Sales Data' }
  ];

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const data = await aiService.generateData(requirements);
      onDataGenerated && onDataGenerated(data);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate data. Please check your NVIDIA API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="data-generator">
      <h2>🤖 AI Data Generator</h2>
      <p>Powered by NVIDIA Cloud Models</p>
      
      <div className="form-grid">
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
          <label>Records</label>
          <input
            type="number"
            min="1"
            max="100"
            value={requirements.count}
            onChange={(e) => setRequirements({...requirements, count: parseInt(e.target.value)})}
          />
        </div>

        <div className="form-group full-width">
          <label>Custom Fields</label>
          <input
            type="text"
            placeholder="name, email, phone, address"
            value={requirements.fields}
            onChange={(e) => setRequirements({...requirements, fields: e.target.value})}
          />
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            placeholder="Describe the data you need..."
            value={requirements.description}
            onChange={(e) => setRequirements({...requirements, description: e.target.value})}
            rows="2"
          />
        </div>
      </div>

      <button 
        className={`generate-btn ${isGenerating ? 'generating' : ''}`}
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating with AI...' : 'Generate Data'}
      </button>
    </div>
  );
};

export default DataGenerator;
