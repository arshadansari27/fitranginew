from app.handlers.editors import NodeEditor, response_handler
from app.handlers.extractors import NodeExtractor
from app.models import NodeFactory, ACTIVITY, GEAR
from app.models.profile import Profile
from app.models.media import GearGalleryImage
from app.models.streams import ActivityStream
from flask import flash
import os

__author__ = 'arshad'


class GearEditor(NodeEditor):

    def __init__(self, message, type):
        super(GearEditor, self).__init__(message)
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
    media = GearGalleryImage.objects(pk=data['media']).first()
    if not media:
        raise Exception('Invalid media image provided')
    media.delete()
    return media

@response_handler('Successfully deleted', 'Failed to delete', flash_message=True)
def delete(node):
    node = get_or_create_gear(node)
    node.delete()
    flash('Delete successful')
    return node


def get_or_create_gear(id=None):
    if id:
        node = NodeExtractor.factory('gear').get_single('pk:%s;' % str(id))
        if not node:
            raise Exception("Node not found!")
        node.path_cover_image = ''
        return node
    else:
        cls = NodeFactory.get_class_by_name('gear')
        node = cls()
        node.save()
        return node

@response_handler('Successfully added the gear', 'Failed to add gear', flash_message=True, no_flash_on_error=True)
def add(data):
    return _edit(data)

@response_handler('Successfully updated the gear', 'Failed to update the gear', flash_message=True, no_flash_on_error=True)
def edit(node, data):
    return _edit(data, node)

def _edit(data, node=None):
    if not node:
        if not data.get('title'):
            raise Exception('Invalid title for the campsite')
        if not data.get('owner'):
            raise Exception('Invalid organizer for the campsite')
        adding = True
    else:
        adding = False

    node = get_or_create_gear(node)
    node.name = data['title']
    node.category = data['category']

    if data.get('owner') is None or len(data['owner']) is 0:
        raise Exception('Invalid owner for the campsite')
    owner = NodeExtractor.factory('profile').get_single("pk:%s" % data['owner'])
    if not owner:
        raise Exception('Invalid owner for the campsite')
    node.owner = owner
    node.available_for = data['available_for']
    node.condition = data['condition']
    if data.get('location_name'):
        node.location = data['location_name']
        if data.get('location_lat') and data.get('location_lng'):
            lat, lng = float(data['location_lat']), float(data['location_lng'])
            point = {"type": "Point", "coordinates": [lat, lng]}
            node.geo_location = point  # [float(data['location_lat']), float(data['location_lng'])]
        if data.get('location_city'):
            node.city = data['location_city']
        if data.get('location_region'):
            node.region = data['location_region']
        if data.get('location_state'):
            node.state = data['location_state']
        if data.get('location_country'):
            node.country = data['location_country']
    node.description = data['description']
    node.external_link = data['external_link']
    if data.get('price'):
        node.price = float(data['price'])
    if data.get('media_gallery_images') and len(data['media_gallery_images']) > 0:
        images = data['media_gallery_images']
        for image in images:
            if image and len(image) > 0:
                image       = image.split('/')[-1]
                path        = os.getcwd() + '/tmp/' + image
                media = GearGalleryImage(gear=node).save()
                media.image.put(open(path, 'rb'))
                media = media.save()
                print 'Gallery image uploaded:', media.image_path
    node.published = True
    if adding:
        profiles = [u for u in Profile.objects(roles__in=['Admin']).all()]
        from app.handlers.messaging import send_email_from_template
        if not profiles or len(profiles) is 0:
            print '[*] Publish Mail: Unable to send email to admin'
        for p in profiles:
            if not p or not p.email or p.email != 'fitrangi@gmail.com':
                continue
            send_email_from_template('notifications/content_posted_admin.html',
                                     "[Fitrangi] Gear added ", to_list=[p.email], force_send=True,
                                     user=p, content=node)
            print '[*] Publish Mail: Sending mail to %s' % p.name
        ActivityStream.push_gear_to_stream(node)
    return node.save()
