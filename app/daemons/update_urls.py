__author__ = 'arshad'
from app.models import *


def update_keywords():
    for c in Content.objects.all():
        print 'Updating:', c.title if c.title else c.name
        u = Content.get_by_id(c.id)
        print u.slug


if __name__ == '__main__':
    update_keywords()
