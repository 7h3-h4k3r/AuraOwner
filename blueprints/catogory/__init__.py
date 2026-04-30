from flask import Blueprint


catogory = Blueprint(
    'catogory',
    __name__,
    url_prefix='/api/v1/'
)

from . import route
