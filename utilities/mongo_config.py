from pymongo import MongoClient
from decouple import config

conn_str = config('MONGO_DB_CONNECTION_STR')
client = MongoClient(conn_str, serverSelectionTimeoutMS=5000) # set a 5-second connection timeout

try:
    print("Connected to database")
except Exception:
    print("Unable to connect to the server.")


cluster = MongoClient(conn_str)
db = cluster["cv"]