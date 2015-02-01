configuration = {
    'MENUS': {
        'Me': '/stream/me',
        'Articles': '/channel/Article',
        'Destinations': '/channel/Destination',
        'Finder (Profiles)': '/channel/Profile',
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
            'facets': ['Article']
        },
    
        'Event': {
            'template': 'feature/event',
            'model' : 'Event',
            'facets': ['Activity', 'Location']
        }, 
    
        'Profile': {
            'template': 'feature/profile',
            'model' : 'Profile',
            'facets': ['Profile']
        },
    
        'Product':{
            'template': 'feature/profile',
            'model' : 'Product',
            'facets': ['Product']
        },

        'Forum': {
            'template': 'feature/forum',
            'model' : 'Question',
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
            ("Travelling and Sightseeing", ["Architecture Monuments", "Beaches", "Forts and Caves", "Hill stations", "Places to Visit", "Theme Parks", "Wildlife Sanctuaries and Safaris"]),
            ("Water - Wonders", ["Canyoning", "Kayaking", "Kite Surfing", "Scuba Diving", "Snorkelling", "Surfing", "Water Rafting"]),
            ("Land Sports", ["Camping", "Cycling-Biking", "Marathons", "Mountaineering", "Off-beat Activities", "Rappelling and Valley Crossing", "Rock Climbing", "Trekking and Hiking", "Horse Riding"]),
            ("Other Sports", ["Stargazing", "Zorbing"])

        ],
        'Article': [
            ('Top 5 Series', []),
            ('Explore', []),
            ('Informative',[])
        ],
        'Profile': [
            ('Organisers', []),
            ('Gear Dealers', []),
            ('NGO\'s', []),
            ('Rescuers', []),
            ('Trainers', []),
            ('Guides', []),
            ('Institutes', []),
            ('Hotels', []),
            ('Govt. Bodies', []),
        ],
        'Location': [
            ('India', ['Andaman and Nicobar','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
                       'Punjab','Rajasthan','Sikkim','Tamil Nadu','Tripura','Uttar Pradesh',
                       'Uttarakhand	','West Bengal']),
            ('Nepal', []),
            ('Thailand', []),
            ('Macao', []),
            ('Hong Kong', []),
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
