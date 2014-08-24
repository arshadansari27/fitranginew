configuration = {
    'MENUS': {
        'Activities': [ 
            ('All', '/channel/Activity'),
            ('Sky Fly', '/channel/Activity?subchannel=Sky - Fly'),
            ('Snow Flow', '/channel/Activity?subchannel=Snow - Flow'),
            ('Travelling & SightSeeing', '/channel/Activity?subchannel=Travelling & SightSeeing'),
            ('Water Wonders', '/channel/Activity?subchannel=Water - Wonders'),
            ('Land Sports', '/channel/Activity?subchannel=Land Sports'),
            ('Other Sports', '/channel/Activity?subchannel=Other Sports')
        ],
        'Articles': [ 
            ('All', '/channel/Article'),
            ('Top 5 Series', '/channel/Article?subchannel=Top 5 Series'),
            ('Explore', '/channel/Article?subchannel=Explore'),
            ('Informative', '/channel/Article?subchannel=Informative')
        ],
        'Destinations': '/channel/Destination',
        'Finder (Profiles)': [ 
            ('All', '/channel/Profile'),
            ('Organizers', '/channel/Profile?subchannel=Organizer'),
            ('Gear Dealers', '/channel/Profile?subchannel=Gear Dealer'),
            ('NGO\'s', '/channel/Profile?subchannel=NGO'),
            ('Rescuers', '/channel/Profile?subchannel=Rescuer'),
            ('Trainers', '/channel/Profile?subchannel=Trainer'),
            ('Guides', '/channel/Profile?subchannel=Guide'),
            ('Institutes', '/channel/Profile?subchannel=Institute'),
            ('Hotels', '/channel/Profile?subchannel=Hotel'),
            ('Govt. Bodies', '/channel/Profile?subchannel=Govt'),
        ],
        'Adventure Trips':  '/channel/Event?subchannel=AdventureTrip',
        'Forum': '/channel/Forum'
    },
    'DEFAULT_CHANNELS': {
        'Destination': {
            'template': 'feature/common',
            'model' : 'Content',
            'facets': ['Activity', 'Location']
        },
    
        'Activity': {
            'template': 'feature/common',
            'model' : 'Content',
            'menu_view' : 'default',
            'facets': ['Activity']
        },
    
        'Article': {
            'template': 'feature/common',
            'model' : 'Content',
            'facets': []
        },
    
        'Event': {
            'template': 'feature/event',
            'model' : 'Event',
            'facets': []
        }, 
    
        'Profile': {
            'template': 'feature/profile',
            'model' : 'Profile',
            'facets': []
        },
    
        'Product':{
            'template': 'feature/profile',
            'model' : 'Product',
            'facets': ['Product']
        },

        'Forum': {
            'template': 'feature/forum',
            'model' : 'ForumThread',
            'facets': [],
        }
    },
    'DEFAULT_ROLES': {
            'Admin': {'role': 'Administration'}, 
            'Manager': {'role': 'Manager'}, 
            'Enthusiast': {'role': 'Enthusiast'}, 
            'EventOrganiser': {'role': 'EventOrganiser'}, 
            'Retailer': {'role': 'Retailer'}, 
    }, 
    'FACETS': {
        'Activity':[ 
            ("Sky - Fly", ["Bungee jumping", "Hang Gliding", "Hot Air Ballooning", "Para Motoring", "Paragliding", "Parasailing", "Sky Diving","Zip Line"]),
            ("Snow - Flow", []),
            ("Travelling & Sightseeing", ["Architecture Monuments", "Beaches", "Forts & Caves", "Hill stations", "Places to Visit", "Theme Parks", "Wildlife Sanctuaries & Safaris"]),
            ("Water - Wonders", ["Canyoning", "Kayaking", "Kite Surfing", "Scuba Diving", "Snorkelling", "Surfing", "Water Rafting"]),
            ("Land Sports", ["Camping", "Cycling-Biking", "Marathons", "Mountaineering", "Off-beat Activities", "Rappelling & Valley Crossing", "Rock Climbing", "Trekking & Hiking", "Horse Riding"]),  
            ("Other Sports", ["Stargazing", "Zorbing"])

        ],
        'Location': [
            ('India', ['Maharashtra', 'Gujrat', 'Kerela', 'Himachal Pradesh']),
            ('Nepal', []),
            ('Sri Lanka', [])
        ],
        'Product': [
            ('Clothes', []),
            ('Accessores', []),
            ('Bags', []),
            ('Footwear', []),
            ('Gears', []),
            ('Tools',[])
        ]

    }



}
