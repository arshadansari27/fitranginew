from app.handlers.messaging import send_single_email, send_email_from_template
from app.models.profile import Profile, ProfileType
from app.models.relationships import RelationShips
from app.models.event import Event
from app.models.trip import Trip
from app.models.activity import Activity
from app.models.adventure import Adventure
from app.models.campsite import Campsite
from app.models import Node, NodeFactory, LOCATION, BusinessException
from app.models.feedbacks import ClaimProfile, NotOkFeedBack
from app.handlers.editors import NodeEditor, response_handler
from flask import session, request
import hashlib

__author__ = 'arshad'


class ProfileEditor(NodeEditor):

    def _invoke(self):
        if self.command == 'edit-profile':
            return edit_profile(self.node, self.data)
        elif self.command == 'subscribe':
            return subscribe(self.data)
        elif self.command == 'not-ok':
            return report_not_ok(self.node, self.data['node_type'], self.data['user_id'], message=self.data.get('message', None), option=self.data.get('option', 'Other'))
        elif self.command == 'claim-profile':
            return claim_profile(self.node, self.data['node_type'], self.data['user_id'])
        elif self.command == 'cover-image-edit':
            return edit_cover_image(self.node, self.data)
        elif self.command == 'change-password':
            return change_password(self.node, self.data)
        elif self.command == 'wish-list-adventure':
            return wish_list_adventure(self.action, self.node, self.message['adventure'])
        elif self.command == 'accomplish-adventure':
            return accomplish_adventure(self.action, self.node, self.message['adventure'])
        elif self.command == 'wish-list-campsite':
            return wish_list_campsite(self.action, self.node, self.message['campsite'])
        elif self.command == 'accomplish-campsite':
            return accomplish_campsite(self.action, self.node, self.message['campsite'])
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
        elif self.command == 'interest-campsite':
            return interest_campsite(self.action, self.node, self.message['campsite'])
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
        elif self.command == 'register-business-profile':
            return register_business_profile(self.data)
        elif self.command == 'business-profile-edit':
            return update_business_profile(self.node, self.data)
        elif self.command == 'role-edit':
            return edit_role(self.action, self.node, self.message['role'])
        elif self.command == 'deactivate-profile':
            return deactivate_profile(self.action, self.node)
        elif self.command == 'book-enquiry-trip':
            return book_trip(self.node, self.message['data'])
        elif self.command == 'book-enquiry-campsite':
            return book_campsite(self.node, self.message['data'])
        elif self.command == 'reset-activity-count':
            return reset_activity_count(self.node, self.action)
        elif self.command == 'switch-profile':
            return switch_profile(self.node, self.data['profile'])
        elif self.command == 'set-background-image':
            return set_background_image(self.node, self.data['url'])
        else:
            raise Exception('Invalid command')

@response_handler('Successfully updated the background for the user', 'Failed to update the background for the user', login_required=True)
def set_background_image(node, url):
    node = Profile.objects(pk=node).first()
    node.set_background_cover(url)
    return node

@response_handler('Successfully switched the user', 'Failed to switch the user', login_required=True)
def switch_profile(node, profile):
    from flask import g
    user = g.user if hasattr(g, 'user') else None
    if not user: raise Exception('Invalid user')
    node = Profile.objects(pk=node).first()
    profile = Profile.objects(pk=profile).first()
    assert node.id == user.id
    from flask import session
    session['user'] = str(profile.id)
    return node


@response_handler('Successfully updated the counter', 'Failed to update the counter', login_required=True)
def reset_activity_count(profile, action):
    if not profile:
        from flask import g
        profile = g.user.id
    node = Profile.objects(pk=profile).first()
    if action == 'public':
        node.public_activity_count = 0
    elif action == 'private':
        node.private_activity_count = 0
    else:
        raise Exception('Invalid action')
    node.save()
    return node


