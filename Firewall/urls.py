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
from django.conf.urls import url

urlpatterns = [
    path('admin/', admin.site.urls),

    path('user_check', views.user_check),
    path('',views.login, name="login"),
    path("logout", views.logoutfunc, name="logout"),

    path('dashboard',views.dashboard, name="dashboard"),
    
    path('campaign',views.campaign, name="campaign"),
    path('campaign/addcampaign', views.addCampaign, name="addcampaign"),
    path('campaign/rc/complete', views.completeCampaign, name="completecampaign"),

    path('usergroups',views.usergroups,name="usergroups"),
    path('usergroups/adduser', views.addUser, name="adduser"),
    path('usergroups/addgroup', views.addGroup, name="addgroup"),
    path('usergroups/edituser', views.editUser, name="edituser"),
    path('usergroups/editgroup', views.editGroup, name="editgroup"),
    path('usergroups/deleteuser', views.deleteUser, name="deleteuser"),
    path('usergroups/deletegroup', views.deleteGroup, name="deletegroup"),
    path('usergroups/userdetails/<int:uid>', views.getUserDetails, name="userdetails"),
    path('usergroups/groupdetails/<int:gid>', views.getGroupDetails, name="groupdetails"),
    path('usergroups/getusers', views.getUsersA, name="getusersA"),
    path('usergroups/getusers/<int:gid>', views.getUsersE, name="getusersE"),
    
    path('emailtemp',views.emailtemp,name="emailtemp"),
    path('emailtemp/addtemplate', views.addTemplate, name="addtemplate"),
    
    path('sendingprofile',views.sendingprofile,name="sendingprofile"),
    path('sendingprofile/addprofile', views.addProfile, name="addprofile"),
    path('sendingprofile/editprofile', views.editProfile, name="editprofile"),
    path('sendingprofile/profiledetails/<int:pid>', views.getProfileDetails, name="profiledetails"),
    
    path('landingpage',views.landingpage,name="landingpage"),
    path('landingpage/addpage', views.addPage, name="addpage"),
    path('landingpage/editpage', views.editPage, name="editpage"),
    path('landingpage/deletepage', views.deletePage, name="deletepage"),
    path('landingpage/pagedetails/<int:pid>', views.getPageDetails, name="pagedetails"),
    path('landingpage/preview/<slug:fname>', views.previewPage, name="showpage"),
    path('landingpage/serve/<slug:fname>/<slug:trackid>', views.servepage, name = "servepage"),

    path('accountsettings',views.accountsettings,name="accountsettings"),
    path('image_load/<slug:iid>', views.image_load, name='image_load'),
]