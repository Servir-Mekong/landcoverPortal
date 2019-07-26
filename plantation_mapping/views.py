# -*- coding: utf-8 -*-

from django.shortcuts import render

def myanmar_plantation(request):

    return render(request, 'plantation-mapping.html', {})
