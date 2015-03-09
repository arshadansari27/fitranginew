from flask import g, redirect, render_template, flash, jsonify
from app.handlers import login_required
from app.handlers.editors import ModelEditor
from app.handlers.editors.model_editor import AdEditor
from app.models import Content, Node, Profile
from app.models.forms import ProfileEdit

__author__ = 'arshad'

from flask import request
from app import app
from channel_view import AdminChannelView, AdminAdvertisementView, AdminApprovalView


@app.route('/manage/channel/<channel>', methods=['GET', 'POST'])
@login_required
def channel_admin(channel):
    page = request.args.get('page', 1)
    if request.method == 'POST':
        query = request.form.get('query', '')
    else:
        query = request.args.get('query', '')

    if channel == 'Advertisement':
        return AdminAdvertisementView(query, page, paginated=True).render()
    return AdminChannelView(channel, paginated=True, query=query,page=page).render()

@app.route('/manage/approval', methods=['GET', 'POST'])
@login_required
def approvals():
    page = request.args.get('page', 1)
    if request.method == 'POST':
        query = request.form.get('query', '')
    else:
        query = request.args.get('query', '')

    return AdminApprovalView(paginated=True, query=query,page=page).render()


@app.route('/manage/advertisement-edit/<model>', methods=['GET', 'POST'])
@login_required
def advertisement_edit(model):
    if request.method == 'POST':
        pass
    return  AdEditor(model).render()

@app.route('/manage/model-edit/<channel>', methods=['GET', 'POST'])
@app.route('/manage/model-edit/<channel>/<model>', methods=['GET', 'POST'])
@login_required
def model_edit(channel, model=None):
    if request.method == 'POST':
        action = request.json.get('action', 'edit')
        if action == 'create':
            title = request.json.get('title', '')
            return jsonify(ModelEditor.create_new(g.user, channel, title))
        else:
            if not model:
                raise Exception("Invalid access")
            content = Content.objects(pk=model).first()
            if 'Profile' not in content.channels and content.created_by.id != g.user.id:
                return redirect("/manage")
            field = request.json.get('field', 'text')
            type = request.json.get('type', None)
            if type == 'array':
                value = request.json.get('data', None)
                if value:
                    value = value.split(',')
                else:
                    value = []
            else:
                value = request.json.get('data', '')
            if type and type == 'boolean':
                if value == 'True' or value == True:
                    value = True
                else:
                    value = False
            values = {}
            values[field] = value
            print "Modifying:", id, field, value
            flash('Successfully updated', category="success")
            content.update_existing(**values)
            return jsonify(dict(node=str(content.id), message='Successfully updated', status='success'))
    content = Content.objects(pk=model).first()
    if 'Profile' not in content.channels and content.created_by.id != g.user.id:
        flash("Unauthorized access", category="warning")
        return redirect("/manage")
    return ModelEditor(model, channel_name=channel).render()


@app.route('/manage')
@app.route('/manage/dashboard')
@login_required
def dashboard():
    return render_template('/generic/admin/base_admin.html', user=g.user)
