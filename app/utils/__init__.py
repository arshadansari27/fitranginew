import re

from rake import extract_keywords


TAG_RE = re.compile(r'<[^>]+>') 

def tag_remove(text):
    return TAG_RE.sub('', text)

def arrange_facets(facets):
    facets_dict = {}
    new_dict = {}
    for f in facets:
        facets_dict[f.name] = f.parent

    for k, v in facets_dict.iteritems():
        if not facets_dict.has_key(v):
            new_dict.setdefault(v, [])
            new_dict[v].append(FacetOption(k, []))

    for root in new_dict.keys():
        for first in new_dict[root]:
            for k, v in facets_dict.iteritems():
                if v == first.name:
                    first.facets.append(k)
    print "Facets View", new_dict
    return new_dict

class FacetOption(object):
    def __init__(self, name, facets):
        self.name = name
        self.facets = facets

if __name__ == '__main__':
    from app.models import Facet
    print arrange_facets(Facet.all_facets)
