from django.urls import path
from . import views

# sets the list of urls the user will visit
urlpatterns = [
    path('', views.home, name='home'),
    path('character/', views.character),
]
