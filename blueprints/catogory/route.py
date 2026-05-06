from src.Authenticate import Users
from src.Sessions import Session
from src.Catogory import   Catogory
from flask import render_template, redirect, url_for, flash, request ,session ,jsonify
from flask import Blueprint
from . import catogory

@catogory.route('/get/catogory',methods=['POST'])
def get_catogory_ui():
    if not session.get('authenticated'):
        return redirect(url_for('login'))

    if 'uid' not in request.form:
        return {'error' : 'Bad request'},409
    uid = request.form.uid('uid')
    obj_catogory = catogory(uid)
    return render_template('dialogs/catogory_list.html',session=session,details=obj_catogory)

@catogory.route('/create/catogory',methods=['POST'])
def set_catogory():
    try:
        if not session.get('authenticated') or not session['username']:
            return {'error' : 'Authentication Failed'},401

        if  'catogory' not in request.form or 'description' not in request.form:
            return {'error' : 'noting in from data'},400
        catogory_name = request.form.get('catogory')
        description = request.form.get('description')
        user_name = session.get('username')
        
        catogory_obj = Catogory.put(catogory_name,user_name,description)
        
        if catogory_obj.id:
            return {'uid' : catogory_obj.collection.uid},201
    
    except Exception as e:
        return {'error' : 'somewent is wrong' + str(e)},400