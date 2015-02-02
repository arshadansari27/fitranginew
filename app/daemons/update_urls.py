__author__ = 'arshad'
from app.models import *


def update_slug():
    for c in Content.objects.all():
        try:
            print type(c), ': ',c.id, c.channels[0]
        except UnicodeEncodeError, e:
            print type(c), ': ',c.id, '->', e


if __name__ == '__main__':
    update_slug()
