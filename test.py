from os import getenv 
from dotenv import load_dotenv
import json

load_dotenv()
c = getenv("CATEGORIES")
print(c)
category = json.loads(c)
s = getenv('SIZE')
size = json.loads(s)