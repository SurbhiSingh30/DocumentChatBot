import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

server = os.getenv("DB_SERVER")
database = os.getenv("DB_NAME")
driver = os.getenv("DB_DRIVER").replace(" ", "+")

DATABASE_URL = (
    f"mssql+pyodbc://@{server}/{database}"
    f"?driver={driver}"
    "&trusted_connection=yes"
    "&TrustServerCertificate=yes"
)

engine = create_engine(
    DATABASE_URL,
    echo=False
)