@response_handler('Successfully updated the profile', 'Failed to update the profile', login_required=True)
def edit_profile(profile, data):
    node = Profile.objects(pk=profile).first()
    for k, v in data.iteritems():
        if not hasattr(node, k) or k == 'email' or k == 'location' or k.startswith('location'):
            continue
        v = v.strip()
        setattr(node, k, v)
        print 'K [%s]: V [%s]' % (k, v)

    location        = data.get('location', None)
    location_lat    = data.get('location_lat', None)
    location_long   = data.get('location_long', None)
    print 'Location [%s]: [%s, %s]' % (location, location_lat, location_long)
    if location is not None and len(location) > 0:
        node.location = location
        node.geo_location = [float(location_lat), float(location_long)]
    node.save()
    return node

@response_handler('Successfully subscribed', 'Failed to subscribe', login_required=False)
def subscribe(data):
    email = data.get('email', None)
    assert email is not None
    node = Profile.objects(email__iexact=email).first()
    if not node:
        type = ProfileType.objects(name__iexact='Subscription Only').first()
        node = Profile(email=email, type=[type])
        node.save()
    return node

@response_handler('Thank you for the help in reporting. Admin will review and mark the status as appropriate.', 'Failed to report', login_required=True)
def report_not_ok(node, node_type, user_id, message=None, option='Other'):
    assert node is not None and node_type is not None and user_id is not None
    node_class = NodeFactory.get_class_by_name(node_type)
    node = node_class.get_by_id(node)
    user = Profile.objects(pk=user_id).first()
    assert node is not None and user is not None
    feedback = NotOkFeedBack(profile=user, not_ok=node, message=message, option=option).save()
    try:
        template_path = 'notifications/flagged_content.html'
        admins = Profile.objects(roles__in=['Admin']).all()
        for a in admins:
            try:
                context = dict(user=a, model=node, flagger=user)
                subject="[Fitrangi] A user has flagged as not ok"
                to_list=[a.email]
                send_email_from_template(template_path, subject, to_list, force_send=True, **context)
            except:
                print '[ERROR] Unable to send email to admin: ', a.email
    except:
        print '[ERROR] Unable to send email to admin'
    return node

@response_handler('Info! Thank you for claiming this listing. Please click on the verification link, sent on the registered email mentioned therein. Admin will connect with you to approve it.', 'Failed to claim the listing, please try again later.', login_required=True, flash_message=True)
def claim_profile(node, node_type, user_id):
    node = Profile.objects(pk=node).first()
    user = Profile.objects(pk=user_id).first()
    print '[*]', user
    claim = ClaimProfile(profile=user, claimed=node).save()
    try:
        template_path = 'notifications/claimed_profile.html'
        admins = Profile.objects(roles__in=['Admin']).all()
        for a in admins:
            try:
                context = dict(user=a, model=node, claimant=user)
                subject="[Fitrangi] A profile was claimed by another user"
                to_list=[a.email]
                send_email_from_template(template_path, subject, to_list, force_send=True, **context)

            except:
                print '[ERROR] Unable to send email to admin: ', a.email


    except:
        print '[ERROR] Unable to send email to admin'
    try:
        if 'fitrangi.com' in request.host:
            host = 'http://www.fitrangi.com'
        else:
            host = 'http://localhost:4500'
        link = node.create_verification_link()
        context = dict(user=node, link="%s%s" % (host, link))
        send_email_from_template('notifications/email_verification.html', "[Fitrangi] Verification email", to_list=[node.email], force_send=True, **context)
    except:
        print '[ERROR] Unable to send verification email to user : ', node.email
    return node

@response_handler('Successfully updated the profile pic', 'Failed to update the profile pic', login_required=True)
def edit_cover_image(profile, data):
    node = Profile.objects(pk=profile).first()
    print '****', node, data
    return node

@response_handler('Successfully updated the password', 'Failed to update the password', login_required=True)
def change_password(profile, data):
    node = Profile.objects(pk=profile).first()
    old = hashlib.md5(data.get('old')).hexdigest()
    new = data.get('new')
    if (old != node.passwd):
        raise Exception("Invalid Password")
    node.password = new
    node.save()
    return node

