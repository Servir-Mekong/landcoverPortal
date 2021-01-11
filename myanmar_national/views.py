# -*- coding: utf-8 -*-

from django.shortcuts import render

def myanmar_national(request):

    return render(request, 'announcement.html', {})

def myanmar_national_portal(request):

    return render(request, 'announcement.html', {})
