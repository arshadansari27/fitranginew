import os


#db_address = open('db_address.txt', 'r').read()
#print 'Using database', db_address

#MONGODB_HOST = '54.201.21.20'
MONGODB_HOST = 'localhost'

MONGODB_PORT = 27017
MONGODB_DB   = 'adventure2'
TEMPLATE_FOLDER = 'app/templates'
folder = os.getcwd() + '/' + TEMPLATE_FOLDER
