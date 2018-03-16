# -*- coding: utf-8 -*-

from django.shortcuts import render
import httplib2
from oauth2client.contrib.django_util.decorators import oauth_required

@oauth_required
def forest_monitor(request):

    oauth = request.oauth
    try:
        oauth.credentials.get_access_token(httplib2.Http())
    except Exception as e:
        oauth.get_authorize_redirect()

    return render(request, 'forest-monitor.html', {})
