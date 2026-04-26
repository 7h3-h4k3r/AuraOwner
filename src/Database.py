from pymongo import MongoClient



class Mconn:

    db = None 

    @staticmethod
    def get():
        try:
            if not Mconn.db:
                client = MongoClient('mongodb://localhost:27017/')
                Mconn.db = client['AuraWear']
            else:
                return Mconn.db
            return Mconn.db
        except Exception as e:
            raise('DataBase Connection Error')
    

# test = Mconn.get().users.insert_one({'test': 'test'})