@response_handler('Successfully updated wish list', 'Failed to update wish list', login_required=True)
def wish_list_adventure(action, profile, adventure):
    node = Profile.objects(pk=profile).first()
    adventure = Adventure.objects(pk=adventure).first()
    if action == 'add':
        RelationShips.wishlist(node, adventure)
    else:
        RelationShips.unwishlist(node, adventure)
    return node

@response_handler('Successfully updated adventure accomplishment', 'Failed to update adventure accomplishment', login_required=True)
def accomplish_adventure(action, profile, adventure):
    node = Profile.objects(pk=profile).first()
    adventure = Adventure.objects(pk=adventure).first()
    if action == 'add':
        RelationShips.accomplish(node, adventure)
    else:
        RelationShips.unaccomplish(node, adventure)
    return node

@response_handler('Successfully updated favorite activities', 'Failed to update favorite activities', login_required=True)
def favorite_activity(action, profile, activity):
    node = Profile.objects(pk=profile).first()
    activity = Activity.objects(pk=activity).first()
    if (action == 'add'):
        RelationShips.favorite(node, activity)
    else:
        RelationShips.un_favorite(node, activity)
    return node

@response_handler('Successfully updated subscription', 'Failed to update subscription', login_required=True)
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

@response_handler('Successfully updated bookmarks', 'Failed to update bookmarks', login_required=True)
def bookmark_article(action, profile, article):
    node = Profile.objects(pk=profile).first()
    return node

@response_handler('Successfully updated interests in event', 'Failed to update interests in events', login_required=True)
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

@response_handler('Successfully updated joining status', 'Failed to update joining status', login_required=True)
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

@response_handler('Successfully updated interests in trip', 'Failed to update interests in trip', login_required=True)
def interest_trip(action, profile, trip):
    node = Profile.objects(pk=profile).first()
    trip = Trip.objects(pk=trip).first()
    if not node or not trip:
        raise Exception('Invalid profile or event')
    if action == 'add':
        RelationShips.interested(node, trip)
    elif action == 'remove':
        RelationShips.uninterested(node, trip)
    else:
        raise Exception("Invalid action")
    return node

@response_handler('Successfully updated interests in campsite', 'Failed to update interests in campsite', login_required=True)
def interest_campsite(action, profile, campsite):
    node = Profile.objects(pk=profile).first()
    campsite = Campsite.objects(pk=campsite).first()
    if not node or not campsite:
        raise Exception('Invalid profile or event')
    if action == 'add':
        RelationShips.interested(node, campsite)
    elif action == 'remove':
        RelationShips.uninterested(node, campsite)
    else:
        raise Exception("Invalid action")
    return node

@response_handler('Successfully updated wish list', 'Failed to update wish list', login_required=True)
def wish_list_campsite(action, profile, campsite):
    node = Profile.objects(pk=profile).first()
    campsite = Campsite.objects(pk=campsite).first()
    if action == 'add':
        RelationShips.wishlist(node, campsite)
    else:
        RelationShips.unwishlist(node, campsite)
    return node

@response_handler('Successfully updated campsite accomplishment', 'Failed to update campsite accomplishment', login_required=True)
def accomplish_campsite(action, profile, campsite):
    node = Profile.objects(pk=profile).first()
    campsite = Campsite.objects(pk=campsite).first()
    if action == 'add':
        RelationShips.accomplish(node, campsite)
    else:
        RelationShips.unaccomplish(node, campsite)
    return node

@response_handler('Successfully updated joining status', 'Failed to update joining status', login_required=True)
def join_trip(action, profile, trip):
    node = Profile.objects(pk=profile).first()
    trip = Trip.objects(pk=trip).first()
    if not node or not trip:
        raise Exception('Invalid profile or event')
    if action == 'add':
        RelationShips.join(node, trip)
    elif action == 'remove':
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

