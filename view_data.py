import sqlite3

def view_data(db_path='ai_data.db', table_name='ai_metrics', limit=10):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get total count
    cursor.execute(f'SELECT COUNT(*) FROM {table_name}')
    total = cursor.fetchone()[0]
    print(f"Total records: {total}")
    
    # Get sample data
    cursor.execute(f'SELECT * FROM {table_name} LIMIT {limit}')
    rows = cursor.fetchall()
    
    print(f"\nSample data (first {limit} records):")
    print("ID | Model | Task | Input Tokens | Output Tokens | Latency | Accuracy | Rating | Cost")
    print("-" * 90)
    
    for row in rows:
        print(f"{row[0]} | {row[1]} | {row[2]} | {row[3]} | {row[4]} | {row[5]}ms | {row[6]} | {row[8]}/5 | ${row[9]}")
    
    conn.close()

if __name__ == "__main__":
    view_data()
