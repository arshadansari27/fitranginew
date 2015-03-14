__author__ = 'arshad'

from flask import g

from app.models import *
from app.handlers.views import env


class MenuView(object):
    __template__ = 'generic/main/menu.html'

    def __init__(self, menu, submenu=None, additional_styles=""):
        self.menu = menu
        self.submenu =submenu
        self.additional_styles = additional_styles

    def render(self):
        __channels  = sorted([(c.menu, c) for c in Channel.all_data if c.menu > 0])
        menus = dict((m.display, m.menu_link if m.sub_menu is None else m.sub_menu) for loc, m in __channels)
        ordered_menu = [(c[1].display, c[1].sub_menu is not None, c[1].name) for c in __channels]
        template = env.get_template(MenuView.__template__)
        return template.render(ordered_menu=ordered_menu, menus=menus, menu=self.menu, submenu=self.submenu, user=g.user, additional_styles=self.additional_styles)
