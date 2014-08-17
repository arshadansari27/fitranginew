import sys, os

#MONGODB_HOST = '54.201.21.20' 
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
MONGODB_DB   = 'adventure'
TEMPLATE_FOLDER = 'app/templates'
folder = os.getcwd() + '/' + TEMPLATE_FOLDER
print folder, os.path.exists(folder)
