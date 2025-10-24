import random
import sqlite3
from datetime import datetime, timedelta

class SimpleAIDataGenerator:
    def __init__(self, db_path='ai_data.db', table_name='ai_metrics'):
        self.db_path = db_path
        self.table_name = table_name
        self.used_ids = set()
        
    def generate_unique_id(self):
        while True:
            new_id = random.randint(1000, 99999)
            if new_id not in self.used_ids:
                self.used_ids.add(new_id)
                return new_id
        
    def generate_ai_record(self):
        """Generate AI-like data record"""
        models = ['GPT-4', 'Claude', 'Gemini', 'LLaMA', 'PaLM']
        tasks = ['text_generation', 'summarization', 'translation', 'qa', 'classification']
        
        return (
            self.generate_unique_id(),  # id
            random.choice(models),  # model_name
            random.choice(tasks),  # task_type
            random.randint(50, 2000),  # input_tokens
            random.randint(10, 500),  # output_tokens
            round(random.uniform(100, 3000), 2),  # latency_ms
            round(random.uniform(0.7, 0.99), 3),  # accuracy_score
            (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),  # timestamp
            random.randint(1, 5),  # user_rating
            round(random.uniform(0.001, 0.1), 4)  # cost_usd
        )
    
    def create_table(self, conn):
        cursor = conn.cursor()
        cursor.execute(f'DROP TABLE IF EXISTS {self.table_name}')
        cursor.execute(f'''CREATE TABLE {self.table_name} (
            id INTEGER PRIMARY KEY,
            model_name TEXT,
            task_type TEXT,
            input_tokens INTEGER,
            output_tokens INTEGER,
            latency_ms REAL,
            accuracy_score REAL,
            timestamp TEXT,
            user_rating INTEGER,
            cost_usd REAL
        )''')
        conn.commit()
    
    def generate_data(self, num_records=100):
        conn = sqlite3.connect(self.db_path)
        self.create_table(conn)
        
        cursor = conn.cursor()
        for _ in range(num_records):
            record = self.generate_ai_record()
            cursor.execute(f'''INSERT INTO {self.table_name} 
                             (id, model_name, task_type, input_tokens, output_tokens, 
                              latency_ms, accuracy_score, timestamp, user_rating, cost_usd) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', record)
        
        conn.commit()
        conn.close()
        print(f"Generated {num_records} AI data records in {self.db_path}")

if __name__ == "__main__":
    generator = SimpleAIDataGenerator()
    generator.generate_data(50)
