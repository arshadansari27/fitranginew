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
    if not text or len(text) is 0:
        return ''
    return _link.sub(replace, text)

def tag_remove(text):
    return TAG_RE.sub('', text)

def arrange_facets(facets):
    print "[*] Arranging facets" , facets

    names = tuple(sorted(f.name for f in facets))
    facets_to_choose = set(sorted(f.name for f in facets))
    if False and MEMOIZED_FACETS.has_key(names):
        return MEMOIZED_FACETS[names]

    facets_dict = {}
    new_dict = {}
    for f in FACETS:
        if f['name'] not in names:
            continue
        facets_dict[f['name']] = f['parent']

    print "[*] FACET_DICT: ", len(facets_dict)
    roots = set([])
    root_map = {}
    for f in facets:
        p = f.parent
        while p is not None and facets_dict.has_key(p):
            p = facets_dict[p]
        root_map[f.name] = p
        roots.add(p)
    print "[*] ROOTS: ", roots
    print "[*] ROOT MAP: ", root_map

    for k, v in facets_dict.iteritems():
        if v in roots:
            new_dict.setdefault(v, [])
            new_dict[v].append(FacetOption(k, []))

    print "[*] New DICT 1: ", new_dict

    for root in new_dict.keys():
        for first in new_dict[root]:
            for k, v in facets_dict.iteritems():
                if v == first.name and k in facets_to_choose:
                    first.facets.append(k)

    print "[*] New DICT 2: ", new_dict

    MEMOIZED_FACETS[names] = new_dict
    return new_dict

class FacetOption(object):
    def __init__(self, name, facets):
        self.name = name
        self.facets = facets

    def __repr__(self):
        return "[Facet Option] %s [%s]" % (self.name, ', '.join(self.facets))

