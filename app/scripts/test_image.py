import os, simplejson as json



data = json.loads(open('alldata.json', 'r').read())

for k, d in data:
    print d['title'], '\t\t\t\t\t\t\t\t\t', d['type'], '\t\t', len(d['image'])
