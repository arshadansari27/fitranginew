from app import app
from flask import render_template

class test:
    def render(self):
        return ''

@app.route('/greenfield')
def greenfield():
    return render_template('generic/test/greenfield.html', menu=test())

@app.route('/tables')
def tables():
    return render_template('generic/test/tables.html', menu=test())
@app.route('/layout')
def layout():
    return render_template('generic/test/layout.html', menu=test())
@app.route('/profile_page')
def profile_page():
    return render_template('generic/test/profile-page.html', menu=test())
@app.route('/dashboard')
def dash_board():
    return render_template('generic/test/dashboard.html', menu=test())

@app.route('/gplus')
def gplus():
    return render_template('generic/test/gplus.html', menu=test())
