from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^myanmar-national/$', views.myanmar_national),
    url(r'^myanmar-national-portal/$', views.myanmar_national_portal),
]
