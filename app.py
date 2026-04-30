from flask import Flask , render_template , send_from_directory ,session , redirect ,url_for

from blueprints.authentication import auth 
from blueprints.dialog import dialog
from blueprints.catogory import catogory 
app = Flask(__name__)
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
@app.route('/catogory')
def profit_template():
    if session.get('authenticated'):
        return render_template('catogory.html')
    return render_template('login.html')
if __name__ == '__main__':
    app.run(debug=True)