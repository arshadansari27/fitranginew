__author__ = 'arshad'

from app.models import *
from flask import render_template, request, g, flash, redirect, url_for, session, send_file, jsonify
from app.handlers.views import env


class MenuView(object):
    __template__ = 'generic/main/menu.html'

    def __init__(self, menu, submenu=None):
        self.menu = menu
        self.submenu = submenu

    def render(self):
        menus = configuration['MENUS']
        template = env.get_template(MenuView.__template__)
        return template.render(ordered_menu=[('Activities', False),
                                             ('Articles', False),
                                             ('Destinations', False),
                                             ('Finder (Profiles)', False),
                                             ('Adventure Trips', False),
                                             ('Forum', False)], menus=menus, menu=self.menu, submenu=self.submenu, user=g.user)
