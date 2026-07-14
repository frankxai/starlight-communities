import sqlite3
conn = sqlite3.connect('src/crm/agents.db')
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables:", tables)

for table in tables:
    table_name = table[0]
    cursor.execute(f"PRAGMA table_info({table_name});")
    print(f"Schema for {table_name}:", cursor.fetchall())
    
conn.close()
