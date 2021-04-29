from django.urls import path

from user_registration import views

urlpatterns = [
    path('', views.register, name='registration'),
    path('successful_registration', views.successful_registration, name='successful_registration')
]