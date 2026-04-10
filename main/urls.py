from django.urls import path
from . import views

# sets the list of urls the user will visit
urlpatterns = [
    path('', views.home, name='home'),
    path('character/', views.character, name='character'),
    path('move/<int:move_id>/', views.move_detail, name='move_detail'),
    path('credit/', views.credit, name='credit'),
]
