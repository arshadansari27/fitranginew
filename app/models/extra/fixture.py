import pymongo, simplejson as json

connection = pymongo.Connection(host='www.fitrangi.com', port=27017)
db = connection['adventure2']

channels = {}
for content in db['content'].find():
    title = content.get('title', None) if content.get('title', None) is not None else content.get('name', None)
    channel = content.get('channels', ['Unknown'])[0]
    facets = content.get('facets', [])
    channels.setdefault(channel, set([]))
    for f in facets:
        channels[channel].add(f)
    if channel == 'Profile':
        print title, content.get('email', None), content.get('password', None), '\n'
    else:
        print title, content.get('description'), content.get('text'), '\n'
final_channels = {}
for k, v in channels.iteritems():
    final_channels[k] = list(v)

with open('channels_data.json', 'w') as _f:
    _f.write(json.dumps(final_channels, indent=4))
