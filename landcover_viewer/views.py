# -*- coding: utf-8 -*-

from django.shortcuts import render
import httplib2
from oauth2client.contrib.django_util.decorators import oauth_required

@oauth_required
def landcover(request):

    oauth = request.oauth
    try:
        oauth.credentials.get_access_token(httplib2.Http())
    except Exception as e:
        oauth.get_authorize_redirect()

    return render(request, 'landcover.html', {'version1': False})

@oauth_required
def landcover_version1(request):

    oauth = request.oauth
    try:
        oauth.credentials.get_access_token(httplib2.Http())
    except Exception as e:
        oauth.get_authorize_redirect()

    return render(request, 'landcover.html', {'version1': True})

def side_by_side_map(request):
    return render(request, 'side-by-side-map.html', {'version1': False})

def side_by_side_map_version1(request):
    return render(request, 'side-by-side-map.html', {'version1': True})