@response_handler('Successfully updated preferences', 'Failed to update preferences', login_required=True)
def edit_profile_preference(profile, data):
    node = Profile.objects(pk=profile).first()
    email_enabled = data.get('email_enabled', True)
    email_frequency = data.get('email_frequency', 'daily')
    node.email_enabled = email_enabled
    node.email_frequency = email_frequency
    node.save()
    return node

@response_handler('Successfully registered', 'Failed to register', login_required=False, flash_message=True)
def register_profile(data):
    name, email, password = data['name'], data['email'], data['password']
    subscription_type = ProfileType.objects(name__icontains='subscription').first()
    if Profile.objects(email__iexact=email, type__nin=[str(subscription_type.id)]).first():
        raise Exception('Profile already exists')

    type = ProfileType.objects(name__iexact='Enthusiast').first()
    profile = Profile.objects(email__iexact=email).first()
    if not profile:
        profile = Profile.create(name=name, email=email, type=[type], roles=['Basic User'])
    else:
        profile.type = [type]
    profile.password = data['password']
    profile.save()

    if profile and profile.id:
        try:
            session['user'] = str(profile.id)
            template_path = 'notifications/successfully_registered.html'
            context = dict(user=profile)
            subject="[Fitrangi] Successfully registered"
            to_list=[profile.email]
            send_email_from_template(template_path, subject, to_list, force_send=True, **context)
        except:
            print 'Unable to send email to user ', profile.email
    return profile

@response_handler('Thank you for listing your business. Pending Admin Approval. you will be notified once it is approved by admin.', 'Failed to register', login_required=True, flash_message=True, no_flash_on_error=True)
def register_business_profile(data):
    by_user = data['logged_in_user']
    assert by_user is not None
    type, phone, alternative_phone = data['type'], data['phone'], data['alternative_phone']
    name, email, alternative_email = data['name'], data['email'], data['alternative_email']
    about, website, google_plus, linked_in, facebook, twitter = data['about'], data['website'], data['google_plus'], data['linked_in'], data['facebook'], data['twitter']
    youtube, blog, activities = data['youtube'], data['blog'], data['activities']
    address, location, lat, lng, city, region, state, country, zipcode = data['address'], data['location'], data['lat'], data['lng'], data['city'], data['region'], data['state'], data['country'], data['zipcode']

    user = Profile.objects(pk=by_user).first()
    if not user:
        raise BusinessException("Not logged in")


    email = email.strip()
    type = type.strip()
    subscription_type = ProfileType.objects(name__icontains='subscription').first()
    p = Profile.objects(email__iexact=email).first()
    if p and ((len(p.type) is 1 and p.type[0] != subscription_type) or len(p.type) > 1):
        raise BusinessException('Profile with given email already exists')

    type = ProfileType.objects(name__iexact=type).first()
    profile = Profile.objects(email__iexact=email).first()
    if lat:
        lat = lat.strip()
    if lng:
        lng = lng.strip()
    if lat and len(lat)>0 and lng and len(lng) >0:
        geo_location = [float(lat), float(lng)]
    else:
        geo_location = None
    if not profile:
        profile = Profile.create(
            name=name.strip(), email=email.strip(), address=address.strip(), type=[type], alternative_email=alternative_email.strip(), phone=phone.strip(), alternative_phone=alternative_phone.strip(),
            roles=['Basic User'], about=about.strip(), location=location.strip(), city=city.strip(), region=region.strip(), state=state.strip(), country=country.strip(),
            website=website.strip(), twitter=twitter.strip(), youtube_channel=youtube.strip(), blog_channel=blog.strip(), zipcode=zipcode.strip(), geo_location=geo_location,
            facebook=facebook.strip(), linked_in=linked_in.strip(), google_plus=google_plus.strip())
    else:
        raise BusinessException('Profile already added by someone')

    for activity in activities:
        act = Activity.objects(name__iexact=activity.strip()).first()
        if act and not act in profile.favorite_activities:
            RelationShips.favorite(profile, act)
        if activity and len(activity) > 0 and activity not in profile.interest_in_activities:
            profile.interest_in_activities.append(activity.strip())
    profile.password = 'default-password@789'
    profile.is_business_profile = True
    profile.admin_approved = False
    profile.managed_by.append(user)
    profile.save()

    if profile and profile.id:
        try:
            template_path = 'notifications/successfully_registered.html'
            send_email_from_template(template_path, "[Fitrangi] Successfully registered", to_list=[profile.email], force_send=True, user=profile)
        except:
            print '[ERROR] Unable to send email to user', profile.email
        try:
            template_path = 'notifications/created_business_profile.html'
            admins = Profile.objects(roles__in=['Admin']).all()
            for a in admins:
                try:
                    context = dict(user=a, model=profile, owner=user)
                    subject="[Fitrangi] A business profile was created"
                    to_list=[a.email]
                    send_email_from_template(template_path, subject, to_list, force_send=True, **context)
                except:
                    print '[ERROR] Unable to send email to admin', a.email
        except:
            print '[ERROR] Unable to send email to admin'

    return profile

