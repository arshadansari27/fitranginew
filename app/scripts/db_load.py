import os, base64

import simplejson as json



_file = '/Users/arshad/Dropbox/ARSHAD @ FITRANGI/Fitrangi.com DATABASE/'


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
            if key == 'default': continue
            data.setdefault(key, {})
            data[key]['category'] = d
            if not _v.endswith('html'):
                continue
            _data = open(_v, 'r') .read()
            data[key]['title'] = key
            data[key]['data'] = _data
            if os.path.exists(_v.replace('html', 'jpg')):
                data[key]['image'] = _v.replace('html', 'jpg')
            elif os.path.exists(_v.replace('html', 'jpeg')):
                data[key]['image'] = _v.replace('html', 'jpeg')
            elif os.path.exists(_v.replace('html', 'png')):
                data[key]['image'] = _v.replace('html', 'png')
            else:
                data[key]['image'] = u + '/default.jpg'
            data[key]['type'] = 'ARTICLE'
            if not os.path.exists(data[key]['image']):
                del data[key]
            print 'Article', '\t\t\t', key, os.path.exists(data[key]['image'])

    return data

def __load_adventure_trips():
    trips = _file + 'ADVENTURE TRIPS/'
    dirs = os.listdir(trips)
    data = {}
    for d in dirs:
        if d.endswith('.DS_Store'):
            continue
        u = trips + d
        if os.path.isdir(u) or not os.path.exists(u):
            print 'Not found or is directory, ', u
            continue
        key = d[:d.rfind('.')]
        if key == 'default': continue
        data.setdefault(key, {})
        data[key]['type'] = 'Adventure Trip'
        if u.endswith('html') or u.endswith('htm'):
            _data = open(u, 'r') .read()
            data[key]['title'] = key
            data[key]['data'] = _data
        elif u.endswith('jpg') or u.endswith('jpeg'):
            data[key]['image'] = u
    to_delete = []
    for k, v in data.iteritems():
        print '*****', k, v
        print '>>>>>', v['title'], len(v['data']), v['image']
        if not os.path.exists(v['image']):
            print 'Print does not exists'
            to_delete.append(key)
    for k in to_delete:
        del data[k]
    print 'Adventure Trips', '\t\t\t', key
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
            if key == 'default': continue
            data.setdefault(key, {})
            data[key]['category'] = d
            if _v.endswith('html') or _v.endswith('htm'):
                _data = open(_v, 'r') .read()
                data[key]['title'] = key
                data[key]['data'] = _data
            elif _v.endswith('jpg') or _v.endswith('jpeg'):
                data[key]['image'] = _v
            data[key]['type'] = 'ACTIVITY'
            print 'Activity', '\t\t\t', key

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
                if key == 'default': continue
                data.setdefault(key, {})
                data[key]['category'] = d
                data[key]['activity'] = v 
                _w = _v + '/' + w
                if not _w.endswith('html'):
                    continue
                _data = open(_w, 'r') .read()
                data[key]['title'] = key
                data[key]['data'] = _data
                if os.path.exists(_w.replace('html', 'jpg')):
                    data[key]['image'] = _w.replace('html', 'jpg')
                elif os.path.exists(_w.replace('html', 'jpeg')):
                    data[key]['image'] = _w.replace('html', 'jpeg')
                elif os.path.exists(_w.replace('html', 'png')):
                    data[key]['image'] = _w.replace('html', 'png')
                else:
                    data[key]['image'] = u + '/default.jpg'
                data[key]['type'] = 'DESTINATION'
                if not os.path.exists(data[key]['image']):
                    del data[key]
            print 'Destination', '\t\t\t', key
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
            if key == 'default': continue
            data.setdefault(key, {})
            data[key]['location'] = d
            data[key]['title'] = key.replace('-', ' ')
            data[key]['image'] = _v
            data[key]['type'] = 'ORGANISER'
            print 'Organiser', '\t\t\t', key
    return data


def __load_dealers():
    dealers_dir = _file + 'GEARS and EQUIPEMENT DEALERS/'
    dirs = os.listdir(dealers_dir)
    data = {}
    for d in dirs:
        u = dealers_dir + d
        if os.path.isdir(u):
            print u, 'not found'
            continue
        if not (u.endswith('jpeg') or u.endswith('jpg')  or u.endswith('png') or u.endswith('gif')):
            print 'Skipping', u
            continue
        key = d[:d.rfind('.')]
        data.setdefault(key, {})
        data[key]['title'] = key.replace('-', ' ')
        data[key]['image'] = u
        data[key]['type'] = 'DEALER'
        print 'Dealer', '\t\t\t', key
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
    data.extend([(k, v) for k, v in __load_activities().iteritems()])
    data.extend([(k, v) for k, v in __load_destinations().iteritems()])
    data.extend([(k, v) for k, v in __load_articles().iteritems()])
    data.extend([(k, v) for k, v in __load_dealers().iteritems()])
    data.extend([(k, v) for k, v in __load_organisers().iteritems()])
    data.extend([(k, v) for k, v in __load_adventure_trips().iteritems()])
    for k, v in data:
        v['image'] = base64.standard_b64encode(open(v['image'], 'r').read())
    with open('alldata.json', 'w') as _f:
        _f.write(json.dumps(data))
    return data

if __name__ == '__main__':
    load_all(False)
    print 'done'
