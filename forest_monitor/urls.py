from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^forest-monitor/', views.forest_monitor),
]
