from src.Authenticate import Users
from flask import render_template, redirect, url_for, flash, request ,session
from flask import Blueprint
from pymongo.errors import PyMongoError
from . import auth

@auth.route('/login',method=['POST'])
def admin_login():
    if session.get('authenticated'):
        sess = Session(session['session_id'])
        if sess.is_valid():
            return {'message': 'Already authenticated', 'username': session['username'],'authenticated': True}, 200
        session['authenticate'] = False
        sess.collection.active = False
        return {
            'message' : 'Session Expired',
            'authenticated' : False
        },401
     else:  
        user = request.get_json()
        try:
            sessid = Users.login(user,request)
            session['authenticated'] = True
            session['session_id'] = sessid
            session['username'] = user['username']
            session['type'] = 'web'
            if 'redirect' in request.form and request.form['redirect'] == True:
                return redirect(url_for('dashboard'))
            return {'message': 'Login successful', 'username': session['username']}, 200
        except:
            return {'error': 'Invalid username or password'}, 401
    
@auth.route('/signup',method=['POST'])
def admin_signup():

    user = request.get_json()
   
    try:
        uid =  Users.signup(user)
        return {'message': 'Signup successful','uid' : uid}, 201

    except PyMongoError as e:
        return {'error': str(e)}, 409
    except Exception as e:
        return {'error': 'An unexpected error occurred: ' + str(e)}, 500

        