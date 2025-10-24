import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { Add, Delete, Download, GetApp } from '@mui/icons-material';
import { DataRecord } from '../types';

interface DataTableProps {
  data: DataRecord[];
  onDataChange: (data: DataRecord[]) => void;
  onExport: (format: 'csv' | 'json') => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onDataChange, onExport }) => {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  if (!data || data.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No data to display
      </Typography>
    );
  }

  const columns = Object.keys(data[0]);

  const handleCellClick = (rowIndex: number, columnKey: string, currentValue: any) => {
    setEditingCell({ row: rowIndex, col: columnKey });
    setEditValue(String(currentValue));
  };

  const handleCellSave = () => {
    if (editingCell) {
      const newData = [...data];
      newData[editingCell.row][editingCell.col] = editValue;
      onDataChange(newData);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellSave();
    } else if (e.key === 'Escape') {
      handleCellCancel();
    }
  };

  const addRow = () => {
    const newRow: DataRecord = { id: data.length + 1 };
    columns.forEach(col => {
      if (col !== 'id') {
        newRow[col] = '';
      }
    });
    onDataChange([...data, newRow]);
  };

  const removeRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onDataChange(newData);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={addRow}
          size="small"
        >
          Add Row
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => onExport('csv')}
          size="small"
        >
          Export CSV
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<GetApp />}
          onClick={() => onExport('json')}
          size="small"
        >
          Export JSON
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column} sx={{ fontWeight: 'bold' }}>
                  {column}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={row.id || rowIndex} hover>
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    onClick={() => handleCellClick(rowIndex, column, row[column])}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    {editingCell?.row === rowIndex && editingCell?.col === column ? (
                      <TextField
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellSave}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        size="small"
                        fullWidth
                      />
                    ) : (
                      String(row[column])
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => removeRow(rowIndex)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
        Click on any cell to edit. Press Enter to save, Escape to cancel.
      </Typography>
    </Box>
  );
};

export default DataTable;
