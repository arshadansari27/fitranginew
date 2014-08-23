from app.models import (Role, Profile, Channel,
        Content, Event, Product)
import simplejson as json
from BeautifulSoup import BeautifulSoup
import urllib2
import os, shutil, sys, hashlib
import StringIO, time, datetime
from app.scripts.db_load import load_all
from app.models import *
from PIL import Image as pImage
from app import settings
print 'Using setting', settings.MONGODB_HOST, settings.MONGODB_PORT

def db_fixture():
    #aliases = generate_alias_wise_data()
    Channel.load_channels()
    Role.load_roles()
    data = load_all(False)
    admin_role = Role.getByName('Admin')
    admin = Profile.objects(roles__in=[admin_role.name]).first()
    if not admin:
        admin = Profile(name="Arshad Ansari", username="arshadansari27", password='testing', is_verified=True, email='arshadansari27@gmail.com', channels=['Enthusiast'])
        admin.roles.append(admin_role.name)
        admin.save()
    print admin.name

    for d in data:
        print '*' * 100
        title = d['title']
        alias = d['type']
        print "Title and Type:", title, "->", alias
        channel = Channel.getByAlias(alias)
        if d.get('image', None):
            image_path = d['image']
            image = Image(image=open(image_path, 'rb')) 
        else:
            image = None
        _type = channel.getTypeByAlias(alias) 
        #print "Channel Associated: ", channel.name, _type
        if _type in ['Organizer', 'Enthusiast', 'Gear Dealer']:
            tags =[channel.name, _type] 
            #print tags
            if not Profile.objects(name__iexact=title).first():
                profile = Profile(name=title, username=title.lower().replace(' ', '_'), password='testing', is_verified=True, 
                    main_image=image if image else None, channels=tags)
                profile.save()
        else:
            tags = [channel.name]
            
            if d.get('category', None) is not None:
                category = d['category']
                if len(category) > 0:
                    tags.append(capitalize(category))

            if d.get('activity', None) is not None:
                activity = d['activity']
                if len(activity) > 0:
                    tags.append(capitalize(activity))
            print "****", tags
            content = Content(title=title, created_by=admin, text=d.get('data', ''), published_timestamp=datetime.datetime.now(),
                    is_published=True, channels=tags, main_image=image)
            content.save()
        
def capitalize(text):
    t = text.split(' ')
    if len(t) is 0:
        return ''
    n_t = []
    for _t in t:
        x = _t[0]
        y = _t[1:]
        z = x.upper() + y.lower()
        n_t.append(z)
    return ' '.join(n_t)



