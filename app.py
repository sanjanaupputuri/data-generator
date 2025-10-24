from flask import Flask, render_template, request, jsonify
import sqlite3
from simple_generator import SimpleAIDataGenerator

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_data():
    num_records = int(request.json.get('records', 50))
    generator = SimpleAIDataGenerator()
    generator.generate_data(num_records)
    return jsonify({'status': 'success', 'records': num_records})

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
