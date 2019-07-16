from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^plantation/$', views.myanmar_plantation),
]
