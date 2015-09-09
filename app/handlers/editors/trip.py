from app.handlers.editors import NodeEditor, response_handler
from app.handlers.extractors import NodeExtractor
from app.models import POST, CHANNEL, DISCUSSION, ARTICLE, Node, NodeFactory, ACTIVITY
from app.models.profile import ProfileType, Profile
from app.models.contest import Contest, ContestAnswer
from app.models.media import TripGalleryImage
from app.models.streams import ActivityStream
from flask import g, jsonify, render_template, flash
import os, datetime

__author__ = 'arshad'


class TripEditor(NodeEditor):

    def __init__(self, message, type):
        super(TripEditor, self).__init__(message)
        self.type = type

    def _invoke(self):
        if  self.command == 'add':
            return add(self.data)
        elif self.command == 'edit':
            return edit(self.node, self.data)
        elif self.command == 'delete':
            return delete(self.node)
        elif self.command == 'delete-gallery-media':
            return delete_media(self.node, self.data)
        else:
            raise Exception('Invalid command')

@response_handler('Successfully deleted media', 'Failed to delete media')
def delete_media(node, data):
    media = TripGalleryImage.objects(pk=data['media']).first()
    if not media:
        raise Exception('Invalid media image provided')
    media.delete()
    return media

@response_handler('Successfully deleted', 'Failed to delete', flash_message=True)
def delete(node):
    node = get_or_create_trip(node)
    node.delete()
    flash('Delete successful')
    return node


def get_or_create_trip(id=None):
    if id:
        node = NodeExtractor.factory('trip').get_single('pk:%s;' % str(id))
        if not node:
            raise Exception("Node not found!")
        node.path_cover_image = ''
        return node
    else:
        cls = NodeFactory.get_class_by_name('trip')
        node = cls()
        node.save()
        return node

@response_handler('Successfully added the trip', 'Failed to add trip', flash_message=True, no_flash_on_error=True)
def add(data):
    return _edit(data)

@response_handler('Successfully updated the trip', 'Failed to update the trip', flash_message=True, no_flash_on_error=True)
def edit(node, data):
    return _edit(data, node)

