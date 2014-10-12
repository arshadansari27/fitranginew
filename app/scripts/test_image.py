import os

import pymongo

client = pymongo.MongoClient('localhost', 27017)
db = client['new_fitrangi']
"""
with open('../../fixture.log', 'r') as _file:
    data = _file.read()
    lines = data.split('BREAK\n')
    ll = [tuple(v.split('\n')) for v in lines]
    for l in ll:
        if len(l) < 3:
            print 'Breaking out', l
            break
        print l[1]
        if l[0] and len(l[0]) > 0:
            print "\tU: ", unicode(l[0]).encode('utf-8')
            try:
                assert os.path.exists(l[0])
            except AssertionError, e:
                print 'Error with', l[0]
        if l[2] and len(l[2]) > 0:
            print "\tI: ", l[2]
            try:
                assert os.path.exists(l[2])
            except AssertionError, e:
                print 'Error with', l[2]

"""
for data in db['NODE'].find():
    if data.get('images', None):
        image = data['images'][0]
    elif data.get('profile_image', None):
        image = data['profile_image']
    else:
        print data.get('title', ''), data.get('name', ''), 'doesnt have image'
        image = None
    if image:
        image = '/Users/arshad/Workspace/personal/fitrangi/app' + image
        print image, os.path.exists(image)
