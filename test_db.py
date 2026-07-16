from database.connection import engine

try:
    with engine.connect() as conn:
        print("Connected to SQL Server successfully!")
except Exception as e:
    print("Connection Failed")
    print(e)