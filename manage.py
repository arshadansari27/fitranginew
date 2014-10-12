import os
import sys

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from flask.ext.script import Manager, Server 
from app import app 

manager = Manager(app)

manager.add_command("runserver", Server(use_debugger = True, use_reloader = True, host = '0.0.0.0', port=4500))

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

@manager.command
def setupdb(local=False):
    from app.models import fixture
    print "Run Database Fixtures\n", "*" * 80
    fixture.db_fixture()

if __name__ == '__main__':
    manager.run()
