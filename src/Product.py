from mongogettersetter import MongoGetterSetter
from .Database import Mconn
from uuid import uuid4

db = Mconn.get()

class ProductCollection(metaclass=MongoGetterSetter):
    def __init__(self,id):
        self._collection = db.product
        self._filter_query =  {"$or" :
            [   
                {"id":id} , 
                {"uuid":id}
            ]
        }
        

class Product:
    def __init__(self,id):
        try:
            self.collection = ProductCollection(id)
            self.id = self.collection._id
        except Exception as e:
            raise Exception(f"Database Error: {e}")
    

    @staticmethod
    def put(product_data):
        
        product_uuid = str(uuid4())

        product_data['uuid'] = product_uuid
        product_data['status'] = True
        result = db.product.insert_one(product_data)
        
        if not result.inserted_id:
            return False 
        
        return Product(product_uuid)

