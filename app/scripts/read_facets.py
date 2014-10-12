__author__ = 'arshad'

import simplejson as json


def get_facets():
    with open('configs/facets.json', 'r') as _file:
        data = json.loads(_file.read())['facets']
        assert len(data) > 0
        return data

