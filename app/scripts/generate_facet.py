__author__ = 'arshad'

import simplejson as json

from app.config import configuration


facets = configuration.get("FACETS")
data = []

for k, v in facets.iteritems():
    print k
    if len(v) > 0:
        for _k, _v in v:
            print '\t', _k

            if len(_v) > 0:
                for u in _v:
                    print '\t\t', u
                    data.append(dict(name=u, parent=_k))
            data.append(dict(name=_k, parent=k))

data = dict(facets=data)
with open('configs/facets.json', 'w') as _file: _file.write(json.dumps(data, indent=True))
