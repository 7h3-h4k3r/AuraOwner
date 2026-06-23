from mongogettersetter import MongoGetterSetter
from .Database import Mconn
from uuid import uuid4
from datetime import datetime
db = Mconn.get()

class productCollection(metaclass=MongoGetterSetter):
    def __init__(self,id):
        self._collection = db.product
        self._filter_query =  {"$or" :
            [   
                {"id":id} , 
                {"uid":id}
            ]
        }
        
    

class Product:
    def __init__(self,id):
        try:
            self.collection = productCollection(id)
            self.id = self.collection._id
        except:
            raise('Database Error')
    

    @staticmethod
    def put(product,username,description):
        
        uid = str(uuid4())

        insert_data = {
            'uid' : uid,
            'who_is' : username,
            'product' : product,
            'description' : description,
            'stock_in' : datetime.now(),
        }

        result = db.product.insert_one(insert_data)
        
        if not result:
            return False 

        return product(uid)

