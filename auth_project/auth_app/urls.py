from django.urls import path
from . import views 
from django.shortcuts import redirect



urlpatterns = [
    path('index/', views.index, name='index'),
    path('', lambda request: redirect('home')),
    path('anime/', views.anime, name='anime'),
    path('movies/', views.index, name='movies'),
    path('contact/', views.contact, name='contact'),
    path('about/', views.about, name='about'),
    path('register/',views.register_view,name='register'),
    path('login/',views.login_view,name='login'),
    path('logout/',views.logout_view,name='logout'),
    path('dashboard/',views.dashboard_view,name='dashboard'),
    path('profile/', views.profile_view, name='profile'),
]