def _edit(data, node=None):
    print 'Trip Data:', data
    if not node:
        if not data.get('title'):
            raise Exception('Invalid title for the trip')
        if not data.get('organizer'):
            raise Exception('Invalid organizer for the trip')
        adding = True
    else:
        adding = False

    node = get_or_create_trip(node)
    node.name = data['title']
    node.starting_from = data['starting_from']
    node.departure_type = data['departure_type']
    other_activities = data.get('other_activities', None)

    if other_activities or len(other_activities) is 0:
        other_activities = [u.strip() for u in other_activities.split(',') if u and len(u.strip()) > 0]
    else:
        other_activities = None

    if other_activities and len(other_activities) > 0:
        node.extra_activities = other_activities



    if not node.departure_type or len(node.departure_type) is 0:
        raise Exception('Invalid departure type for the trip')
    if node.departure_type == 'Fixed':
        if data.get('from'):
            from_date_time = data['from']
            f_date, f_time = from_date_time.split(' ')
            YYYY, MM, DD = f_date.split('-')
            if len(f_time.split(':')) is 3:
                hh, mm, ss = f_time.split(':')
            else:
                hh, mm = f_time.split(':')
            ss = '0'
            YYYY, MM, DD, hh, mm, ss = [int(u) for u in [YYYY.strip(), MM.strip(), DD.strip(), hh.strip(), mm.strip(), ss.strip()]]
            node.start_date = datetime.datetime(YYYY, MM, DD, hh, mm, ss)
        if data.get('to'):
            to_date_time = data['to']
            t_date, t_time = to_date_time.split(' ')
            YYYY, MM, DD = t_date.split('-')
            if len(t_time.split(':')) is 3:
                hh, mm, ss = t_time.split(':')
            else:
                hh, mm = t_time.split(':')
            ss = '0'
            YYYY, MM, DD, hh, mm, ss = [int(u) for u in [YYYY.strip(), MM.strip(), DD.strip(), hh.strip(), mm.strip(), ss.strip()]]
            node.end_date = datetime.datetime(YYYY, MM, DD, hh, mm, ss)
    elif node.departure_type == 'On Request':
        node.expected_duration = data['request_duration']
        node.expected_conditions = data['request_conditions']
    else:
        raise Exception('Invalid departure type for the trip')

    if data.get('organizer') is None or len(data['organizer']) is 0:
        raise Exception('Invalid organizer for the trip')
    organizer = NodeExtractor.factory('profile').get_single("pk:%s" % data['organizer'])
    if not organizer:
        raise Exception('Invalid organizer for the trip')
    node.organizer = organizer
    node.optional_location_name = data['optional_location_name']
    node.inclusive_exclusive = data['inclusive_exclusive']
    node.itinerary = data['itinerary']
    node.other_details = data['other_details']
    if data.get('location_name'):
        node.location = data['location_name']
        if data.get('location_lat') and data.get('location_lng'):
            lat, lng = float(data['location_lat']), float(data['location_lng'])
            point = {"type": "Point", "coordinates": [lat, lng]}
            print 'Lat/Long', point
            node.geo_location = point  # [float(data['location_lat']), float(data['location_lng'])]
        if data.get('location_city'):
            node.city = data['location_city']
        if data.get('location_region'):
            node.region = data['location_region']
        if data.get('location_state'):
            node.state = data['location_state']
        if data.get('location_country'):
            node.country = data['location_country']
    if data.get('zipcode'):
        node.zipcode = data['zipcode']
    node.price_on_request = data['price_on_request']
    node.about = data['about']
    if data.get('price') and not node.price_on_request:
        node.price = float(data['price'])
    if data.get('activities'):
        activities = []
        for a in data['activities']:
            activity = NodeExtractor.factory(ACTIVITY).get_single('pk:%s' % a)
            activities.append(activity)
        node.activities = activities
    if data.get('cover_image') and not data['cover_image'].startswith('/media'):
        image = data['cover_image']
        if image and len(image) > 0:
            image       = image.split('/')[-1]
            path        = os.getcwd() + '/tmp/' + image
            node.cover_image.put(open(path, 'rb'))
    if data.get('media_gallery_images') and len(data['media_gallery_images']) > 0:
        images = data['media_gallery_images']
        for image in images:
            if image and len(image) > 0:
                image       = image.split('/')[-1]
                path        = os.getcwd() + '/tmp/' + image
                media = TripGalleryImage(trip=node).save()
                media.image.put(open(path, 'rb'))
                media = media.save()
                print 'Gallery image uploaded:', media.image_path


    node.published = True
    if adding:
        node.admin_published = False

    if not hasattr(node, 'admin_published') or not node.admin_published:
        profiles = [u for u in Profile.objects(roles__in=['Admin']).all()]
        from app.handlers.messaging import send_single_email, send_email_from_template
        if not profiles or len(profiles) is 0:
            print '[*] Publish Mail: Unable to send email to admin'
        for p in profiles:
            if not p or not p.email or p.email != 'fitrangi@gmail.com':
                continue
            send_email_from_template('notifications/content_posted_admin.html', "[Fitrangi] Trip awaiting approval", to_list=[p.email], force_send=True,user=p, content=node)
            print '[*] Publish Mail: Sending mail to %s' % p.name
        ActivityStream.push_trip_to_stream(node)
    return node.save()


def __edit(node, type, data):


    image = data.get('image')
    if image and len(image) > 0:
        image       = image.split('/')[-1]
        path        = os.getcwd() + '/tmp/' + image
    else:
        path        = None
    obj = get_or_create_trip(node)

    if path:
        obj.cover_image.put(open(path, 'rb'))
    if type == 'discussion':
        obj.published = True
    content = obj.save()

    return obj

