"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include
from quiz import views as quiz_views, views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('quizzes/', include('quiz.urls')),
    path('', quiz_views.home, name='home'),

    path('social-auth/', include('social_django.urls', namespace='social')),
    path('login/', views.login_view, name='login'),
    #path('logout/', views.logout_view, name='logout'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('register/', views.register_email, name='register_email'),
    path('verify_email/', views.verify_email, name='verify_email'),
    path('register_user/', views.register_user, name='register_user'),
    path('resend_code/', views.resend_code, name='resend_code'),
    path('password_reset/', include('django.contrib.auth.urls')),
    path('profile/', include('quiz.profile_urls')),

]
