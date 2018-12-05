from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^landcover/v1/$', views.landcover_version1),
    url(r'^landcover/$', views.landcover),
    url(r'^side-by-side-map/$', views.side_by_side_map),
    url(r'^side-by-side-map/v1/$', views.side_by_side_map_version1),
]
