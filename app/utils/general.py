__author__ = 'arshad'
import simplejson as json


def get_facets():
    with open('configs/facets.json', 'r') as _file:
        data = json.loads(_file.read())['facets']
        assert len(data) > 0
        return data

def get_roles():
    with open('configs/roles.json', 'r') as _file:
        data = json.loads(_file.read())['roles']
        assert len(data) > 0
        return data

def get_channels():
    with open('configs/channels.json', 'r') as _file:
        data = json.loads(_file.read())['channels']
        assert len(data) > 0
        return data



if __name__=='__main__':
    print get_channels()
    print '*' * 100
    print get_facets()
    print '*' * 100
    print get_roles()

