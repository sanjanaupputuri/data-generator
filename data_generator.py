import random
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any
import sqlite3
import pymongo
from dataclasses import dataclass

@dataclass
class DataConfig:
    db_type: str  # 'sql' or 'mongo'
    connection_string: str
    table_name: str
    num_records: int = 100

class AIDataGenerator:
    def __init__(self, config: DataConfig):
        self.config = config
        self.connection = None
        
    def connect(self):
        if self.config.db_type == 'sql':
            self.connection = sqlite3.connect(self.config.connection_string)
        elif self.config.db_type == 'mongo':
            client = pymongo.MongoClient(self.config.connection_string)
            self.connection = client.get_default_database()
    
    def generate_ai_data(self) -> Dict[str, Any]:
        """Generate AI-like data record"""
        models = ['GPT-4', 'Claude', 'Gemini', 'LLaMA', 'PaLM']
        tasks = ['text_generation', 'summarization', 'translation', 'qa', 'classification']
        
        return {
            'id': random.randint(1000, 9999),
            'model_name': random.choice(models),
            'task_type': random.choice(tasks),
            'input_tokens': random.randint(50, 2000),
            'output_tokens': random.randint(10, 500),
            'latency_ms': round(random.uniform(100, 3000), 2),
            'accuracy_score': round(random.uniform(0.7, 0.99), 3),
            'timestamp': datetime.now() - timedelta(days=random.randint(0, 30)),
            'user_rating': random.randint(1, 5),
            'cost_usd': round(random.uniform(0.001, 0.1), 4)
        }
    
    def save_to_sql(self, data: List[Dict]):
        cursor = self.connection.cursor()
        cursor.execute(f'''CREATE TABLE IF NOT EXISTS {self.config.table_name} 
                         (id INTEGER, model_name TEXT, task_type TEXT, 
                          input_tokens INTEGER, output_tokens INTEGER, 
                          latency_ms REAL, accuracy_score REAL, 
                          timestamp TEXT, user_rating INTEGER, cost_usd REAL)''')
        
        for record in data:
            cursor.execute(f'''INSERT INTO {self.config.table_name} VALUES 
                             (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', 
                          (record['id'], record['model_name'], record['task_type'],
                           record['input_tokens'], record['output_tokens'], 
                           record['latency_ms'], record['accuracy_score'],
                           record['timestamp'].isoformat(), record['user_rating'], 
                           record['cost_usd']))
        self.connection.commit()
    
    def save_to_mongo(self, data: List[Dict]):
        collection = self.connection[self.config.table_name]
        for record in data:
            record['timestamp'] = record['timestamp'].isoformat()
        collection.insert_many(data)
    
    def generate_and_save(self):
        self.connect()
        data = [self.generate_ai_data() for _ in range(self.config.num_records)]
        
        if self.config.db_type == 'sql':
            self.save_to_sql(data)
        elif self.config.db_type == 'mongo':
            self.save_to_mongo(data)
        
        print(f"Generated {len(data)} AI data records in {self.config.db_type}")

if __name__ == "__main__":
    # SQL example
    sql_config = DataConfig(
        db_type='sql',
        connection_string='ai_data.db',
        table_name='ai_metrics',
        num_records=50
    )
    
    generator = AIDataGenerator(sql_config)
    generator.generate_and_save()
