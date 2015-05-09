from app.models.activity import Activity
from app.models.adventure import Location, Adventure
from app.models.content import Channel
from app.models.profile import Profile, ProfileType


def get_query_set(cls):
    return cls.objects


def get_activities():
    activities= {
        "Air Sports": {
                    "Bungee jumping": "/explore/activity?name=Bungee jumping",
                    "Hot Air Ballooning": "/explore/activity?name=Hot Air Ballooning",
                    "Paragliding": "/explore/activity?name=Paragliding",
                    "Sky Diving": "/explore/activity?name=Sky Diving",
                    "Zip Line": "/explore/activity?name=Zip Line"
        },
        "Water Sports": {
                    "Kayaking": "/explore/activity?name=Kayaking",
                    "Kite Surfing": "/explore/activity?name=Kite Surfing",
                    "Scuba Diving": "/explore/activity?name=Scuba Diving",
                    "Snorkelling": "/explore/activity?name=Snorkelling",
                    "Surfing": "/explore/activity?name=Surfing",
                    "Water Rafting": "/explore/activity?name=Water Rafting"
        },
        "Land Sports": {
                    "Skiing": "/explore/activity?name=Skiing",
                    "Snowboarding": "/explore/activity?name=Snowboarding",
                    "Camping": "/explore/activity?name=Camping",
                    "Canyoning": "/explore/activity?name=Canyoning",
                    "Cycling-Biking": "/explore/activity?name=Cycling and Biking",
                    "Marathons": "/explore/activity?name=Marathons",
                    "Mountaineering": "/explore/activity?name=Mountaineering",
                    "Rappelling and Valley Crossing": "/explore/activity?name=Rappelling and Valley Crossing",
                    "Rock Climbing": "/explore/activity?name=Rock Climbing",
                    "Trekking and Hiking": "/explore/activity?name=Trekking and Hiking",
                    "Horse Riding": "/explore/activity?name=Horse Riding",
                    "Zorbing": "/explore/activity?name=Zorbing"
        }
    }

    return activities


configuration = {
    'menus': [
        {
            "name": "explore",
            "display": "Explore",
            "placement": "app",
            "children": ["activity", "adventure", "trip"],
            "view": "/explore"
        },
        {
            "name": "community",
            "display": "Community",
            "placement": "app",
            "children": ["profile", "discussion", "event"],
            "view": "/community"
        },
        {
            "name": "journal",
            "display": "Journal",
            "placement": "app",
            "children": ["trending", "latest", "news"],
            "view": "/journal"
        },
        {
            "name": "activity",
            "display": "Activities",
            "placement": "main",
            "drop_downs": [
                ("Sky - Fly", {
                    "Bungee jumping": "/explore/activity?name=Bungee jumping",
                    "Hang Gliding": "/explore/activity?name=Hang Gliding",
                    "Hot Air Ballooning": "/explore/activity?name=Hot Air Ballooning",
                    "Para Motoring": "/explore/activity?name=Para Motoring",
                    "Paragliding": "/explore/activity?name=Paragliding",
                    "Parasailing": "/explore/activity?name=Parasailing",
                    "Sky Diving": "/explore/activity?name=Sky Diving",
                    "Zip Line": "/explore/activity?name=Zip Line"
                }),
                ("Water - Wonders", {
                    "Canyoning": "/explore/activity?name=Canyoning",
                    "Kayaking": "/explore/activity?name=Kayaking",
                    "Kite Surfing": "/explore/activity?name=Kite Surfing",
                    "Scuba Diving": "/explore/activity?name=Scuba Diving",
                    "Snorkelling": "/explore/activity?name=Snorkelling",
                    "Surfing": "/explore/activity?name=Surfing",
                    "Water Rafting": "/explore/activity?name=Water Rafting"
                }),
                ("Land Sports", {
                    "Snow - Flow": "/explore/activity?name=Snow - Flow",
                    "Camping": "/explore/activity?name=Camping",
                    "Cycling-Biking": "/explore/activity?name=Cycling-Biking",
                    "Marathons": "/explore/activity?name=Marathons",
                    "Mountaineering": "/explore/activity?name=Mountaineering",
                    "Off-beat Activities": "/explore/activity?name=Off-beat Activities",
                    "Rappelling and Valley Crossing": "/explore/activity?name=Rappelling and Valley Crossing",
                    "Rock Climbing": "/explore/activity?name=Rock Climbing",
                    "Trekking and Hiking": "/explore/activity?name=Trekking and Hiking",
                    "Horse Riding": "/explore/activity?name=Horse Riding",
                    "Stargazing": "/explore/activity?name=Stargazing",
                    "Zorbing": "/explore/activity?name=Zorbing"
                })
            ]
        },
        {
            "name": "adventure",
            "display": "Adventures",
            "placement": "main",
            "view": "/explore/adventures",
            'facets': [('activities', Activity), ('location', Location), ('extremity_level', int)]
        },
        {
            "name": "trip",
            "display": "Trips",
            "placement": "main",
            "view": "/explore/trips",
            'facets': [('activities', Activity), ('adventure', Adventure), ('difficulty_rating', int)]
        },
        {
            "name": "profile",
            "display": "Profile Finder",
            "placement": "main",
            "view": "/community/profiles",
            'facets': [('type', ProfileType)]
        },
        {
            "name": "discussion",
            "display": "Discussions",
            "placement": "main",
            "view": "/community/discussions",
            'facets': [('channels', Channel), ('profiles', Profile)]
        },
        {
            "name": "event",
            "display": "Event",
            "placement": "main",
            "view": "/community/events",
            'facets': [('location', Location), ('organizer', Profile)]
        },
        {
            "name": "trending",
            "display": "Trending",
            "placement": "main",
            "view": "/journal/trending",
            'facets': [('channels', Channel), ('profiles', Profile)]
        },
        {
            "name": "latest",
            "display": "Latest",
            "placement": "main",
            "view": "/journal/latest",
            'facets': [('channels', Channel), ('profiles', Profile)]
        },
        {
            "name": "news",
            "display": "News",
            "placement": "main",
            "view": "/journal/news",
            'facets': [('channels', Channel), ('profiles', Profile)]
        },
    ],

    'channels': [
        {'name': 'Journal', 'parent': None},
        {'name': 'Top 5 Series', 'parent': 'Journal'},
        {'name': 'Informative', 'parent': 'Journal'},
        {'name': 'Explore', 'parent': 'Journal'},
        {'name': 'News', 'parent': 'Journal'},
        {'name': 'Guidelines', 'parent': 'Journal'},
    ],
    'profile_types': [
        'Organizers',
        'Gear Dealers',
        'NGO\'s',
        'Rescuers',
        'Trainers',
        'Guides',
        'Institutes',
        'Hotels',
        'Govt. Bodies',
    ],
    'states': {
        'India': ['Andaman and Nicobar','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
                       'Punjab','Rajasthan','Sikkim','Tamil Nadu','Tripura','Uttar Pradesh',
                       'Uttarakhand	','West Bengal'],
        'Nepal': [],
        'Thailand': [],
        'Macao': [],
        'Hong Kong': [],
        'Sri Lanka': []
    },
    'tags': [
        "Adventure Tourism Conclave 2015",
        "Safety & Training ",
        "Maharashtra GR",
        "Marketing Challenges",
        "Business Consultancy",
        "India Perspective",
        "Maharashtra Perspective",
        "Emerging Trends & Technologies"
    ]
}
