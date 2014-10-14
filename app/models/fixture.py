from app.scripts.db_load import load_all, write_all
from app.models import *
from app import settings
print 'Using setting', settings.MONGODB_HOST, settings.MONGODB_PORT, settings.MONGODB_DB
import os

def html_setup():
    write_all()

def db_fixture():
    #aliases = generate_alias_wise_data()
    Configuration.load_from_configuration()
    data = load_all(False)
    admin = Profile.objects(roles__in=['Admin']).first()
    if not admin:
        admin = Profile(name="Arshad Ansari", username="arshadansari27", password='testing', is_verified=True, email='arshadansari27@gmail.com', channels=['Profile'], facets=['Profile', 'Enthusiasts'])
        admin.roles.append('Admin')
        admin.save()
    print admin.name

    for d in data:
        print '*' * 100
        title = d['title']

        if Content.objects(title=title).first() is not None:
            continue
        alias = d['type']
        print "Title and Type:", title, "->", alias
        channel = Channel.getByAlias(alias)
        image = None
        if d.get('image', None):
            image_path = d['image']
            if not os.path.exists(image_path):
                continue
            image = Image(image=open(image_path, 'rb'))
        _type = channel.getTypeByAlias(alias)
        #print "Channel Associated: ", channel.name, _type
        if _type in ['Organizer', 'Enthusiast', 'Gear Dealer']:
            tags =[channel.name, _type] 
            #print tags
            if not Profile.objects(name__iexact=title).first():
                profile = Profile(name=title, username=title.lower().replace(' ', '_'), password='testing', is_verified=True, 
                    main_image=image if image else None, channels=[channel.name], facets=tags)
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



