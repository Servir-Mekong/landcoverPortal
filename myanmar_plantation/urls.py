from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^myanmar-plantation/$', views.myanmar_plantation),
]
