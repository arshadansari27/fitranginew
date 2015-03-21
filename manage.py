import os
import sys

#from app.models.extra import fixture


sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from flask.ext.script import Manager, Server 
from app import app 

manager = Manager(app)

manager.add_command("runserver", Server(use_debugger = True, use_reloader = True, host = '0.0.0.0', port=4500))

@manager.command
def path_urls():
    from app.daemons.update_urls import update_slug
    update_slug()

@manager.command
def daemon_keywords():
    from app.daemons.update_documents import update_keywords
    print 'Updating'
    update_keywords()

@manager.command
def daemon_ancestor():
    from app.daemons.update_documents import update_ancestor
    print 'Updating'
    update_ancestor()

if __name__ == '__main__':
    manager.run()
