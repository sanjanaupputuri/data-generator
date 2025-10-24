const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const { getDb } = require('../database/db');
const { generateSyntheticData } = require('../services/dataGenerator');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const generateSchema = Joi.object({
  prompt: Joi.string().min(10).max(500).required(),
  count: Joi.number().integer().min(1).max(1000).default(10),
  name: Joi.string().min(1).max(100).required()
});

const updateDataSchema = Joi.object({
  data: Joi.array().items(Joi.object()).required()
});

// Generate synthetic data
router.post('/generate', authenticateToken, (req, res) => {
  try {
    const { error, value } = generateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { prompt, count, name } = value;
    const generatedData = generateSyntheticData(prompt, count);
    
    const datasetId = uuidv4();
    const db = getDb();

    db.run('INSERT INTO datasets (id, user_id, name, prompt, data) VALUES (?, ?, ?, ?, ?)',
      [datasetId, req.user.userId, name, prompt, JSON.stringify(generatedData)],
      function(err) {
        if (err) return res.status(500).json({ error: 'Failed to save dataset' });
        
        res.json({
          id: datasetId,
          name,
          prompt,
          data: generatedData,
          count: generatedData.length
        });
      });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate data' });
  }
});

// Get user datasets
router.get('/datasets', authenticateToken, (req, res) => {
  const db = getDb();
  
  db.all('SELECT id, name, prompt, created_at, updated_at FROM datasets WHERE user_id = ? ORDER BY updated_at DESC',
    [req.user.userId], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(rows);
    });
});

// Get specific dataset
router.get('/datasets/:id', authenticateToken, (req, res) => {
  const db = getDb();
  
  db.get('SELECT * FROM datasets WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.userId], (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!row) return res.status(404).json({ error: 'Dataset not found' });
      
      res.json({
        ...row,
        data: JSON.parse(row.data)
      });
    });
});

// Update dataset
router.put('/datasets/:id', authenticateToken, (req, res) => {
  try {
    const { error, value } = updateDataSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const db = getDb();
    
    db.run('UPDATE datasets SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [JSON.stringify(value.data), req.params.id, req.user.userId],
      function(err) {
        if (err) return res.status(500).json({ error: 'Failed to update dataset' });
        if (this.changes === 0) return res.status(404).json({ error: 'Dataset not found' });
        
        res.json({ message: 'Dataset updated successfully' });
      });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete dataset
router.delete('/datasets/:id', authenticateToken, (req, res) => {
  const db = getDb();
  
  db.run('DELETE FROM datasets WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.userId], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (this.changes === 0) return res.status(404).json({ error: 'Dataset not found' });
      
      res.json({ message: 'Dataset deleted successfully' });
    });
});

module.exports = router;
