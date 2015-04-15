__author__ = 'arshad'

from app import app
from app.utils import login_required
from flask import render_template, g, request
from app.models.streams import ChatMessage, UserMessage
from app.models.profile import Profile

@app.route("/messaging")
@login_required
def messaging():
    from app.views import force_setup_context
    context = force_setup_context({})
    from app.views import env
    template_path = 'site/layouts/chat.html'
    template = env.get_template(template_path)
    view = template.render(**context)
    context['card'] = view
    context['title'] = 'Fitrangi - Messaging'
    return render_template('site/pages/commons/view.html', **context)


@app.route('/messaging/user-list')
@login_required
def user_list():
    user = g.user
    messages = ChatMessage.objects(profiles=user).all()
    template = """
    <a href="#">
    <div data-user-id="%s"class="contact-list load-chat-messaging">
        <div class="contact">
            <a class="pull-left">
                <figure>
                    <img class="img-circle img-responsive" alt="" src="%s">
                </figure>
            </a>
            <h5>%s</h5>
            <small>%s</small>
        </div>
    </div>
    </a>
    """
    _user_list = []
    for message in messages:
        v = [u for u in message.profiles if u != user][0]
        if v is None:
            continue
        print v
        mesgs = list(message.messages)
        data = template % (str(v.id), v.cover_image_path, v.name, mesgs[-1].message if len(mesgs) > 0 else '')
        _user_list.append(data)
    return ''.join(_user_list)

@app.route('/messaging/updates')
@login_required
def updates():
    user = Profile.objects(pk=request.args.get('user')).first()
    luser = g.user
    mesg = ChatMessage.objects(profiles__in=[luser, user]).first()
    __message = [u for u in mesg.messages if u.read is None or not u.read]
    messages = [MESSAGE % ('my' if u.author == luser else 'friend', u.author.cover_image_path, u.message, u.created_timestamp) for u in __message]
    for m in __message:
        m.read = True
    mesg.save()
    return ''.join(messages)

@app.route('/messaging/message-list')
@login_required
def message_list():
    user = Profile.objects(pk=request.args.get('user')).first()
    luser = g.user
    mesg = ChatMessage.objects(profiles__in=[luser, user]).first()
    __message = mesg.messages
    messages = [MESSAGE % ('my' if u.author == luser else 'friend', u.author.cover_image_path, u.message, u.created_timestamp) for u in __message]
    for m in __message:
        m.read = True
    mesg.save()
    return MESSAGE_LIST % (user.cover_image_path, user.name, user.name, ''.join(messages))

MESSAGE = """
            <li class="%s-message clearfix">
                <figure class="profile-picture">
                    <img src="%s" class="img-circle img-responsive" alt="">
                </figure>
                <div class="message">
                    %s
                    <div class="time"><i class="fa fa-clock-o"></i> %s</div>
                </div>
            </li>
"""

MESSAGE_LIST = """
<div class="profile online">
        <a href="#" class="pull-left">
            <figure class="profile-picture">
                <img src="%s" class="img-circle img-responsive" alt="%s">
            </figure>
        </a>
        <h5>%s</h5>
    </div>

    <div class="chat-messages">
        <ul id="message-list-enumerate" class="messages">
            %s
        </ul>
    </div>

    <div class="write-message">
        <form class="row">
            <div class="form-group col-xs-1">
                <div class="btn-group dropup">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                        <i class="fa fa-paperclip"></i>
                        <span class="sr-only">Toggle Dropdown</span>
                    </a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#"><i class="fa fa-music"></i></a></li>
                        <li class="divider"></li>
                        <li><a href="#"><i class="fa fa-video-camera"></i></a></li>
                        <li class="divider"></li>
                        <li><a href="#"><i class="fa fa-image"></i></a></li>
                    </ul>
                </div>
            </div>

            <div class="form-group col-xs-10">
                <textarea class="form-control" placeholder="Write message"></textarea>
            </div>

            <div class="form-group col-xs-1 sent">
                <a href=""><i class="fa fa-paper-plane"></i></a>
            </div>
        </form>
    </div>
"""
