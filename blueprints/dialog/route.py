from flask import render_template, redirect, url_for, flash, request ,session ,jsonify
from flask import Blueprint
from src.Product import   Product
from pymongo.errors import PyMongoError
from .. import is_valid_syntax , error
from . import dialog , badgeList , discountBadgeList


@dialog.route('/create/catogory',methods=['GET'])
def get_catogory_ui():
    if not session.get('authenticated'):
        return redirect(url_for('login'))
    return render_template('dialogs/catogory.html',session=session)


@dialog.route('/create/product',methods=['GET'])
def get_product_ui():
    if not session.get('authenticated'):
        return redirect(url_for('login'))
    return render_template('dialogs/product.html',session=session)

@dialog.route('/get/badges-Stock',methods=["GET"])
def get_badges():
    if not session.get('authenticated'):
        return redirect(url_for('login'))
    
    return render_template('dialogs/badge.html' ,badges=badgeList)


@dialog.route('/get/badges-Dis',methods=["GET"])
def get_dis_badge():
    if not session.get('authenticated'):
        return redirect(url_for('login'))
    return render_template('dialogs/badge.html',badges=discountBadgeList)

@dialog.route('/get/images',methods=["GET"])
def get_images():
    if not session.get('authenticated'):
        return redirect(url_for('login'))
    uuid = request.args.get("uuid", "").strip()
    if not uuid:
        return {
            "error": "UUID is required"
        }, 400

    try:
        obj = Product(uuid)
        return render_template(
            "dialogs/images.html",
            e=obj.collection.images
        )
    except Exception as err:
        return {
            "error": str(err)
        }, 400
    
    

   