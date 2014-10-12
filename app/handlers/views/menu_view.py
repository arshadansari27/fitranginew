__author__ = 'arshad'

from flask import g

from app.models import *
from app.handlers.views import env


class MenuView(object):
    __template__ = 'generic/main/menu.html'

    def __init__(self, menu):
        self.menu = menu

    def render(self):
        __channels  = sorted([(c.menu, c) for c in Channel.all_data if c.menu > 0])
        menus = dict((m.display, m.menu_link) for loc, m in __channels)
        ordered_menu = [(c[1].display, False) for c in __channels]
        template = env.get_template(MenuView.__template__)
        return template.render(ordered_menu=ordered_menu, menus=menus, menu=self.menu, submenu=None, user=g.user)
