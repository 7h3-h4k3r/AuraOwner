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
        product_data['status'] = "true"
        product_data['stockBadge'] = "In Stock"
        product_data['offers'] = 10
        
        result = db.product.insert_one(product_data)
        
        if not result.inserted_id:
            return False 
        
        return Product(product_uuid)


    @staticmethod
    def get(page, del_state):

        PAGE_SIZE = 10

        if del_state:
            skip = page * PAGE_SIZE - 1   # page=1 -> skip 9
            limit = 1
        else:
            skip = (page - 1) * PAGE_SIZE
            limit = PAGE_SIZE

        products = (
            db.product.find({}, {"variants": 0})
            .sort("_id", -1)
            .skip(skip)
            .limit(limit)
        )

        return products
