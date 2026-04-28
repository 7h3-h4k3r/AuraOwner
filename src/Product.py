from mongogettersetter import MongoGetterSetter
from Database import Mconn

db = Mconn.get()

class ProductCollection(metaclass=MongoGetterSetter):
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
            self.collection = ProductCollection(id)
            self.id = self.collection.id
        except:
            raise('Database Error')
    

    @staticmethod
    def put(product_name , username , catogory_id , product_size , quantity ,prize):
        
        uid = str(uuid4())

        insert_data = {
            'uid' : uid,
            'who_is' : username,
            'product_name' : product_name,
            'catogory_uid' : catogory_id,
            'product_size' : product_size,
            'quantity' : quantity,
            'prize' : prize,
            'stock_in' : datetime.now(),
        }

        result = db.product.insert_one(insert_data)
        
        if not result:
            return False 
        
        return Product(uid)

