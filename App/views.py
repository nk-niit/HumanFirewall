from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib import messages
from django.contrib.auth.models import User
from .models import LandingPage, SendingProfile
import datetime


# Create your views here.
def dashboard(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method=="GET"):
            print(datetime.datetime.now())
            return render(request, "dashboard.html", context = { "header": "Dashboard" })
        elif(request.method=="POST"):
            return HttpResponse("Data Gaya")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def campaign(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method=="GET"):
            return render(request,"campaign.html", context = { "header": "Campaigns" })
        elif(request.method=="POST"):
            return HttpResponse("Data Gaya")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def usergroups(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method == "GET"):
            return render(request, "usergroups.html", context = { "header": "Users & Groups" })
        elif (request.method == "POST"):
            return HttpResponse("Data Gaya")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def emailtemp(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method=="GET"):
            return render(request, "emailtemp.html", context = { "header": "Email Templates" })
        elif(request.method=="POST"):
            tempname=request.POST['tempname']
            subject = request.POST['subject']
            emailtext = request.POST['emailtext']
            # conn = db_connection()
            # cur = conn.cursor()
            # cur.execute("insert into App_emailtemp(tempName,subject, text_html, userId_id) values('"+tempname+"'   )")
            return HttpResponse(tempname + subject + emailtext)
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def sendingprofile(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if request.method == "POST":
            obj = SendingProfile()
            flag = True
            names = ['name', 'from', 'host', 'username', 'password']            
            for name in names:
                if not request.POST[name]:
                    flag = False
                    break           
            if flag == True:
                obj.name = request.POST['name']
                obj._from = request.POST['from']
                obj.host = request.POST['host']
                obj.username = request.POST['username']
                obj.password = request.POST['password']
                obj.userId_id = id
                obj.save()
                return redirect('/sendingprofile')
            else:
                return HttpResponse("Data missing in fields.")
        return render(request, "sendingprofile.html", context = { "header": "Sending Profiles" })
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def landingpage(request):
    if request.session.has_key('id'):
        id = request.session['id']       
        if request.method == "POST":
            obj = LandingPage()
            if request.POST['name'] and request.POST['html']:
                obj.name = request.POST['name']
                obj.content = request.POST['html']
                obj.userId_id = id
                obj.save()
                return redirect('/landingpage')
            return HttpResponse("No Data in fields")        
        return render(request, "landingpage.html", context = { "header": "Landing Pages" })
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def accountsettings(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method == "GET"):
            return render(request, "accountsettings.html", context = { "header": "Account Settings" })
        elif (request.method == "POST"):
            return HttpResponse("Data Gaya")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def login(request):
    if request.session.has_key('id'):
        id = request.session['id']
        return render(request, "dashboard.html")
    else:
        #print(datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
        return render(request,"login.html")


def user_check(request):
    user=request.POST['username']
    passwd=request.POST['password']
    authen = authenticate(username=user, password=passwd)
    if authen is not None:
        u = User.objects.get(username=user)
        userId = u.id
        request.session['id'] = userId
        request.session['username'] = user
        #request.session.set_expiry(500) # in seconds
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
