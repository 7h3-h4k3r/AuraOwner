from src.Authenticate import Users
from src.Sessions import Session
from src.AddProduct import   Product
from flask import render_template, redirect, url_for, flash, request ,session ,jsonify
from flask import Blueprint
from uuid import uuid4
from src.Product import Product
import os
from werkzeug.utils import secure_filename
from . import product , validate_product_form , allowed_file , get_products


UPLOAD_FOLDER = "static/uploads/products"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@product.route('/get/catogory',methods=['POST'])
def get_catogory_ui():
    if not session.get('authenticated'):
        return redirect(url_for('login'))

    if 'uid' not in request.form:
        return {'error' : 'Bad request'},409
    uid = request.form.uid('uid')
    obj_catogory = catogory(uid)
    return render_template('dialogs/catogory_list.html',session=session,details=obj_catogory)

@product.route("/get-product", methods=["POST"])
def getProduct():
    page = int(request.form.get("page", 1))
    limit = 10

    products = (
        db.product.find()
        .sort("_id", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )

    return render_template(
        "table/product.html",
        products=list(products)
    )



@product.route("/set-product",methods=["POST"])
def setProduct():
    uuid = request.form.get("uuid", "").strip()
    if not uuid:
        return jsonify({
            "status" : "error",
            "errors" : "Product not found"
        })

    pro_obj = Product(uuid)
    return render_template('table/product.html',session=session,product=pro_obj)

    
@product.route("/add-product", methods=["POST"])
def add_product():
    errors, data = validate_product_form(request)

    if errors:
        return jsonify({
            "status": "error",
            "errors": errors
        }), 400

    saved_images = []

    for image in data["images"]:
        if image and allowed_file(image.filename):
            original_name = secure_filename(image.filename)
            ext = original_name.rsplit(".", 1)[1].lower()

            new_filename = f"{uuid4().hex}.{ext}"
            save_path = os.path.join(UPLOAD_FOLDER, new_filename)
            image.save(save_path)

            db_path = f"uploads/products/{new_filename}"
            saved_images.append(db_path)



    product_data = {

        "name": data["name"],
        "description": data["description"],
        "price": data["price"],
        "quantity": data["quantity"],
        "variants": data["variants"],
        "images": saved_images
    }
    instance = Product.put(product_data)
    if (not instance):
        return jsonify({
            "status": "error",
            "errors": "Database Connection errors"
        }), 400
    
    
    return jsonify({
        "status": "success",
        "message": "Product saved",
        "uuid": instance.collection.uuid
    })