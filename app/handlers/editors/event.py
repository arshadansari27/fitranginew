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


class EventEditor(NodeEditor):

    def __init__(self, message, type):
        super(EventEditor, self).__init__(message)
        self.type = type

    def _invoke(self):
        if  self.command == 'add':
            return add(self.data)
        elif self.command == 'edit':
            return edit(self.node, self.data)
        elif self.command == 'delete':
            return delete(self.node)
        else:
            raise Exception('Invalid command')


@response_handler('Successfully deleted', 'Failed to delete', flash_message=True)
def delete(node):
    node = get_or_create_event(node)
    node.delete()
    flash('Delete successful')
    return node


def get_or_create_event(id=None):
    if id:
        node = NodeExtractor.factory('event').get_single('pk:%s;' % str(id))
        if not node:
            raise Exception("Node not found!")
        node.path_cover_image = ''
        return node
    else:
        cls = NodeFactory.get_class_by_name('event')
        node = cls()
        node.save()
        return node

@response_handler('Successfully added the event', 'Failed to add event', flash_message=True, no_flash_on_error=True)
def add(data):
    return _edit(data)

@response_handler('Successfully updated the event', 'Failed to update the event', flash_message=True, no_flash_on_error=True)
def edit(node, data):
    return _edit(data, node)

def _edit(data, node=None):
    if not node:
        if not data.get('title'):
            raise Exception('Invalid title for the event')
        if not data.get('organizer'):
            raise Exception('Invalid organizer for the event')
        adding = True
    else:
        adding = False

    node = get_or_create_event(node)
    node.name = data['title']
    scheduled_date = data['scheduled_date']
    node.external_link = data['external_link']
    node.about_organizer = data['about_organizer']
    YYYY, MM, DD = scheduled_date.split('-')
    YYYY, MM, DD, hh, mm, ss = [int(u) for u in [YYYY.strip(), MM.strip(), DD.strip(), '0', '0', '0']]
    node.scheduled_date = datetime.datetime(YYYY, MM, DD, hh, mm, ss)
    node.description = data['description']

    if data.get('organizer') is None or len(data['organizer']) is 0:
        raise Exception('Invalid organizer for the event')
    organizer = NodeExtractor.factory('profile').get_single("pk:%s" % data['organizer'])
    if not organizer:
        raise Exception('Invalid organizer for the event')
    node.organizer = organizer
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
    node.about = data['about']

    if data.get('cover_image') and not data['cover_image'].startswith('/media'):
        image = data['cover_image']
        if image and len(image) > 0:
            image       = image.split('/')[-1]
            path        = os.getcwd() + '/tmp/' + image
            node.cover_image.replace(open(path, 'rb'))

    if adding and not node.admin_published:
        profiles = [u for u in Profile.objects(roles__in=['Admin']).all()]
        from app.handlers.messaging import send_email_from_template
        if not profiles or len(profiles) is 0:
            print '[*] Publish Mail: Unable to send email to admin'
        for p in profiles:
            if not p or not p.email or p.email != 'fitrangi@gmail.com':
                continue
            send_email_from_template('notifications/content_posted_admin.html', "[Fitrangi] Event awaiting approval", to_list=[p.email], force_send=True,user=p, content=node)
            print '[*] Publish Mail: Sending mail to %s' % p.name
        ActivityStream.push_event_to_stream(node)
    return node.save()

