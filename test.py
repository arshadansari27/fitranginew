from app.models import *
from app.services.pageviews import *


def print_recursive(facet):
    for f in facet.first_level:
        print f.name
        for _f in facet.rest_facet_graph[f.name]:
            print '\t', _f.name

if __name__ == '__main__':
    #print MenuView('Activity', 'Other Sports').render()
    print FacetView(['Water - Wonders', 'Land Sports', 'Sky - Fly'], None).render()
