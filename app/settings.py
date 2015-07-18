import os


#db_address = open('db_address.txt', 'r').read()
#print 'Using database', db_address

#MONGODB_HOST = '54.201.21.20'
MONGODB_HOST = 'localhost'

MONGODB_PORT = 27017
MONGODB_DB   = 'adventure2'
TEMPLATE_FOLDER = 'app/templates'
TEMPLATE_FOLDER = os.getcwd() + '/' + TEMPLATE_FOLDER
MEDIA_FOLDER = os.getcwd() + '/app/assets/media/'

CDN_URL='http://d3q5zq83v3a4xj.cloudfront.net'
CDN_DOMAIN ='d3q5zq83v3a4xj.cloudfront.net'

MANDRILL_API_KEY='AW8kuRPFtDyZpOrgSf-0BQ'
MANDRILL_DEFAULT_FROM='noreply@fitrangi.com'


EXCEPTION_API = True
