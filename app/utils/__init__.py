import re

from rake import extract_keywords
from app.utils.general import get_facets


TAG_RE = re.compile(r'<[^>]+>')

FACETS = get_facets()
MEMOIZED_FACETS = {}

_link = re.compile(r'(?:(http://)|(www\.))(\S+\b/?)([!"#$%&\'()*+,\-./:;<=>?@[\\\]^_`{|}~]*)(\s|$)', re.I)

def convertLinks(text):
    def replace(match):
        groups = match.groups()
        protocol = groups[0] or ''  # may be None
        www_lead = groups[1] or ''  # may be None
        return '<a href="http://{1}{2}" rel="nofollow">{0}{1}{2}</a>{3}{4}'.format(
            protocol, www_lead, *groups[2:])
    return _link.sub(replace, text)

def tag_remove(text):
    return TAG_RE.sub('', text)

def arrange_facets(facets):

    names = tuple(sorted(f.name for f in facets))
    if MEMOIZED_FACETS.has_key(names):
        return MEMOIZED_FACETS[names]

    facets_dict = {}
    new_dict = {}
    for f in FACETS:
        facets_dict[f['name']] = f['parent']

    roots = set([])
    root_map = {}
    for f in facets:
        p = f.parent
        while p is not None and facets_dict.has_key(p):
            p = facets_dict[p]
            root_map[f.name] = p
        roots.add(p)

    for k, v in facets_dict.iteritems():
        if v in roots:
            new_dict.setdefault(v, [])
            new_dict[v].append(FacetOption(k, []))

    for root in new_dict.keys():
        for first in new_dict[root]:
            for k, v in facets_dict.iteritems():
                if v == first.name:
                    first.facets.append(k)

    MEMOIZED_FACETS[names] = new_dict
    return new_dict

class FacetOption(object):
    def __init__(self, name, facets):
        self.name = name
        self.facets = facets

    def __repr__(self):
        return "%s [%s]" % (self.name, ', '.join(self.facets))

if __name__ == '__main__':
    from app.models import Facet
    print arrange_facets(Facet.all_facets)
