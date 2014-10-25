from app.models import *
from app import settings
print 'Using setting', settings.MONGODB_HOST, settings.MONGODB_PORT, settings.MONGODB_DB
import os, simplejson as json, base64
import tempfile

def db_fixture():
    #aliases = generate_alias_wise_data()
    Configuration.load_from_configuration()
    data = json.loads(open('app/scripts/alldata.json', 'r').read())
    admin = Profile.objects(roles__in=['Admin']).first()
    if not admin:
        admin = Profile(name="Arshad Ansari", username="arshadansari27", password='testing', is_verified=True, email='arshadansari27@gmail.com', channels=['Profile'], facets=['Profile', 'Enthusiast'])
        admin.roles.append('Admin')
        admin.save()
    print admin.name

    for x, d in data:
        print '*' * 100
        print x
        if x.strip() == 'default':
            continue
        title = d['title']

        if Content.objects(title=title).first() is not None:
            continue
        alias = d['type']
        print "Title and Type:", title, "->", alias
        channel = Channel.getByAlias(alias)
        image = None
        if d.get('image', None):
            file_like = base64.standard_b64decode(d['image'])
            if not file_like:
                continue
            print len(file_like)
            bytes_image = bytearray(file_like)
            with tempfile.TemporaryFile() as f:
                f.write(bytes_image)
                f.flush()
                f.seek(0)
                image = Image(image=f)
        _type = channel.getTypeByAlias(alias)
        print "Channel Associated: ", channel.name, _type
        if _type in ['Organizer', 'Enthusiast', 'Gear Dealer']:
            tags =[channel.name, _type] 
            #print tags
            if not Profile.objects(name__iexact=title).first():
                profile = Profile(name=title, username=title.lower().replace(' ', '_'), password='testing', is_verified=True, 
                    main_image=image if image else None, channels=[channel.name], facets=tags)
                profile.save()

        elif _type in ['Adventure Trip']:
            tags = []
            if not Event.objects(title__iexact=title).first():
                event = Event(title=title, text=d.get('data', ''), is_published=True, published_timestamp=datetime.datetime.now(), channels=[channel.name], facets=[], main_image=image)
                event.save()

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
                    is_published=True, channels=[channel.name], facets=tags, main_image=image)
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



