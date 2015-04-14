from app.models.profile import Profile, ProfileType
from app.models.relationships import RelationShips
from app.models.event import Event
from app.models.trip import Trip
from app.models.activity import Activity
from app.models.adventure import Adventure
from app.models import Node, NodeFactory, LOCATION
from app.handlers.editors import NodeEditor, response_handler
import hashlib

__author__ = 'arshad'


class ProfileEditor(NodeEditor):

    def _invoke(self):
        if   self.command == 'edit-profile':
            return edit_profile(self.node, self.data)
        elif self.command == 'cover-image-edit':
            return edit_cover_image(self.node, self.data)
        elif self.command == 'change-password':
            return change_password(self.node, self.data)
        elif self.command == 'wish-list-adventure':
            return wish_list_adventure(self.action, self.node, self.message['adventure'])
        elif self.command == 'accomplish-adventure':
            return accomplish_adventure(self.action, self.node, self.message['adventure'])
        elif self.command == 'favorite-activity':
            return favorite_activity(self.action, self.node, self.message['activity'])
        elif self.command == 'follow-profile':
            return follow_profile(self.action, self.node, self.message['other_profile'])
        elif self.command == 'bookmark-article':
            return bookmark_article(self.action, self.node, self.message['article'])
        elif self.command == 'interest-event':
            return interest_event(self.action, self.node, self.message['event'])
        elif self.command == 'join-event':
            return join_event(self.action, self.node, self.message['event'])
        elif self.command == 'interest-trip':
            return interest_trip(self.action, self.node, self.message['trip'])
        elif self.command == 'join-trip':
            return join_trip(self.action, self.node, self.message['trip'])
        elif self.command == 'verify-profile':
            return verify_profile(self.action, self.node)
        elif self.command == 'preference-edit':
            return edit_profile_preference(self.node, self.data)
        elif self.command == 'profile-type-edit':
            return edit_type(self.action, self.node, self.message['type'])
        elif self.command == 'register-profile':
            return register_profile(self.data)
        elif self.command == 'business-profile-edit':
            return business_profile_edit(self.action, self.node)
        elif self.command == 'role-edit':
            return edit_role(self.action, self.node, self.message['role'])
        elif self.command == 'deactivate-profile':
            return deactivate_profile(self.action, self.node)
        else:
            raise Exception('Invalid command')


@response_handler('Successfully updated the profile', 'Failed to update the profile')
def edit_profile(profile, data):
    node = Profile.objects(pk=profile).first()
    for k, v in data.iteritems():
        if not hasattr(node, k) or k == 'email' or k == 'location':
            continue
        setattr(node, k, v)

    location = data.get('location', None)
    if location is not None and len(location) > 0:
        options = dict((u.full_name, str(getattr(u, 'id'))) for u in NodeFactory.get_class_by_name(LOCATION).objects.all())
        if options.has_key(location):
            node.location = NodeFactory.get_class_by_name(LOCATION).objects(pk=options.get(location)).first()
            node.location_typed = None
        else:
            node.location_typed = location
            node.location = None
    node.save()
    return node

@response_handler('Successfully updated the profile pic', 'Failed to update the profile pic')
def edit_cover_image(profile, data):
    node = Profile.objects(pk=profile).first()
    return node

@response_handler('Successfully updated the password', 'Failed to update the password')
def change_password(profile, data):
    node = Profile.objects(pk=profile).first()
    old = hashlib.md5(data.get('old')).hexdigest()
    new = data.get('new')
    if (old != node.passwd):
        raise Exception("Invalid Password")
    node.password = new
    node.save()
    return node

@response_handler('Successfully updated wish list', 'Failed to update wish list')
def wish_list_adventure(action, profile, adventure):
    node = Profile.objects(pk=profile).first()
    adventure = Adventure.objects(pk=adventure).first()
    if action == 'add':
        RelationShips.wishlist(node, adventure)
    else:
        RelationShips.unwishlist(node, adventure)
    return node

@response_handler('Successfully updated adventure accomplishment', 'Failed to update adventure accomplishment')
def accomplish_adventure(action, profile, adventure):
    node = Profile.objects(pk=profile).first()
    adventure = Adventure.objects(pk=adventure).first()
    if action == 'add':
        RelationShips.accomplish(node, adventure)
    else:
        RelationShips.unaccomplish(node, adventure)
    return node

@response_handler('Successfully updated favorite activities', 'Failed to update favorite activities')
def favorite_activity(action, profile, activity):
    node = Profile.objects(pk=profile).first()
    activity = Activity.objects(pk=activity).first()
    if (action == 'add'):
        RelationShips.favorite(node, activity)
    else:
        RelationShips.un_favorite(node, activity)
    return node

