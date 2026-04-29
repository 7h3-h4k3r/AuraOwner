import re

regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$'

def error():
    return {'error':'user credentials missing'},404

def is_valid_syntax(email):
    if re.fullmatch(regex, email):
        return True
    return False