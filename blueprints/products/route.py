from src.Authenticate import Users
from src.Sessions import Session
from src.Product import   Product
from flask import render_template, redirect, url_for, flash, request ,session ,jsonify
from flask import Blueprint
from uuid import uuid4
from src.Product import Product
import json
import os
from werkzeug.utils import secure_filename
from . import product , validate_product_form , allowed_file , get_products


UPLOAD_FOLDER = "static/uploads/products"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@product.route("/product/<uid>")
def edit_product(uid):
    # try:
    uid = uid.strip() 

    pro_obj = Product(uid)
    print(pro_obj.collection)
    return render_template('edit/edit_product.html',product=pro_obj)
    # except:
    #     return jsonify({
    #         "error" : "product not found"
    #     }),400

   
    
    

@product.route('/get/catogory',methods=['POST'])
def get_catogory_ui():
    if not session.get('authenticated'):
        return redirect(url_for('login'))

    if 'uid' not in request.form:
        return {'error' : 'Bad request'},409
    uid = request.form.uid('uid')
    obj_catogory = catogory(uid)
    return render_template('dialogs/catogory_list.html',session=session,details=obj_catogory)

@product.route("/del/product",methods=["POST"])
def del_product():
    product_id = request.form.get("uuid",None)

    if not product_id:
        return jsonify({
            "status" : False,
            "message" : "product not found"
        }),400
    
    try:
        instance =  Product(product_id)
        instance.collection.delete()
            
        return jsonify({
            "status" : True,
            "message" : "product successfully deleted" 
        }),200
    except:
        return jsonify({
            "status" : "error",
            "message" : "product not found"
        }),400
        
    

@product.route("/get-product", methods=["POST"])
def getProduct():
    page = int(request.form.get("page", 1))
    del_state = (request.form.get("del",False))
    print(page)
    product_list = Product.get(page,del_state)
    products = list(product_list)

    for product in products:
        product["_id"] = str(product["_id"])

    return jsonify({
        "products": products
    })

@product.route("/stock",methods=["POST"])
def setStock():
    uuid = request.form.get("uuid", "").strip()
    status = request.form.get("status","").strip()
    if not uuid and not status:
        return jsonify({
            "status" : "error",
            "errors" : "somewent is wrong"
        }),400

    try:
        pro_obj = Product(uuid)
        pro_obj.collection.status = status
    except:
        return jsonify({
            "errors" : "server side database error"
        },500)

    return jsonify({
        "status" : True,
        "message" :"successfully updated"
    })




@product.route("/set-product",methods=["POST"])
def setProduct():
    uuid = request.form.get("uuid", "").strip()
    if not uuid:
        return jsonify({
            "status" : "error",
            "errors" : "Product not found"
        })

    Product_data = Product.getDataList(uuid)
    return render_template('table/producttest.html',session=session,product=Product_data)
@product.route("/add/variant",methods=["POST"])
def add_variant():
    uuid = request.form.get("uuid", "").strip()
    variant = json.loads(request.form.get("variants", "{}"))
    
    if not uuid or not variant:
        return jsonify({
            "status" : "error",
            "errors" : "Product or Variant not found"
        }),400

    try:
        pro_obj = Product(uuid)
        variants = pro_obj.collection.variants.update(variant)
        
    
        return jsonify({
            "status" : "success",
            "message" : "Variant added successfully"
        })
    except Exception as e:
        return jsonify({
            "status" : "error",
            "errors" : str(e)
        }), 400
@product.route("/delete/variant",methods=["POST"])
def delete_variant():
    uuid = request.form.get("uuid", "").strip()
    variant_id = request.form.get("variant_id", "").strip()

    if not uuid or not variant_id:
        return jsonify({
            "status" : "error",
            "errors" : "Product or Variant not found"
        }),400

    try:
        pro_obj = Product(uuid)
        variants = pro_obj.collection.variants[variant_id].delete()
    
        return jsonify({
            "status" : "success",
            "message" : "Variant deleted successfully"
        })
    except Exception as e:
        return jsonify({
            "status" : "error",
            "errors" : str(e)
        }), 400
