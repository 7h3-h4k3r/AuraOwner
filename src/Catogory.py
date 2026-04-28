from mongogettersetter import MongoGetterSetter
from Database import Mconn
from uuid import uuid4
from datetime import datetime
db = Mconn.get()

class catogoryCollection(metaclass=MongoGetterSetter):
    def __init__(self,id):
        self._collection = db.catogory
        self._filter_query =  {"$or" :
            [   
                {"id":id} , 
                {"uid":id}
            ]
        }
        
    

class Catogory:
    def __init__(self,id):
        try:
            self.collection = catogoryCollection(id)
            self.id = self.collection.id
        except:
            raise('Database Error')
    

    @staticmethod
    def put(catogory,username):
        
        uid = str(uuid4())

        insert_data = {
            'uid' : uid,
            'who_is' : username,
            'catogory' : catogory,
            'stock_in' : datetime.now(),
        }

        result = db.catogory.insert_one(insert_data)
        
        if not result:
            return False 
        
        return Catogory(uid)

