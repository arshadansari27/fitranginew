from app.models.adventure import State

__author__ = 'arshad'

from app.config import configuration
from app.models.content import Channel, Tag
from app.models.profile import Profile, ProfileType


def create_profiles_types():
    for a in ['Enthusiast', 'Gear Dealer', 'Organizer', 'Subscription Only']:
        if ProfileType.objects(name__iexact=a).first() is not None:
            continue
        ptype = ProfileType(name=a)
        ptype.save()
        print "[*] Profile Type", ptype.name


def create_admin():
    profile_type = ProfileType.objects(name__iexact='Enthusiast').first()
    roles = ['Admin', 'Basic User']
    is_business_profile = False
    size = Profile.objects(roles__in=['Admin']).count()
    if size>0:
        return
    else:
        p = Profile(name='Arshad Ansari', email='arshadansari27@gmail.com',
                    is_business_profile=is_business_profile,
                    website='', facebook='', linked_in='',
                    type=[profile_type], roles=roles, phone='')

        p.password = 'testing'
        p.save()
        print 'Profile: %s' % (p.name)

def create_channels():
    channels = configuration.get('channels')
    for channel in channels:
        if channel['parent'] is not None:
            parent = Channel.objects(name__iexact=channel['parent']).first()
        else:
            parent = None
        c = Channel.objects(name__iexact=channel['name']).first()
        if not c:
            c = Channel(name=channel['name'], parent=parent)
        else:
            c.name = channel['name']
            c.parent = parent
        c.save()
        print 'Channel: %s -> %s' % (c.name, c.parent)

def create_tags():
    tags = configuration.get('tags')
    for t in tags:
        tag = Tag.objects(name__iexact=t).first()
        if tag is None:
            tag = Tag(name=t)
        else:
            tag.name = t
        tag.save()
        print '[*] Tag:', tag.name

def create_states():
    states_conf = configuration.get('states', {})
    for c, states in states_conf.iteritems():
        for s in states:
            state = State.objects(state=s, country=c).first()
            if state is None:
                state = State(state=s, country=c)
            else:
                state.state = s
                state.country = c
            state.save()
            print '[*] State:', state.state, state.country

if __name__ == '__main__':
    create_profiles_types()
    create_admin()
    create_channels()
    create_tags()
    create_states()


