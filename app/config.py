configuration = {
    'DEFAULT_CHANNELS': {
        'Destination': {
            'template': 'feature/common',
            'model' : 'Content',
            'menu_view' : 'default',
            'subtypes': [],
            'facets': {},
            'related': ['Activity']
        },
    
        'Activity': {
            'template': 'feature/common',
            'model' : 'Content',
            'menu_view' : 'default',
            'subtypes': ["Sky - Fly", "Snow - Flow", "Travelling & Sightseeing", "Water - Wonders", "Land Sports", "Other Sports"],
            'facets': {
                    "Sky - Fly": ["Bungee jumping", "Hang Gliding", "Hot Air Ballooning", "Para Motoring", "Paragliding", "Parasailing", "Sky Diving","Zip Line"],
                    "Snow - Flow": [],
                    "Travelling & Sightseeing": ["Architecture Monuments", "Beaches", "Forts & Caves", "Hill stations", "Places to Visit", "Theme Parks", "Wildlife Sanctuaries & Safaris"],
                    "Water - Wonders": ["Canyoning", "Kayaking", "Kite Surfing", "Scuba Diving", "Snorkelling", "Surfing", "Water Rafting"],
                    "Land Sports": ["Camping", "Cycling-Biking", "Marathons", "Mountaineering", "Off-beat Activities", "Rappelling & Valley Crossing", "Rock Climbing", "Trekking & Hiking", "Horse Riding"],  
                    "Other Sports": ["Stargazing", "Zorbing"],
            },
            'related': []
        },
    
        'General Articles': {
            'template': 'feature/common',
            'model' : 'Content',
            'menu_view' : 'default',
            'subtypes': ['Informative', 'Explore', 'Top 5 Series'],
            'facets': {},
            'related': []
        },
    
        'Event': {
            'template': 'feature/event',
            'model' : 'Event',
            'menu_view' : 'default',
            'subtypes': ['Adventure', 'Meetup', 'Conference', 'Sport'],
            'facets': {},
            'related': []
        }, 
    
        'Profile': {
            'template': 'feature/profile',
            'model' : 'Profile',
            'menu_view' : 'default',
            'subtypes': ['Retailer', 'EventOrganiser', 'Enthusiast', 'Rescuer', 'Guide', 'Trainer'],
            'facets': {},
            'related': []
        },
    
        'Product':{
            'template': 'feature/profile',
            'model' : 'Product',
            'menu_view' : 'default',
            'subtypes': ['Clothes', 'Accessores', 'Bags', 'Footwear', 'Gears', 'Tools'],
            'facets': {},
            'related': []
        },

        'Forum': {
            'template': 'feature/forum',
            'model' : 'ForumThread',
            'menu_view' : 'forum_special',
            'subtypes': [],
            'facets': {},
            'related': []
        }
    },
    'DEFAULT_ROLES': {
            'Admin': {'role': 'Administration'}, 
            'Manager': {'role': 'Manager'}, 
            'Enthusiast': {'role': 'Enthusiast'}, 
            'EventOrganiser': {'role': 'EventOrganiser'}, 
            'Retailer': {'role': 'Retailer'}, 
    }, 



}
