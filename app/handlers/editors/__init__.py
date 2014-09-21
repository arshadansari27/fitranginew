__author__ = 'arshad'

from app.handlers.editors.model_editor import ModelEditor
from flask import request, redirect
from app import app


@app.route('/model/<channel>/<key>/edit', methods=['GET', 'POST'])
@app.route('/model/<channel>/add', methods=['GET', 'POST'])
def model_editor_view(channel, key=None):
    if request.method == 'POST':
        form = {}
        for k, v in request.form.iteritems():
            if k == 'channels':
                try:
                    form[k] = request.form.getlist(k)
                except:
                    form[k] = request.form[k]
            else:
                form[k] = v
        if not form.has_key('channels'):
            form['channels'] = [channel]
            if channel == 'Profile':
                form['channels'].append('Enthusiast')
        if key:
            ModelEditor(key, channel_name=channel, form=form).update()
        else:

            me = ModelEditor(key, channel_name=channel, form=form)
            me.add_new()
            key = str(me.model.id)
            return redirect('/model/%s/%s/edit' % (channel, key))
    if key:
        return ModelEditor(key, channel_name=channel).render()
    else:
        return ModelEditor(key, channel_name=channel).render()

