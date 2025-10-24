import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
  Slider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { dataAPI } from '../services/api';
import { Dataset, GenerateDataRequest } from '../types';
import DataTable from './DataTable';

const DataGenerator: React.FC = () => {
  const [formData, setFormData] = useState<GenerateDataRequest>({
    prompt: '',
    count: 10,
    name: '',
  });
  const [generatedDataset, setGeneratedDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataset = await dataAPI.generateData(formData);
      setGeneratedDataset(dataset);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate data');
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = async (data: any[]) => {
    if (generatedDataset) {
      try {
        await dataAPI.updateDataset(generatedDataset.id, data);
        setGeneratedDataset(prev => prev ? { ...prev, data } : null);
      } catch (error) {
        console.error('Failed to update dataset:', error);
      }
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (!generatedDataset) return;

    const data = generatedDataset.data;
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'csv') {
      const headers = Object.keys(data[0] || {});
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
      ].join('\n');
      content = csvContent;
      mimeType = 'text/csv';
      filename = `${generatedDataset.name}.csv`;
    } else {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      filename = `${generatedDataset.name}.json`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Generate Synthetic Data
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Dataset Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
            helperText="Give your dataset a descriptive name"
          />

          <TextField
            fullWidth
            label="Data Description"
            multiline
            rows={4}
            value={formData.prompt}
            onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
            margin="normal"
            required
            helperText="Describe the data you want in natural language (e.g., 'customer records with name, email, age, purchase history')"
            placeholder="Example: Generate user profiles with first name, last name, email address, age, job title, and salary"
          />

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography gutterBottom>
              Number of records: {formData.count}
            </Typography>
            <Slider
              value={formData.count}
              onChange={(_, value) => setFormData(prev => ({ ...prev, count: value as number }))}
              min={1}
              max={1000}
              step={1}
              marks={[
                { value: 1, label: '1' },
                { value: 100, label: '100' },
                { value: 500, label: '500' },
                { value: 1000, label: '1000' },
              ]}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !formData.prompt.trim() || !formData.name.trim()}
            >
              {loading ? 'Generating...' : 'Generate Data'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Box>
      </Paper>

      {generatedDataset && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Generated Dataset: {generatedDataset.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {generatedDataset.data.length} records generated
          </Typography>
          
          <DataTable
            data={generatedDataset.data}
            onDataChange={handleDataChange}
            onExport={handleExport}
          />
        </Paper>
      )}
    </Box>
  );
};

export default DataGenerator;
