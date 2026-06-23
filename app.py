from flask import Flask , render_template , send_from_directory ,session , redirect ,url_for ,request , jsonify
import os
from werkzeug.utils import secure_filename
import uuid
import json
from blueprints.authentication import auth 
from blueprints.dialog import dialog
from blueprints.catogory import catogory 
app = Flask(__name__)

UPLOAD_FOLDER = "static/uploads/products"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
 
app.secret_key= 'os.getenv(\'SECRET_KEY\')'
app.register_blueprint(auth)
app.register_blueprint(dialog)
app.register_blueprint(catogory)

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


@app.route('/shirts')
def product():
    if session.get('authenticated'):
        return render_template('productlist.html')
    return render_template('login.html')



@app.route('/catogory')
def profit_template():
    if session.get('authenticated'):
        return render_template('catogory.html')
    return render_template('login.html')

@app.route("/add-product", methods=["POST","GET"])
def add_product():
    # normal form data
    name = request.form.get("name")
    description = request.form.get("description")
    price = request.form.get("price")
    quantity = request.form.get("quantity")

    # variants JSON
    variants_json = request.form.get("variants")
    variants = json.loads(variants_json) if variants_json else []

    # uploaded images
    images = request.files.getlist("images[]")

    saved_images = []

    for image in images:
        if image and allowed_file(image.filename):
            original_name = secure_filename(image.filename)
            ext = original_name.rsplit(".", 1)[1].lower()

            # new unique image name
            new_filename = f"{uuid.uuid4().hex}.{ext}"

            save_path = os.path.join(UPLOAD_FOLDER, new_filename)
            image.save(save_path)

            # path for database
            db_path = f"uploads/products/{new_filename}"
            saved_images.append(db_path)

    # example DB data
    product_data = {
        "name": name,
        "description": description,
        "price": price,
        "quantity": quantity,
        "variants": variants,
        "images": saved_images
    }

    print(product_data)

    return jsonify({
        "status": "success",
        "message": "Product saved",
        "data": product_data
    })

if __name__ == '__main__':
    app.run(debug=True)