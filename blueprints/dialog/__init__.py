from flask import Blueprint


dialog = Blueprint(
    'dialog',
    __name__,
    url_prefix='/api/v1/dialog'
)

from . import route