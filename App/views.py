from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib import messages

# Create your views here.
def dashboard(request):
    if request.session.has_key('username'):
        username = request.session['username']
        return render(request, "dashboard.html")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")

def campaign(request):
    return render(request,"campaign.html")

def usergroups(request):
    return render(request,"usergroups.html")

def emailtemp(request):
    return render(request,"emailtemp.html")

def sendingprofile(request):
    return render(request,"sendingprofile.html")

def landingpage(request):
    return render(request,"landingpage.html")

def accountsettings(request):
    return render(request,"accountsettings.html")

def login(request):
    if request.session.has_key('username'):
        username = request.session['username']
        return render(request, "dashboard.html")
    else:
        return render(request,"login.html")

def user_check(request):
    user=request.POST['username']
    passwd=request.POST['password']
    authen = authenticate(username=user, password=passwd)
    print(authen)
    if authen is not None:
        request.session['username'] = user
        #login(request,authen)   ##session part h
        return redirect("dashboard")
    else:
        messages.info(request, 'Invalid Credentials')
        return redirect("login")

def logoutfunc(request):
    logout(request)
    #del request.session['username']
    messages.info(request, 'LOG OUT')
    return redirect("login")