@response_handler('Successfully updated the profile', 'Failed to update', login_required=True, no_flash_on_error=True)
def update_business_profile(node, data):
    by_user, profile_id = data['logged_in_user'], node
    assert profile_id is not None and by_user is not None
    type, phone, alternative_phone = data['type'], data['phone'], data['alternative_phone']
    name, email, alternative_email = data['name'], data['email'], data['alternative_email']
    about, website, google_plus, linked_in, facebook, twitter = data['about'], data['website'], data['google_plus'], data['linked_in'], data['facebook'], data['twitter']
    youtube, blog, activities = data['youtube'], data['blog'], data['activities']
    address, location, lat, lng, city, region, state, country, zipcode = data['address'], data['location'], data['lat'], data['lng'], data['city'], data['region'], data['state'], data['country'], data['zipcode']

    user = Profile.objects(pk=by_user).first()
    if not user:
        raise BusinessException("Not logged in")

    type = ProfileType.objects(name__iexact=type.strip()).first()
    profile = Profile.objects(email__iexact=email.strip()).first()
    if not profile:
        raise BusinessException("Profile does not exists")
    if lat:
        lat = lat.strip()
    if lng:
        lng = lng.strip()
    if lat and len(lat)>0 and lng and len(lng) >0:
        geo_location = [float(lat), float(lng)]
    else:
        geo_location = None
    profile.name=name.strip()
    profile.email=email.strip()
    profile.type=[type]
    profile.alternative_email=alternative_email.strip()
    profile.phone=phone.strip()
    profile.alternative_phone=alternative_phone.strip()
    profile.about=about.strip()
    profile.location=location.strip()
    profile.city=city.strip()
    profile.region=region.strip()
    profile.geo_location = geo_location
    profile.state=state.strip()
    profile.country=country.strip()
    profile.zipcode=zipcode.strip()
    profile.website=website.strip()
    profile.twitter=twitter.strip()
    profile.youtube_channel=youtube.strip()
    profile.blog_channel=blog.strip()
    profile.facebook=facebook.strip()
    profile.linked_in=linked_in.strip()
    profile.google_plus=google_plus.strip()
    profile.address = address.strip()

    for activity in activities:
        act = Activity.objects(name__iexact=activity.strip()).first()
        if act:
            if act in profile.favorite_activities:
                continue
            RelationShips.favorite(profile, act)
        if activity in profile.interest_in_activities:
            continue
        profile.interest_in_activities.append(activity.strip())
    profile.is_business_profile = True
    if user not in profile.managed_by:
        profile.managed_by.append(user)
    profile.save()

    return profile

@response_handler('Successfully updated business status', 'Failed to update business status', login_required=True)
def business_profile_edit(action, profile):
    node = Profile.objects(pk=profile).first()
    node.is_business_profile = True if action == 'make' else False
    node.save()
    return node

@response_handler('Successfully updated role', 'Failed to update role', login_required=True)
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

