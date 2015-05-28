__author__ = 'arshad'

from app import app
from app.utils import login_required
from flask import render_template, g, request, jsonify
from app.models.streams import ChatMessage
from app.models.profile import Profile

@app.route("/messaging2")
@login_required
def messaging():
    load_user = request.args.get('load-user', None)
    if load_user:
        load_user = Profile.objects(pk=load_user).first()
    from app.views import force_setup_context
    context = force_setup_context({})
    context['initial'] = load_user
    from app.views import env
    template_path = 'site/layouts/chat.html'
    template = env.get_template(template_path)
    view = template.render(**context)
    context['card'] = view
    context['title'] = 'Fitrangi - Messaging'
    return render_template('site/pages/commons/view.html', **context)

@app.route("/messaging")
@login_required
def messaging2():
    load_user = request.args.get('load-user', None)
    if load_user:
        load_user = Profile.objects(pk=load_user).first()
    from app.views import force_setup_context
    context = force_setup_context({})
    context['initial'] = load_user
    from app.views import env
    template_path = 'site/layouts/chat2.html'
    template = env.get_template(template_path)
    view = template.render(**context)
    context['card'] = view
    context['title'] = 'Fitrangi - Messaging'
    return render_template('site/pages/commons/view2.html', **context)


@app.route('/messaging/create-message', methods=['POST'])
def create_message():
    logged_in_user = g.user
    user = Profile.objects(pk=request.form.get('user', None)).first()
    _message = request.form.get('message', '')
    ChatMessage.create_message(logged_in_user, user, _message)
    return messages_list(False)

@app.route('/messaging/user-list')
@login_required
def user_list():
    user = g.user
    messages = ChatMessage.get_user_list(user)
    initial = request.args.get('initial')
    if initial:
        initial = Profile.objects(pk=initial).first()

    _user_list = []
    if initial:
        initial_user = dict(id=str(initial.id), image=initial.cover_image_path, name=initial.name, notifications='')
        _user_list.append(initial_user)

    for m, v in messages.iteritems():
        if initial and m == initial:
            continue
        data = dict(id=str(m.id), image=m.cover_image_path, name=m.name, notifications=str(v))
        _user_list.append(data)

    response = dict(result=_user_list)
    print 'User list', response
    return jsonify(response)

@app.route('/messaging/updates')
@login_required
def updates():
    return messages_list(False)

@app.route('/messaging/message-list')
@login_required
def message_list():
    return messages_list(True)

def messages_list(all):
    user = Profile.objects(pk=request.args.get('user')).first()
    logged_in_user = g.user
    messages = list(ChatMessage.get_message_between(user, logged_in_user, all=all))
    response = dict(result=[dict(my=True if u.author == logged_in_user else False, image=u.author.cover_image_path, message=u.message, time=u.since) for u in messages])
    print 'Messages: ', logged_in_user, len(response['result'])
    return jsonify(response)

