import os

import simplejson as json

from docutil import *


_file = '/Users/arshad/Dropbox/ARSHAD @ FITRANGI/Fitrangi.com DATABASE/'

def load_one(_type):
    data = None
    if _type == 'articles':
        data = __load_articles()
    elif _type == 'activities':
        data = __load_activities()
    elif _type == 'destinations':
        data = __load_destinations()
    elif _type == 'organisers':
        data = __load_organisers()
    elif _type == 'dealers':
        data = __load_dealers()
    elif _type == 'events':
        data = None
    else:
        raise Exception("Invalid data type")
    if not data or len(data) == 0:
        return []
    response = []
    for d in data.values():
        if _type not in ['dealers', 'organisers'] and (len(d.get('data', '')) is 0 or d.get('title', None) is None):
            continue
        response.append(d)
    return response

def __load_articles():
    articles_dir = _file + 'ARTICLES/'
    dirs = os.listdir(articles_dir)
    data = {}
    for d in dirs:
        if d.endswith('.DS_Store'):
            continue
        u = articles_dir + d
        if not os.path.isdir(u):
            continue
        for v in os.listdir(u):
            if v.endswith('.DS_Store'):
                continue
            _v = u + '/' + v
            key = v[:v.rfind('.')]
            data.setdefault(key, {})
            data[key]['category'] = d
            if not _v.endswith('docx'):
                continue
            title, _data = load_document(_v)
            data[key]['title'] = title
            data[key]['data'] = _data
            image = None
            if os.path.exists(_v.replace('docx', 'jpg')):
                image = _v.replace('docx', 'jpg')
                data[key]['image'] = _v.replace('docx', 'jpg')
            elif os.path.exists(_v.replace('docx', 'jpeg')):
                image = _v.replace('docx', 'jpeg')
                data[key]['image'] = _v.replace('docx', 'jpeg')
            elif os.path.exists(_v.replace('docx', 'png')):
                image = _v.replace('docx', 'png')
                data[key]['image'] = _v.replace('docx', 'png')
            else:
                data[key]['image'] = _v + '/default.jpg'
            data[key]['type'] = 'ARTICLE'

    return data

def __load_activities():
    activity_dir = _file + 'ACTIVITY/'
    dirs = os.listdir(activity_dir)
    data = {}
    for d in dirs:
        if d.endswith('.DS_Store'):
            continue
        u = activity_dir + d
        if not os.path.isdir(u):
            continue
        for v in os.listdir(u):
            if v.endswith('.DS_Store'):
                continue
            _v = u + '/' + v
            key = v[:v.rfind('.')]
            data.setdefault(key, {})
            data[key]['category'] = d
            if _v.endswith('docx') or _v.endswith('doc'):
                title, _data = load_document(_v)
                data[key]['title'] = title
                data[key]['data'] = _data
            elif _v.endswith('jpg') or _v.endswith('jpeg'):
                data[key]['image'] = _v
            data[key]['type'] = 'ACTIVITY'

    return data

def __load_destinations():
    destination_dir = _file + 'DESTINATIONS/'
    dirs = os.listdir(destination_dir)
    data = {}
    for d in dirs:
        if d.endswith('.DS_Store'):
            continue
        u = destination_dir + d
        if not os.path.isdir(u):
            continue
        for v in os.listdir(u):
            if v.endswith('.DS_Store'):
                continue
            _v = u + '/' + v
            for w in os.listdir(_v):
                if w.endswith('.DS_Store'):
                    continue
                key = w[:w.rfind('.')]
                data.setdefault(key, {})
                data[key]['category'] = d
                data[key]['activity'] = v 
                _w = _v + '/' + w
                if not _w.endswith('docx'):
                    continue
                title, _data = load_document(_w)
                data[key]['title'] = title
                data[key]['data'] = _data
                image = None
                if os.path.exists(_w.replace('docx', 'jpg')):
                    image = _w.replace('docx', 'jpg')
                    data[key]['image'] = _w.replace('docx', 'jpg')
                elif os.path.exists(_w.replace('docx', 'jpeg')):
                    image = _w.replace('docx', 'jpeg')
                    data[key]['image'] = _w.replace('docx', 'jpeg')
                elif os.path.exists(_w.replace('docx', 'png')):
                    image = _w.replace('docx', 'png')
                    data[key]['image'] = _w.replace('docx', 'png')
                else:
                    data[key]['image'] = _v + '/default.jpg'
                data[key]['type'] = 'DESTINATION'
    return data

def __load_organisers():
    organiser_dir = _file + 'ORGANISERS/'
    dirs = os.listdir(organiser_dir)
    data = {}
    for d in dirs:
        if d.endswith('.DS_Store'):
            continue
        u = organiser_dir + d
        if not os.path.isdir(u):
            continue
        for v in os.listdir(u):
            if v.endswith('.DS_Store'):
                continue
            _v = (u + '/' + v).strip()

            if _v.endswith('.xlsx'):
                print 'Skipping', _v
                continue
            key = v[:v.rfind('.')]
            data.setdefault(key, {})
            data[key]['location'] = d
            data[key]['title'] = key.replace('-', ' ')
            data[key]['image'] = _v
            data[key]['type'] = 'ORGANISER'
    return data


def __load_events():
    pass

def __load_dealers():
    dealers_dir = _file + 'GEARS & EQUIPEMENT DEALERS/'
    dirs = os.listdir(dealers_dir)
    data = {}
    for d in dirs:
        u = dealers_dir + d
        if os.path.isdir(u):
            continue
        if not (u.endswith('jpeg') or u.endswith('jpg')  or u.endswith('png') or u.endswith('gif')):
            print 'Skipping', u
            continue
        key = d[:d.rfind('.')]
        data.setdefault(key, {})
        data[key]['title'] = key.replace('-', ' ')
        data[key]['image'] = u
        data[key]['type'] = 'DEALER'
    return data
   
def load_all(local):
    _data = None
    if local:
        try:
            with open('alldata.json', 'r') as _f:
                _data = json.loads(_f.read())
        except IOError, e:
            _data = None
    if _data:
        return _data
    data = []
    get_types = ['articles', 'destinations', 'activities', 'dealers', 'organisers'] 
    #get_types = ['dealers', 'organisers'] 
    for k in get_types:
        print "Getting", k
        v = load_one(k)
        data.extend(v)
    with open('alldata.json', 'w') as _f:
        _f.write(json.dumps(data))
    return data

if __name__ == '__main__':
    print "%20s%80s%50s%50s" % ('Type', 'Title', 'Activity', 'Category')
    for d in load_all():
        print "%20s%80s%50s%50s" % (d['type'], d['title'], d['activity'] if d.get('activity', None) else 'No activity', d['category'] if d.get('category', None) else 'No category')
