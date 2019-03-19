from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^landcover/$', views.landcover),
    url(r'^landcover/analysis/$', views.landcover_analysis),
    url(r'^landcover/v1/$', views.landcover_v1),
    url(r'^landcover/v1/analysis/$', views.landcover_v1_analysis),
    url(r'^landcover/v2/$', views.landcover_v2),
    url(r'^landcover/v2/analysis/$', views.landcover_v2_analysis),
]
