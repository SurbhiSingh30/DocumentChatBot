from database.connection import engine
from database.models import Base

def created_table():
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    created_table()