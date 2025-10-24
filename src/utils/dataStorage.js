class DataStorage {
  constructor() {
    this.storageKey = 'ai_generated_datasets';
  }

  saveDataset(dataset) {
    const datasets = this.getAllDatasets();
    const newDataset = {
      id: `dataset_${Date.now()}`,
      name: dataset.name || `Dataset ${new Date().toLocaleDateString()}`,
      description: dataset.description || '',
      dataType: dataset.dataType || 'custom',
      data: dataset.data,
      createdAt: new Date().toISOString(),
      count: dataset.data.length,
      fields: this.extractFields(dataset.data)
    };

    datasets.push(newDataset);
    localStorage.setItem(this.storageKey, JSON.stringify(datasets));
    return newDataset;
  }

  getAllDatasets() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  getDataset(id) {
    const datasets = this.getAllDatasets();
    return datasets.find(dataset => dataset.id === id);
  }

  deleteDataset(id) {
    const datasets = this.getAllDatasets();
    const filtered = datasets.filter(dataset => dataset.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return filtered;
  }

  updateDataset(id, updates) {
    const datasets = this.getAllDatasets();
    const index = datasets.findIndex(dataset => dataset.id === id);
    
    if (index !== -1) {
      datasets[index] = { ...datasets[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.storageKey, JSON.stringify(datasets));
      return datasets[index];
    }
    return null;
  }

  exportDataset(id, format = 'json') {
    const dataset = this.getDataset(id);
    if (!dataset) return null;

    const filename = `${dataset.name.replace(/\s+/g, '_')}_${dataset.id}`;
    
    switch (format) {
      case 'json':
        return this.exportAsJSON(dataset, filename);
      case 'csv':
        return this.exportAsCSV(dataset, filename);
      default:
        return this.exportAsJSON(dataset, filename);
    }
  }

  exportAsJSON(dataset, filename) {
    const dataStr = JSON.stringify(dataset.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  exportAsCSV(dataset, filename) {
    if (!dataset.data.length) return;
    
    const headers = Object.keys(dataset.data[0]);
    const csvContent = [
      headers.join(','),
      ...dataset.data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  extractFields(data) {
    if (!data.length) return [];
    return Object.keys(data[0]);
  }

  searchDatasets(query) {
    const datasets = this.getAllDatasets();
    const lowerQuery = query.toLowerCase();
    
    return datasets.filter(dataset => 
      dataset.name.toLowerCase().includes(lowerQuery) ||
      dataset.description.toLowerCase().includes(lowerQuery) ||
      dataset.dataType.toLowerCase().includes(lowerQuery)
    );
  }

  getStorageStats() {
    const datasets = this.getAllDatasets();
    const totalRecords = datasets.reduce((sum, dataset) => sum + dataset.count, 0);
    
    return {
      totalDatasets: datasets.length,
      totalRecords,
      storageSize: this.getStorageSize(),
      lastCreated: datasets.length ? Math.max(...datasets.map(d => new Date(d.createdAt).getTime())) : null
    };
  }

  getStorageSize() {
    const data = localStorage.getItem(this.storageKey);
    return data ? new Blob([data]).size : 0;
  }

  clearAllData() {
    localStorage.removeItem(this.storageKey);
  }
}

export default new DataStorage();
