# -*- coding: utf-8 -*-

import httplib2
import json

from django.conf import settings
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.views.decorators.http import require_POST

from oauth2client.client import OAuth2WebServerFlow
from apiclient import discovery
from oauth2client import client

@csrf_exempt
@require_POST
def store_auth_code(request):

    if not request.META['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest':
        return JsonResponse({'success': False}, status=403)

    post = json.loads(request.body).get
    auth_code = post('authcode', None)
    if not auth_code:
        return JsonResponse({'success': False}, status=500)

    # Exchange auth code for access token, refresh token, and ID token
    '''credentials = client.credentials_from_clientsecrets_and_code(
        settings.GOOGLE_OAUTH2_CLIENT_SECRETS_JSON,
        list(settings.GOOGLE_OAUTH2_SCOPES),
        auth_code
    )'''

    flow = OAuth2WebServerFlow(
        client_id = settings.GOOGLE_OAUTH2_CLIENT_ID,
        client_secret = settings.GOOGLE_OAUTH2_CLIENT_SECRET,
        scope = 'email profile https://www.googleapis.com/auth/drive',
        redirect_uri = 'postmessage'
    )

    credentials = flow.step2_exchange(auth_code)

    # Call Google API
    http_auth = credentials.authorize(httplib2.Http())
    #drive_service = discovery.build('drive', 'v3', http=http_auth)
    #appfolder = drive_service.files().get(fileId='appfolder').execute()

    email = credentials.id_token['email']

    request.session['email'] = str(credentials.id_token['email'])
    request.session['name'] = str(credentials.id_token['name'])
    request.session['sub'] = str(credentials.id_token['sub'])
    request.session['credentials'] = json.loads(credentials.to_json())
    return JsonResponse({'success': True, 'email': email})

def home(request):
    return render(request, 'home.html', {'version1': True})

def announcement(request):
    return render(request, 'announcement.html', {'version1': True})

def service_applications(request):
    return render(request, 'service-applications.html', {'version1': True})

def publications(request):
    return render(request, 'publications.html', {})
