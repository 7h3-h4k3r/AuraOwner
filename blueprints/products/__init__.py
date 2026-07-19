from flask import Blueprint
import json

product = Blueprint(
    'product',
    __name__,
    url_prefix='/api/v1/'
)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def get_products(page=1, limit=10):
    product_value = db.product.find() \
        .sort("_id", -1) \
        .skip((page - 1) * limit) \
        .limit(limit)
    return list(product_value)

    
def validate_product_form(request):
    errors = {}

    name = request.form.get("name", "").strip()
    description = request.form.get("description", "").strip()
    price = request.form.get("price", "").strip()
    quantity = request.form.get("quantity", "").strip()
    variants_json = request.form.get("variants", "")
    images = request.files.getlist("images[]")

    if len(name) < 3:
        errors["name"] = "Product name must be at least 3 characters"

    if len(description) < 25:
        errors["description"] = "Description must be at least 25 characters"

    try:
        price = int(price)
        if price <= 0:
            errors["price"] = "Price must be greater than 0"
    except ValueError:
        errors["price"] = "Price must be a valid integer"

    try:
        quantity = int(quantity)
        if quantity <= 0:
            errors["quantity"] = "Quantity must be greater than 0"
    except ValueError:
        errors["quantity"] = "Quantity must be a valid integer"

    try:
        variants = json.loads(variants_json) if variants_json else []
    except json.JSONDecodeError:
        errors["variants"] = "Invalid variants JSON"
        variants = []
    for variant_id, variant in variants.items():
        color = str(variant.get("color", "")).strip()
        size = str(variant.get("size", "")).strip()
        v_price = str(variant.get("price", "")).strip()

        if len(color) < 3:
            errors[f"{variant_id}_color"] = "Variant color must be at least 3 characters"

        if len(size) < 1:
            errors[f"{variant_id}_size"] = "Variant size is required"

        try:
            v_price = int(v_price)
            if v_price <= 0:
                errors[f"{variant_id}_price"] = "Variant price must be greater than 0"
        except ValueError:
            errors[f"{variant_id}_price"] = "Variant price must be a valid integer"

    if len(images) < 5:
        errors["images"] = "At least five image this is required"
    print(images)
    if len(images) > 7:
        errors["images"] = "Maximum 7 images allowed"

    for image in images:
        if image.filename and not allowed_file(image.filename):
            errors["images"] = "Only allowed image files can be uploaded"

    return errors, {
        "name": name,
        "description": description,
        "price": price,
        "quantity": quantity,
        "variants": variants,
        "images": images
    }

from . import route
