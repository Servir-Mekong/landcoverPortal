# -*- coding: utf-8 -*-

from django.conf import settings

def variable_settings(request):
    return {
        'GOOGLE_ANALYTICS_ID': 'UA-115894979-1',
        'GOOGLE_OAUTH2_CLIENT_ID': settings.GOOGLE_OAUTH2_CLIENT_ID,
    }
