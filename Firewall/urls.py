"""Firewall URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
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
from django.urls import path
from App import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('',views.login, name="login"),
    path("logout", views.logout, name="logout"),

    path('dashboard/',views.dashboard, name="dashboard"),
    path('campaign/',views.campaign, name="campaign"),
    path('usergroups/',views.usergroups,name="usergroups"),
    path('emailtemp/',views.emailtemp,name="emailtemp"),
    path('sendingprofile/',views.sendingprofile,name="sendingprofile"),
    path('landingpage/',views.landingpage,name="landingpage"),
    path('accountsettings/',views.accountsettings,name="accountsettings"),

]