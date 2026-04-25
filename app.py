from flask import Flask , render_template , send_from_directory

app = Flask(__name__)


@app.route('/dashboard')
def home():
    return render_template('dashboard.html')

@app.route('/assets/<path:filename>')
def assets(filename):
    return send_from_directory('static/assets', filename)
@app.route('/profit')
def profit_template():
    return render_template('profit.html')
if __name__ == '__main__':
    app.run(debug=True)