__author__ = 'arshad'

from app.config import get_activities
from app import cache

activity_menu_group = """
<div class="col-sm-%d">
    <ul class="multi-column-dropdown">
        <li><a href="#">%s</a></li>
        <li class="divider"></li>
        %s
    </ul>
</div>
"""
activity_menu = '<li class="%s"><a href="%s">%s</a></li>'

@cache.cached(timeout=3600 * 24)
def view_menu(inner=None):
    activities = get_activities()
    count = len(activities)
    group_items = []
    for k, v in activities.iteritems():
        items = []
        for i, j in v.iteritems():
            if inner and inner == i:
                inner_active = 'active'
            else:
                inner_active = ''
            menu_item = activity_menu % (inner_active, j, i)
            items.append(menu_item)
        items = ''.join(items)
        size = 12 / count
        group_item = activity_menu_group % (size, k, items)
        group_items.append(group_item)
    return ''.join(group_items)


