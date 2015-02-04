from app.handlers import login_required

__author__ = 'arshad'


from flask import render_template,g

from flask.ext.classy import FlaskView, route
from app.modules.admin import admin_module


class ViewHandler(FlaskView):

    @route("/", methods=['GET', 'POST'])
    @login_required
    def index(self):
        return render_template('base_admin.html', page_title='Account Manger', user=g.user)

    @route("/profile", methods=['GET'])
    @login_required
    def profile(self):
        return render_template('base_admin.html', page_title='Account Manger', user=g.user)

    @route("/profile/edit", methods=['GET', 'POST'])
    @login_required
    def profile(self):
        return render_template('base_admin.html', page_title='Account Manger', user=g.user)

    @route("/inbox", methods=['GET', 'POST'])
    @login_required
    def inbox(self):
        return render_template('base_admin.html', page_title='Account Manger', user=g.user)

    @route("/inbox/message", methods=['GET', 'POST'])
    @login_required
    def inbox(self):
        return render_template('base_admin.html', page_title='Account Manger', user=g.user)


    @route("/settings", methods=['GET', 'POST'])
    @login_required
    def settings(self):
        return render_template('base_admin.html', page_title='Account Manger', user=g.user)


ViewHandler.register(admin_module)
