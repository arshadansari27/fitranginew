__author__ = 'arshad'

import simplejson as json

with open('configs/facets.json', 'r') as _file:
    data = json.loads(_file.read())

for d in data:
    print d

