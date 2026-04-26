from pymongo import MongoClient 
from bcrypt import *
from datetime import datetime
from Database import Mconn
from pymongo.errors import PyMongoError
from uuid import uuid4

db = Mconn.get()

class Users:

    
    @staticmethod
    def login(username , password):
        try:
            result = db.users.find_one({'username':username})
            if not result['active']:
                raise Exception('user account not verifiyed')
            if checkpw(password.encode() ,result['password']):
                return True
            else:
                return False 
            
        except PyMongoError as e:
            raise ('Error ',str(e))

    
    @staticmethod
    def signup(username, password ,email, phone_no):
        hash_pass = password.encode()
        salt = gensalt()
        user_data = {
            'username' : username,
            'uid' : str(uuid4()),
            'password' : hashpw(hash_pass,salt),
            'email' : email,
            'phone' : phone_no,
            'active' : False,
            'create_at' : datetime.now(),
            'active_at' : None
        }

        try:
            db.users.insert_one(user_data)
        except PyMongoError as e:
            raise ('Error' , str(e))

    @staticmethod       
    def verify(uuid):
        try:
            result = db.users.find_one({'uid':uuid})
            if not result:
                raise Exception('user id not found')
            if result['active']:
                return True
            result = db.users.update_one(
                {'uid':uuid},
                {'$set':
                    {
                        'active':True,
                        'active_at' : datetime.now(),
                    }, 
     
                }
            )
            if result.modified_count:
                return True
            return False
        except PyMongoError as e:
            raise ('Error ' + str(e))


            
