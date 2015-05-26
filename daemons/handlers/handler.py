###############################################################################
#
# Copyright (C) 2014, Tavendo GmbH and/or collaborators. All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# 1. Redistributions of source code must retain the above copyright notice,
# this list of conditions and the following disclaimer.
#
# 2. Redistributions in binary form must reproduce the above copyright notice,
# this list of conditions and the following disclaimer in the documentation
# and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
# LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
# SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
# INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
# CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.
#
###############################################################################

from twisted.internet.defer import inlineCallbacks

from autobahn.twisted.util import sleep
from autobahn.twisted.wamp import ApplicationSession
from autobahn.wamp.exception import ApplicationError
from app.models.profile import Profile
from app.models.streams import ChatMessage
from flask import jsonify
import datetime


CONCURRENT_USERS = {}

class AppSession(ApplicationSession):

    @inlineCallbacks
    def onJoin(self, details):


        def notification_counts(user, reset_stream, reset_messaging):
            profile = Profile.objects(pk=user).first()
            if not profile:
                return {}
            CONCURRENT_USERS[str(profile.id)] = datetime.datetime.now()

            if reset_stream in [1, "1"]:
                profile.public_activity_count = 0
                profile = profile.save()
            if reset_messaging in [1, "1"]:
                profile.private_activity_count = 0
                profile = profile.save()

            return dict(public_activity_count=profile.public_activity_count, private_activity_count=profile.private_activity_count)


        def create_message(user, to_user, message):
            author = Profile.objects(pk=user).first()
            recipient = Profile.objects(pk=to_user).first()
            message = ChatMessage.create_message(author, recipient, message)

            data = dict(id=to_user, image=author.cover_image_path, name=author.name, notifications=1, messages=[dict(my=True, author=user, recipient=to_user, message=message.message, image=author.cover_image_path, time=message.since)])
            data2 = dict(id=str(author.id), image=author.cover_image_path, name=author.name, notifications=1, messages=[dict(my=False, author=user, recipient=to_user, message=message.message, image=author.cover_image_path, time=message.since)])
            if CONCURRENT_USERS.has_key(to_user) and (datetime.datetime.now() - CONCURRENT_USERS[to_user]).seconds < 30:
                self.publish('com.fitrangi.messaging.listener.%s' % to_user, data2)

            return data

        def get_messages(user, initial=None):

            user = Profile.objects(pk=user).first()
            if not user:
                return None
            messages = ChatMessage.get_user_list(user)
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

            user_list = []
            for z in _user_list:
                messages = ChatMessage.get_message_between(user, Profile.objects(pk=z['id']).first(), all=True)
                messages = [dict(my=True if u.author == user else False, image=u.author.cover_image_path, message=u.message, time=u.since) for u in messages]
                all = dict(messages=messages)
                for _k, _v in z.iteritems():
                    all[_k] = _v
                user_list.append(all)
            return user_list


        reg3 = yield self.register(create_message, 'com.fitrangi.messaging.send')
        print("procedure create_message() registered: {}".format(reg3))

        reg4 = yield self.register(notification_counts, 'com.fitrangi.notifications')
        print("procedure notification_counts() registered: {}".format(reg4))

        reg5 = yield self.register(get_messages, 'com.fitrangi.messaging.all')
        print("procedure get_messages() registered: {}".format(reg5))

