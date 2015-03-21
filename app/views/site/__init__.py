from app import app
from flask import render_template
from app.views.site.menus import view_menu


@app.route("/")
def home():
    return render_template("/site/features/home.html")

@app.route("/explore")
def explore():
    return render_template("/site/features/explore.html")

@app.route("/community")
def community():
    return render_template("/site/features/community.html")

@app.route("/journal")
def journal():
    return render_template("/site/features/journal.html")