@response_handler('Successfully updated profile type', 'Failed to update profile type', login_required=True)
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

@response_handler('Successfully updated activation status', 'Failed to update activation status', login_required=True)
def deactivate_profile(action, profile):
    node = Profile.objects(pk=profile).first()
    node.deactivate = True if action == 'deactivate' else False
    node.save()
    return node

@response_handler('Successfully sent enquiry regarding trip', 'Failed to send the enquiry regarding trip', login_required=True)
def book_trip(node,  data):
    name = data['name']
    email = data['email']
    phone = data['phone']
    message = data['message']
    contact_pref = data['contact_pref']
    trip = data['trip']
    node = Profile.objects(pk=node).first()
    if not node:
        type = ProfileType.objects(name__iexact='Subscription Only').first()
        node = Profile(name=name, email=email, phone=phone, type=[type]).save()
    trip = Trip.objects(pk=trip).first()
    if not node or not trip:
        raise Exception('Invalid profile or event')

    booking = trip.add_enquiry(node, name, email, phone, message, contact_pref)
    organizer = trip.organizer
    admins = Profile.objects(roles__in=['Admin']).all()
    if organizer and organizer.id:
        try:
            template_path = 'notifications/trip_booking.html'
            context = dict(user=organizer, trip=trip, booking=booking)
            subject="[Fitrangi] Booking enquiry arrived for the trip \"%s\"" % trip.name_short
            to_list=[organizer.email]
            send_email_from_template(template_path, subject, to_list, force_send=True, **context)

        except:
            print '[ERROR] Unable to send email to organizer ', organizer.email
    if admins and len(admins) > 0:
        try:
            for a in admins:
                try:
                    template_path = 'notifications/trip_booking_admin.html'
                    context = dict(user=a, trip=trip, booking=booking)
                    subject="[Fitrangi] Booking enquiry arrived for the trip \"%s\"" % trip.name_short
                    to_list=[a.email]
                    send_email_from_template(template_path, subject, to_list, force_send=True, **context)
                except:
                    print '[ERROR] Unable to send email to admin', a.email

        except:
            print '[ERROR] Unable to send email to admin'
    return node


@response_handler('Successfully sent enquiry regarding campsite', 'Failed to send the enquiry regarding campsite', login_required=True)
def book_campsite(node,  data):
    name = data['name']
    email = data['email']
    phone = data['phone']
    message = data['message']
    contact_pref = data['contact_pref']
    campsite = data['campsite']
    node = Profile.objects(pk=node).first()
    if not node:
        type = ProfileType.objects(name__iexact='Subscription Only').first()
        node = Profile(name=name, email=email, phone=phone, type=[type]).save()
    campsite = Campsite.objects(pk=campsite).first()
    if not node or not campsite:
        raise Exception('Invalid profile or event')

    booking = campsite.add_enquiry(node, name, email, phone, message, contact_pref)
    host = campsite.host
    admins = Profile.objects(roles__in=['Admin']).all()
    if host and host.id:
        try:
            template_path = 'notifications/trip_booking.html'
            context = dict(user=host, campsite=campsite, booking=booking)
            subject="[Fitrangi] Booking enquiry arrived for the campsite \"%s\"" % campsite.name_short
            to_list=[host.email]
            send_email_from_template(template_path, subject, to_list, force_send=True, **context)

        except:
            print '[ERROR] Unable to send email to organizer ', host.email
    if admins and len(admins) > 0:
        try:
            for a in admins:
                try:
                    template_path = 'notifications/trip_booking_admin.html'
                    context = dict(user=a, campsite=campsite, booking=booking)
                    subject="[Fitrangi] Booking enquiry arrived for the trip \"%s\"" % campsite.name_short
                    to_list=[a.email]
                    send_email_from_template(template_path, subject, to_list, force_send=True, **context)
                except:
                    print '[ERROR] Unable to send email to admin', a.email

        except:
            print '[ERROR] Unable to send email to admin'
    return node

