from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib import messages
import datetime
import sqlite3
from sqlite3 import Error


def db_connection():
    try:
        conn = sqlite3.connect("db.sqlite3")
        return conn
    except Error as e:
        print(e)


# Create your views here.
def dashboard(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method=="GET"):
            print(datetime.datetime.now())
            return render(request, "dashboard.html")
        elif(request.method=="POST"):
            return HttpResponse("Data Gaya")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")

def campaign(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method=="GET"):
            return render(request,"campaign.html")
        elif(request.method=="POST"):
            return HttpResponse("Data Gaya")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def usergroups(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method == "GET"):
            return render(request, "usergroups.html")
        elif (request.method == "POST"):
            return HttpResponse("Data Gaya")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def emailtemp(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method=="GET"):
            return render(request, "emailtemp.html")
        elif(request.method=="POST"):
            tempname=request.POST['tempname']
            subject = request.POST['subject']
            emailtext = request.POST['emailtext']
            conn = db_connection()
            cur = conn.cursor()
            cur.execute("insert into App_emailtemp(tempName,subject, text_html, userId_id) values('"+tempname+"'   )")
            return HttpResponse(tempname + subject + emailtext)
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def sendingprofile(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method == "GET"):
            return render(request, "sendingprofile.html")
        elif (request.method == "POST"):
            return HttpResponse("Data Gaya")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def landingpage(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method == "GET"):
            return render(request, "landingpage.html")
        elif (request.method == "POST"):
            return HttpResponse("Data Gaya")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def accountsettings(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method == "GET"):
            return render(request, "accountsettings.html")
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
        conn = db_connection()
        cur = conn.cursor()
        cur.execute("select id from auth_user where username='"+user+"'")
        userId = cur.fetchone()[0]
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
