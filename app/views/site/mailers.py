__author__ = 'arshad'

from app.handlers.messaging import send_single_email
from app.handlers import GENERIC_TITLE
from app import app, USE_CDN
from app.models import STREAM
from flask import render_template, request, g, redirect, jsonify, url_for, session, flash
from app.handlers.editors import NodeEditor
from app.handlers import NodeCollectionFactory, NodeExtractor
from app.models import Node, NodeFactory, ACTIVITY, ADVENTURE, ARTICLE, DISCUSSION, PROFILE, EVENT, TRIP, CONTEST
from app.models.profile import Profile, ProfileType
from app.utils import login_required, all_tags, specific_tags_article, specific_channels_discussion, specific_tags_discussion, specific_channels_article, specific_channels, specific_tags, save_profile_image
from app.handlers import  EditorView, PageManager
from app.settings import CDN_URL
from app.models import NodeFactory
from app.models.profile import Profile, ProfileType
import re, base64
from flask import render_template, g, request, jsonify, send_file, flash, redirect, url_for, session, make_response
from app.utils import login_required
from app import app
from StringIO import StringIO
from PIL import Image
import random, os


@app.route('/mail-template')
@app.route('/mail-template/')
@app.route('/mail-template/<template_name>')
def view_mail_template(template_name="generic_mail_template.html"):
    if not hasattr(g, 'user') or g.user is None or 'Admin' not in g.user.roles:
        return 'Forbidden', 403
    return render_template("/notifications/%s" % template_name, user=g.user)

