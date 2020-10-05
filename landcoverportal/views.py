# -*- coding: utf-8 -*-

import httplib2
import json

from django.conf import settings
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
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

def service_applications(request):
    return render(request, 'service-applications.html', {'version1': True})

def publications(request):
    return render(request, 'publications.html', {})

def about(request):
    return render(request, 'about.html', {})

def services(request):
    return render(request, "services.html")

def method(request):
    return render(request, "method.html")

def library(request):
    return render(request, "library.html")

def publication(request):
    return render(request, "publication.html")

def event(request):
    return render(request, "events.html")

def training(request):
    return render(request, "training.html")

def blog(request):
    return render(request, "blog.html")

def dashboard(request):
    return render(request, "dashboard.html")

def GETBlog(request):
    import gspread
    from oauth2client.service_account import ServiceAccountCredentials
    scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name('credentials/privatekey.json', scope)
    client = gspread.authorize(creds)
    sheet = client.open('RLCMS-blog').sheet1
    telemedicine = sheet.get_all_records()
    your_list_as_json = json.dumps(telemedicine)
    return HttpResponse(your_list_as_json)

def GETEvents(request):
    import gspread
    from oauth2client.service_account import ServiceAccountCredentials
    scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name('credentials/privatekey.json', scope)
    client = gspread.authorize(creds)
    sheet = client.open('RLCMS-events').sheet1
    res_list = sheet.get_all_records()
    res_list = sorted(res_list, key=lambda x: int(x['Order']), reverse=True)
    list_as_json = json.dumps(res_list)
    return HttpResponse(list_as_json)

def GETTensorContent(request):
    import gspread
    from oauth2client.service_account import ServiceAccountCredentials
    scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name('credentials/privatekey.json', scope)
    client = gspread.authorize(creds)
    sheet = client.open('RLCMS-tensorflow').sheet1
    res_list = sheet.get_all_records()
    # res_list = sorted(res_list, key=lambda x: int(x['Order']), reverse=True)
    list_as_json = json.dumps(res_list)
    return HttpResponse(list_as_json)

def GETTrainingContent(request):
    import gspread
    from oauth2client.service_account import ServiceAccountCredentials
    scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name('credentials/privatekey.json', scope)
    client = gspread.authorize(creds)
    sheet = client.open('RLCMS-training').sheet1
    res_list = sheet.get_all_records()
    # res_list = sorted(res_list, key=lambda x: int(x['Order']), reverse=True)
    list_as_json = json.dumps(res_list)
    return HttpResponse(list_as_json)

def training_detail(request):
    return render(request, "training-detail.html")

def event_detail(request):
    return render(request, "events-detail.html")