@product.route("/set/images", methods=["POST"])
def set_images():

    uuid = request.form.get("uuid", "").strip()

    existing_images = json.loads(
        request.form.get("existingImages", "[]")
    )

    new_images = request.files.getlist("images[]")

    if not uuid:
        return jsonify({
            "status": "error",
            "errors": "Product not found"
        }), 400

    total = len(existing_images) + len(new_images)

    if total > 5:
        return jsonify({
            "status": "error",
            "errors": "Maximum 5 images allowed"
        }), 400


    final_images = existing_images.copy()

    
    for image in new_images:

        if image.filename == "":
            continue

        if not allowed_file(image.filename):
            continue

        ext = secure_filename(image.filename).rsplit(".", 1)[1].lower()

        filename = f"{uuid4().hex}.{ext}"

        image.save(os.path.join(UPLOAD_FOLDER, filename))
        final_images.append(f"uploads/products/{filename}")
   

    try:
        pro_obj = Product(uuid)
        pro_obj.collection.images = final_images

        return jsonify({
            "status": "success",
            "message": "Images updated successfully"
        })

    except Exception:
        return jsonify({
            "status": "error",
            "errors": "Product not found"
        }), 400

 
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



@product.route("/set-badgeStock",methods=["POST"])
def set_badge():
    uuid = request.form.get("uuid", "").strip()

    badge = json.loads(request.form.get("badge", "{}"))

    if not uuid:
        return jsonify({
            "error" : "product id not found"
        }) ,400

    if not badge:
        return jsonify({
            "error" : "Badge not found"
        })
    
    try:
        pro_obj = Product(uuid)
        pro_obj.collection.stockBadge = badge
        
        return jsonify({
            "success" : "badge updated"
        })
    except:
        return jsonify({
            "error" : "product id not found"
        }) ,409

@product.route("/set-badgeDis", methods=["POST"])
def set_badge_tag():
    uuid = request.form.get("uuid", "").strip()
    badge = json.loads(request.form.get("badge", "{}"))

    if not uuid:
        return jsonify({
            "error" : "product id not found"
        }) ,400

    if not badge:
        return jsonify({
            "error" : "Badge not found"
        })
    
    try:
        pro_obj = Product(uuid)
        pro_obj.collection.disBadge = badge
        
        return jsonify({
            "success" : "badge updated"
        })
    except:
        return jsonify({
            "error" : "product id not found"
        }) ,409


@product.route("/set-Price",methods=["POST"])
def set_price():
    uuid = request.form.get("uuid", "").strip()
    price = request.form.get("value" , "").strip()

    if not uuid:
        return jsonify({
            "error" : "product id not found"
        }) ,400

    if not price:
        return jsonify({
            "error" : "Badge not found"
        })
    
    try:
        pro_obj = Product(uuid)
        pro_obj.collection.price = price
        
        return jsonify({
            "success" : "price updated"
        })
    except:
        return jsonify({
            "error" : "product id not found"
        }) ,409
    

@product.route("/set-Quantity",methods=["POST"])
def set_quantity():
    uuid = request.form.get("uuid", "").strip()
    quantity = request.form.get("value" , "").strip()

    if not uuid:
        return jsonify({
            "error" : "product id not found"
        }) ,400

    if not quantity:
        return jsonify({
            "error" : "Badge not found"
        })
    
    try:
        pro_obj = Product(uuid)
        pro_obj.collection.quantity =  quantity
        
        return jsonify({
            "success" : "price updated"
        })
    except:
        return jsonify({
            "error" : "product id not found"
        }) ,409
    

@product.route("/set-Name",methods=["POST"])
def set_name():
    uuid = request.form.get("uuid", "").strip()
    value = request.form.get("value" ,"").strip()
    if not uuid:
        return jsonify({
            "error" : "product id not found"
        }) ,400

    if not value:
        return jsonify({
            "error" : "Badge not found"
        })
    
    try:
        pro_obj = Product(uuid)
        pro_obj.collection.name = value
        
        return jsonify({
            "success" : "prodcut name updated"
        })
    except:
        return jsonify({
            "error" : "product id not found"
        }) ,409


@product.route("/set-Description",methods=["POST"])
def set_discription():
    uuid = request.form.get("uuid", "").strip()
    value = request.form.get("value" ,"").strip()
    if not uuid:
        return jsonify({
            "error" : "product id not found"
        }) ,400

    if not value:
        return jsonify({
            "error" : "Badge not found"
        })
    
    try:
        pro_obj = Product(uuid)
        pro_obj.collection.description = value
        
        return jsonify({
            "success" : "prodcut discription updated"
        })
    except:
        return jsonify({
            "error" : "product id not found"
        }) ,409

@product.route("/image/del", methods=["POST"])
def delete_image():

    uuid = request.form.get("uuid", "").strip()
    image = request.form.get("image", "").strip()
    print(uuid,image)

    if not uuid or not image:
        return {"error": "Missing data"}, 400

    try:
        product = Product(uuid)

        if image in product.collection.images:
            product.collection.images.remove(image)
        return {"success" :"image deleted"}
    except:
        return {"error" : "product id not found"}

  

 