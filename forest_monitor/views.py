# -*- coding: utf-8 -*-

from django.shortcuts import render

from forest_monitor.models import DownloadInfo
from forest_monitor.serializers import DownloadInfoSerializer

from rest_framework import generics

def forest_monitor(request):
    return render(request, 'announcement.html', {'version1': True})

class DownloadInfoCreateRead(generics.ListCreateAPIView):
    serializer_class = DownloadInfoSerializer
    queryset = DownloadInfo.objects.all()
