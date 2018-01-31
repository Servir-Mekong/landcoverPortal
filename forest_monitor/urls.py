from django.conf.urls import include, url
from . import api, views

urlpatterns = [
    url(r'^forest-monitor/$', views.forest_monitor),
]
