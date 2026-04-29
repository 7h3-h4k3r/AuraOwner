from pymongo import MongoClient
import os

class Mconn:
    _client = None
    _db = None

    @classmethod
    def get(cls):

        if cls._db is None:
            uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
            db_name = os.getenv('MONGO_DB', 'AuraWear')
            cls._client = MongoClient(uri)
            cls._db = cls._client[db_name]
        return cls._db

    @classmethod
    def close(cls):
        """Close the underlying MongoDB client."""
        if cls._client:
            cls._client.close()
            cls._client = None
            cls._db = None