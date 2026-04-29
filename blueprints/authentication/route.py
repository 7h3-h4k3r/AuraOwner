from src.Authenticate import Users
from src.Sessions import Session
from flask import render_template, redirect, url_for, flash, request ,session ,jsonify
from flask import Blueprint
from pymongo.errors import PyMongoError
from .. import is_valid_syntax , error
from . import auth

@auth.route('/login',methods=['POST'])
def admin_login():
    if session.get('authenticated'):
        sess = Session(session['session_id'])
        if sess.is_valid():
            return {'message': 'Already authenticated', 'username': session['username'],'authenticated': True,'redirect':'/dashboard'}, 200
        session['authenticate'] = False
        sess.collection.active = False
        return {
            'message' : 'Session Expired',
            'authenticated' : False
        },401
    else:  
        user = request.get_json()

        try:
            sessid = Users.login(user['username'],user['password'],request)
            session['authenticated'] = True
            session['session_id'] = sessid
            session['username'] = user['username']
            session['type'] = 'web'
            
            return {'message': 'Login successful', 'redirect' : '/dashboard'}, 200
        except:
            return {'error': 'Invalid username or password'}, 401
    
@auth.route('/signup',methods=['POST'])
def admin_signup():

    user = request.get_json()

    
    try:
        if not user['username'] or not user['password'] or not user['phone'] or not ['email']:
            return error()
        if not is_valid_syntax(user['email']):
            return error()
            
        uid =  Users.signup(user['username'],user['password'],user['email'],user['phone'])
        return jsonify({
            "message": "Signup successful",
            "redirect": "/login"
        }), 200

    except PyMongoError as e:
        return {'error': str(e)}, 409
    except Exception as e:
        return {'error': 'An unexpected error occurred: ' + str(e)}, 500

        