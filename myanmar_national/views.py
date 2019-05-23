# -*- coding: utf-8 -*-

from django.shortcuts import render

def myanmar_national(request):

    return render(request, 'myanmar-national.html', {})

def myanmar_national_portal(request):

    return render(request, 'myanmar-national-portal.html', {})