@response_handler('Successfully updated subscription', 'Failed to update subscription')
def follow_profile(action, profile, profile2):
    node = Profile.objects(pk=profile).first()
    other = Profile.objects(pk=profile2).first()
    print '[*] Follow command', node, other
    if not node or not other:
        raise Exception("Invalid id")
    if action == 'follow':
        RelationShips.follow(node, other)
    else:
        RelationShips.un_follow(node, other)
    return node

@response_handler('Successfully updated bookmarks', 'Failed to update bookmarks')
def bookmark_article(action, profile, article):
    node = Profile.objects(pk=profile).first()
    return node

@response_handler('Successfully updated interests in event', 'Failed to update interests in events')
def interest_event(action, profile, event):
    node = Profile.objects(pk=profile).first()
    event = Event.objects(pk=event).first()
    if not node or not event:
        raise Exception('Invalid profile or event')
    if action == 'interested':
        RelationShips.interested(node, event)
    elif action == 'uninterested':
        RelationShips.uninterested(node, event)
    else:
        raise Exception("Invalid action")
    return node

@response_handler('Successfully updated joining status', 'Failed to update joining status')
def join_event(action, profile, event):
    node = Profile.objects(pk=profile).first()
    event = Event.objects(pk=event).first()
    if not node or not event:
        raise Exception('Invalid profile or event')
    if action == 'join':
        RelationShips.join(node, event)
    elif action == 'unjoin':
        RelationShips.unjoin(node, event)
    else:
        raise Exception("Invalid action")
    return node

@response_handler('Successfully updated interests in trip', 'Failed to update interests in trip')
def interest_trip(action, profile, trip):
    node = Profile.objects(pk=profile).first()
    trip = Trip.objects(pk=trip).first()
    if not node or not trip:
        raise Exception('Invalid profile or event')
    if action == 'interested':
        RelationShips.interested(node, trip)
    elif action == 'uninterested':
        RelationShips.uninterested(node, trip)
    else:
        raise Exception("Invalid action")
    return node

@response_handler('Successfully updated joining status', 'Failed to update joining status')
def join_trip(action, profile, trip):
    node = Profile.objects(pk=profile).first()
    trip = Trip.objects(pk=trip).first()
    if not node or not trip:
        raise Exception('Invalid profile or event')
    if action == 'join':
        RelationShips.join(node, trip)
    elif action == 'unjoin':
        RelationShips.unjoin(node, trip)
    else:
        raise Exception("Invalid action")
    return node

@response_handler('Successfully updated verification', 'Failed to update verification')
def verify_profile(action, profile):
    node = Profile.objects(pk=profile).first()
    node.is_verified = True if action == 'verify' else False
    node.save()
    return node

@response_handler('Successfully updated preferences', 'Failed to update preferences')
def edit_profile_preference(profile, data):
    node = Profile.objects(pk=profile).first()
    email_enabled = data.get('email_enabled', True)
    email_frequency = data.get('email_frequency', 'daily')
    node.email_enabled = email_enabled
    node.email_frequency = email_frequency
    node.save()
    return node

@response_handler('Successfully registered', 'Failed to register')
def register_profile(data):
    profile = Profile.create(data['name', data['email']])
    profile.password = data['password']
    profile.save()
    return profile

@response_handler('Successfully updated business status', 'Failed to update business status')
def business_profile_edit(action, profile):
    node = Profile.objects(pk=profile).first()
    node.is_business_profile = True if action == 'make' else False
    node.save()
    return node

@response_handler('Successfully updated role', 'Failed to update role')
def edit_role(action, profile, role):
    node = Profile.objects(pk=profile).first()
    if action == 'add':
        node.roles.append(role)
    elif action == 'remove':
        node.roles.remove(role)
    else:
        raise Exception("Invalid action")
    node.save()
    return node

@response_handler('Successfully updated profile type', 'Failed to update profile type')
def edit_type(action, profile, type):
    node = Profile.objects(pk=profile).first()
    type = ProfileType.objects(name__iexact=type).first()
    if action == 'add':
        node.type.append(type)
    elif action == 'remove':
        node.type.remove(type)
    else:
        raise Exception("Invalid action")
    node.save()
    return node

@response_handler('Successfully updated activation status', 'Failed to update activation status')
def deactivate_profile(action, profile):
    node = Profile.objects(pk=profile).first()
    node.deactivate = True if action == 'deactivate' else False
    node.save()
    return node


