# -*- coding: utf-8 -*-

from django.shortcuts import render

'''
commented in case needed

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
'''

def landcover(request):
    return render(request, 'announcement.html', {})

def landcover_analysis(request):
    return render(request, 'announcement.html', {})

def landcover_v1(request):
    return render(request, 'announcement.html', {'version1': True})

def landcover_v1_analysis(request):
    return render(request, 'announcement.html', {'version1': True})

def landcover_v2(request):
    return render(request, 'announcement.html', {'version2': True})

def landcover_v2_analysis(request):
    return render(request, 'announcement.html', {'version2': True})
