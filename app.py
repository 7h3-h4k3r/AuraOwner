from flask import Flask , render_template , send_from_directory ,session , redirect ,url_for ,request , jsonify
from werkzeug.utils import secure_filename
import uuid
import json
from blueprints.authentication import auth 
from blueprints.dialog import dialog
from src.Database import Mconn
from blueprints.catogory import catogory 
from blueprints.products import product
from os import getenv 
from dotenv import load_dotenv

load_dotenv()


app = Flask(__name__)

db = Mconn.get()

def get_products(page=1, limit=10):
    return db.product.find() \
        .sort("_id", -1) \
        .skip((page - 1) * limit) \
        .limit(limit)

 
app.secret_key= 'os.getenv(\'SECRET_KEY\')'
app.register_blueprint(auth)
app.register_blueprint(dialog)
app.register_blueprint(catogory)
app.register_blueprint(product)

@app.route('/dashboard')
def home():
    if session.get('authenticated'):
        return render_template('dashboard.html')
    return redirect(url_for('login')) 

@app.route('/assets/<path:filename>')
def assets(filename):
    return send_from_directory('static/assets', filename)

@app.route('/login')
def login():
    return render_template('login.html')
@app.route('/signup')
def signup():
    return render_template('signup.html')


@app.route('/products')
def product():
    if session.get('authenticated'):
        product = list(get_products())
        category = json.loads(getenv("CATEGORIES"))
        size = json.loads(getenv('SIZE'))
        return render_template('productlist.html',products=product,category=category,size=size)
    return render_template('login.html')



@app.route('/catogory')
def profit_template():
    if session.get('authenticated'):
        return render_template('catogory.html')
    return render_template('login.html')


if __name__ == '__main__':
    app.run(debug=True)