__author__ = 'arshad'

from app.models import update_content, Node, ExternalNetwork, Charge, db, Location, base_path, save_media_to_file
from app.models.relationships import RelationShips
from app.models.profile import Profile
from app import utils
from PIL import Image
from fractions import Fraction
import datetime, random, os

class Media(db.Document):
    image = db.ImageField()
    copyright = db.StringField()
    path  = db.StringField()
    created_timestamp = db.DateTimeField(default=datetime.datetime.now)
    modified_timestamp = db.DateTimeField(default=datetime.datetime.now)

    meta = {
        'allow_inheritance': True,
        'indexes': [
            {'fields': ['-modified_timestamp', '-created_timestamp'], 'unique': False, 'sparse': False, 'types': False }
        ],
    }

    @property
    def image_path(self):
        path = str(self.path) if hasattr(self, 'path') and self.path else str(random.randint(8888, 99999))
        if path and len(path) > 0 and os.path.exists(base_path + path):
            img = path
        else:
            path = save_media_to_file(self, 'image', 'gallery-%s' % str(random.randint(8888, 99999)))
            if path:
                self.path = path
                self.save()
                img = path
            else:
                img = None
        return img #if not USE_CDN else "%s%s" % (CDN_URL, img)

    @property
    def image_path_small(self):
        path = self.path if self.path else None
        if path is None:
            return ''
        else:
            steps = path.split('/')
            full_name = steps[-1]
            ux = full_name.split('.')
            if len(ux) < 2:
                print 'Something went wrong with thumbnail image path here....'
                return ''
            name, ext = ux[0], ux[1]
            steps[-1] = name + '-thumbnail.' + ext
            small_path = '/'.join(steps)
            if not os.path.exists(small_path):
                file_path = base_path + path
                im  = Image.open(file_path)
                format = im.format
                x, y = im.size
                f = Fraction(x, y)
                num = f.numerator
                den = f.denominator
                s = 360 * num / den
                im.thumbnail((s, 360), Image.ANTIALIAS)
                p = '/tmp/' + str(random.randint(88888888, 999999999)) + '.' + format
                im.save(p, format)
                im = Image.open(p)
                x, y = im.size
                u = x / 2
                v = y / 2
                x1, x2 = u - 240, u + 240
                y1, y2 = v - 180, v + 180

                im = im.crop((x1, y1, x2, y2))
                im.save(base_path + small_path, format)
                if os.path.exists(p):
                    os.remove(p)
            img = small_path
        return img

class TripGalleryImage(Media):
    trip = db.ReferenceField('Trip')

class ProfileGalleryImage(Media):
    profile = db.ReferenceField('Profile')

class ActivityGalleryImage(Media):
    activity = db.ReferenceField('Activity')




