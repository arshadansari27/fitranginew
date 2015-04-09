from app import Profile, ProfileType, RelationShips, Event, Trip
from app.handlers.editors import NodeEditor, response_handler

__author__ = 'arshad'


class ProfileEditor(NodeEditor):

    def _invoke(self):
        if   self.command == 'edit':
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
            return follow_profile(self.action, self.node, self.message['other-profile'])
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
        if not hasattr(node, k):
            continue
        setattr(node, k, v)
    node.save()
    return node

@response_handler('Successfully updated the profile pic', 'Failed to update the profile pic')
def edit_cover_image(profile, data):
    node = Profile.objects(pk=profile).first()
    return node

def change_password(profile, data):
    node = Profile.objects(pk=profile).first()
    return node

def wish_list_adventure(action, profile, adventure):
    node = Profile.objects(pk=profile).first()
    return node

def accomplish_adventure(action, profile, adventure):
    node = Profile.objects(pk=profile).first()
    return node

def favorite_activity(action, profile, adventure):
    node = Profile.objects(pk=profile).first()
    return node

def follow_profile(action, profile, profile2):
    node = Profile.objects(pk=profile).first()
    return node

def bookmark_article(action, profile, article):
    node = Profile.objects(pk=profile).first()
    return node

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

def verify_profile(action, profile):
    node = Profile.objects(pk=profile).first()
    node.is_verified = True if action == 'verify' else False
    node.save()
    return node

def edit_profile_preference(profile, data):
    node = Profile.objects(pk=profile).first()
    return node

def register_profile(data):
    profile = Profile.create(data['name', data['email']])
    profile.password = data['password']
    profile.save()
    return profile

def business_profile_edit(action, profile):
    node = Profile.objects(pk=profile).first()
    node.is_business_profile = True if action == 'make' else False
    node.save()
    return node

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

def deactivate_profile(action, profile):
    node = Profile.objects(pk=profile).first()
    node.deactivate = True if action == 'deactivate' else False
    node.save()
    return node


