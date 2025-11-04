from flask import Flask, render_template, request, jsonify
import sqlite3
from nvidia_generator import NVIDIADataGenerator
import os
from dotenv import load_dotenv
import json

load_dotenv()
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-structured', methods=['POST'])
def generate_structured_data():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        rows = int(data.get('rows', 10))
        columns = int(data.get('columns', 5))
        column_names = data.get('column_names', [])
        
        if not prompt:
            return jsonify({'status': 'error', 'message': 'Prompt is required'})
        
        # Enhanced prompt for structured data
        if column_names:
            column_spec = ', '.join(column_names)
            ai_prompt = f"""Generate {rows} rows of realistic data based on this description: {prompt}

Use exactly these column names: {column_spec}

Requirements:
- Return valid JSON array of objects
- Each object must have exactly {columns} fields with the specified column names
- Data should be realistic and varied
- No null values
- Ensure data types are appropriate for each field"""
        else:
            ai_prompt = f"""Generate {rows} rows of realistic data based on this description: {prompt}

Requirements:
- Return valid JSON array of objects  
- Each object must have exactly {columns} fields
- Generate appropriate column names based on the data description
- Data should be realistic and varied
- No null values
- Ensure data types are appropriate for each field"""
        
        nvidia_gen = NVIDIADataGenerator()
        result = nvidia_gen.generate_custom_data(ai_prompt, rows)
        
        return jsonify({
            'status': 'success', 
            'data': result,
            'message': f'Generated {len(result)} rows successfully'
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/generate-simple', methods=['POST'])
def generate_simple_data():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        rows = int(data.get('rows', 10))
        
        if not prompt:
            return jsonify({'status': 'error', 'message': 'Please describe what data you need'})
        
        # Enhanced prompt for better AI generation
        ai_prompt = f"""
        Generate {rows} rows of realistic data based on this request: {prompt}
        
        IMPORTANT: Return ONLY a valid JSON array. No explanations, no markdown, no extra text.
        
        Format: [
          {{"field1": "value1", "field2": "value2"}},
          {{"field1": "value3", "field2": "value4"}}
        ]
        
        Make the data:
        - Realistic and varied
        - Appropriate field names based on the description
        - Mixed data types (strings, numbers, dates, booleans)
        - No null values
        """
        
        nvidia_gen = NVIDIADataGenerator()
        result = nvidia_gen.generate_custom_data(ai_prompt, rows)
        
        return jsonify({
            'status': 'success', 
            'data': result,
            'message': f'Generated {len(result)} rows successfully'
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/generate-custom', methods=['POST'])
def generate_custom_data():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        rows = int(data.get('rows', 10))
        columns = data.get('columns', [])
        
        if not prompt or not columns:
            return jsonify({'status': 'error', 'message': 'Prompt and columns are required'})
        
        # Build detailed prompt for NVIDIA AI
        column_specs = []
        for col in columns:
            column_specs.append(f"{col['name']} ({col['type']})")
        
        ai_prompt = f"""
        {prompt}
        
        Generate exactly {rows} rows of data with these columns: {', '.join(column_specs)}
        
        Return as a JSON array where each object has these exact keys: {[col['name'] for col in columns]}
        
        Make the data realistic and varied. For different data types:
        - text: realistic names, descriptions, categories
        - number: appropriate numeric values
        - email: valid email formats
        - date: dates in YYYY-MM-DD format
        - boolean: true/false values
        - phone: phone number formats
        - address: realistic addresses
        - currency: monetary values with 2 decimals
        - percentage: values between 0-100
        - url: valid URL formats
        
        Return ONLY the JSON array, no other text.
        """
        
        nvidia_gen = NVIDIADataGenerator()
        result = nvidia_gen.generate_custom_data(ai_prompt, rows)
        
        return jsonify({
            'status': 'success', 
            'data': result,
            'message': f'Generated {len(result)} rows successfully'
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/generate', methods=['POST'])
def generate_data():
    num_records = int(request.json.get('records', 50))
    data_type = request.json.get('data_type', 'AI model performance metrics')
    
    try:
        nvidia_gen = NVIDIADataGenerator()
        ai_data = nvidia_gen.generate_synthetic_data(data_type, num_records)
        
        # Store AI-generated data in database
        conn = sqlite3.connect('ai_data.db')
        cursor = conn.cursor()
        
        for record in ai_data:
            cursor.execute('''INSERT OR REPLACE INTO ai_metrics 
                             (id, model_name, task_type, input_tokens, output_tokens, 
                              latency_ms, accuracy_score, timestamp, user_rating, cost_usd) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', 
                          (record.get('id', 0), record.get('model', 'AI-Generated'), 
                           record.get('task', 'generated'), record.get('input_tokens', 100),
                           record.get('output_tokens', 50), record.get('latency', 200.0),
                           record.get('accuracy', 0.95), record.get('timestamp', '2024-01-01'),
                           record.get('rating', 5), record.get('cost', 0.01)))
        
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success', 'records': len(ai_data), 'source': 'nvidia-ai'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/data')
def get_data():
    conn = sqlite3.connect('ai_data.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM ai_metrics ORDER BY id DESC LIMIT 100')
    rows = cursor.fetchall()
    conn.close()
    
    data = []
    for row in rows:
        data.append({
            'id': row[0], 'model': row[1], 'task': row[2],
            'input_tokens': row[3], 'output_tokens': row[4],
            'latency': row[5], 'accuracy': row[6],
            'timestamp': row[7], 'rating': row[8], 'cost': row[9]
        })
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
