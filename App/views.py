from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def dashboard(request):
    return render(request, "dashboard.html")

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