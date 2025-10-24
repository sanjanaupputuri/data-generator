import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete, Visibility, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dataAPI } from '../services/api';
import { Dataset } from '../types';
import DataTable from './DataTable';

const Dashboard: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const data = await dataAPI.getDatasets();
      setDatasets(data);
    } catch (error) {
      console.error('Failed to load datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this dataset?')) {
      try {
        await dataAPI.deleteDataset(id);
        setDatasets(prev => prev.filter(d => d.id !== id));
      } catch (error) {
        console.error('Failed to delete dataset:', error);
      }
    }
  };

  const handleView = async (id: string) => {
    try {
      const dataset = await dataAPI.getDataset(id);
      setSelectedDataset(dataset);
      setViewDialogOpen(true);
    } catch (error) {
      console.error('Failed to load dataset:', error);
    }
  };

  const handleDataChange = async (data: any[]) => {
    if (selectedDataset) {
      try {
        await dataAPI.updateDataset(selectedDataset.id, data);
        setSelectedDataset(prev => prev ? { ...prev, data } : null);
      } catch (error) {
        console.error('Failed to update dataset:', error);
      }
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (!selectedDataset) return;

    const data = selectedDataset.data;
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
      filename = `${selectedDataset.name}.csv`;
    } else {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      filename = `${selectedDataset.name}.json`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <Typography>Loading datasets...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Your Datasets</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/generate')}
        >
          Generate New Dataset
        </Button>
      </Box>

      {datasets.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" align="center">
              No datasets yet
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              Create your first synthetic dataset to get started
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {datasets.map((dataset) => (
            <Grid item xs={12} md={6} lg={4} key={dataset.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {dataset.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {dataset.prompt}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Created: {new Date(dataset.created_at!).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => handleView(dataset.id)}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(dataset.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{selectedDataset?.name}</DialogTitle>
        <DialogContent>
          {selectedDataset && (
            <DataTable
              data={selectedDataset.data}
              onDataChange={handleDataChange}
              onExport={handleExport}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
