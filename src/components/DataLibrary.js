import React, { useState, useEffect } from 'react';
import dataStorage from '../utils/dataStorage';

const DataLibrary = () => {
  const [datasets, setDatasets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadDatasets();
    loadStats();
  }, []);

  const loadDatasets = () => {
    const allDatasets = dataStorage.getAllDatasets();
    setDatasets(allDatasets);
  };

  const loadStats = () => {
    const storageStats = dataStorage.getStorageStats();
    setStats(storageStats);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = dataStorage.searchDatasets(query);
      setDatasets(results);
    } else {
      loadDatasets();
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this dataset?')) {
      dataStorage.deleteDataset(id);
      loadDatasets();
      loadStats();
      if (selectedDataset && selectedDataset.id === id) {
        setSelectedDataset(null);
      }
    }
  };

  const handleExport = (dataset, format) => {
    dataStorage.exportDataset(dataset.id, format);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="data-library">
      <div className="library-header">
        <h2>Data Library</h2>
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-number">{stats.totalDatasets || 0}</span>
            <span className="stat-label">Datasets</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.totalRecords || 0}</span>
            <span className="stat-label">Records</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{formatFileSize(stats.storageSize || 0)}</span>
            <span className="stat-label">Storage</span>
          </div>
        </div>
      </div>

      <div className="library-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="library-content">
        <div className="datasets-list">
          {datasets.length === 0 ? (
            <div className="empty-state">
              <p>No datasets found. Generate some data to get started!</p>
            </div>
          ) : (
            datasets.map(dataset => (
              <div 
                key={dataset.id} 
                className={`dataset-card ${selectedDataset?.id === dataset.id ? 'selected' : ''}`}
                onClick={() => setSelectedDataset(dataset)}
              >
                <div className="dataset-header">
                  <h3>{dataset.name}</h3>
                  <span className="dataset-type">{dataset.dataType}</span>
                </div>
                <p className="dataset-description">{dataset.description}</p>
                <div className="dataset-meta">
                  <span>{dataset.count} records</span>
                  <span>{formatDate(dataset.createdAt)}</span>
                </div>
                <div className="dataset-actions">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(dataset, 'json');
                    }}
                    className="action-btn export-btn"
                  >
                    Export JSON
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(dataset, 'csv');
                    }}
                    className="action-btn export-btn"
                  >
                    Export CSV
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(dataset.id);
                    }}
                    className="action-btn delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedDataset && (
          <div className="dataset-preview">
            <div className="preview-header">
              <h3>{selectedDataset.name}</h3>
              <button 
                onClick={() => setSelectedDataset(null)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="preview-info">
              <p><strong>Type:</strong> {selectedDataset.dataType}</p>
              <p><strong>Records:</strong> {selectedDataset.count}</p>
              <p><strong>Created:</strong> {formatDate(selectedDataset.createdAt)}</p>
              <p><strong>Fields:</strong> {selectedDataset.fields.join(', ')}</p>
              {selectedDataset.description && (
                <p><strong>Description:</strong> {selectedDataset.description}</p>
              )}
            </div>

            <div className="preview-data">
              <h4>Data Preview</h4>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      {selectedDataset.fields.map(field => (
                        <th key={field}>{field}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDataset.data.slice(0, 10).map((record, index) => (
                      <tr key={index}>
                        {selectedDataset.fields.map(field => (
                          <td key={field}>
                            {typeof record[field] === 'object' 
                              ? JSON.stringify(record[field]) 
                              : record[field]
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedDataset.count > 10 && (
                <p className="preview-note">
                  Showing 10 of {selectedDataset.count} records
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataLibrary;
