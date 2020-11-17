from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, logout
from django.contrib import messages
from django.contrib.auth.models import User
from .models import LandingPage, SendingProfile, Targets, UserGroups, GroupedUsers
import json


def dashboard(request):
    if request.session.has_key('id'):
        id = request.session['id']
        return render(request, "dashboard.html", context={ "header": "Dashboard" })
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def campaign(request):
    if request.session.has_key('id'):
        id = request.session['id']
        return render(request, "campaign.html", context={ "header": "Campaigns" })
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def usergroups(request):
    if request.session.has_key('id'):
        id = request.session['id']
        return render(request, "usergroups.html", context={ "header": "Users & Groups", "user_data": Targets.objects.all(), "group_data": UserGroups.objects.all() })
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def addUser(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if request.method == "POST":
            obj = Targets()
            fullname = request.POST['fullname']
            fullname_list = fullname.split(" ")
            obj.firstName = fullname_list[0]
            obj.lastName = fullname_list[1]
            obj.email = request.POST['email']
            obj.position = request.POST['position']
            obj.save()
            return render(request, "usergroups.html", context={ "header": "Users & Groups", "user_data": Targets.objects.all(), "group_data": UserGroups.objects.all() })
        return redirect("/usergroups")


def addGroup(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if request.method == "POST":
            obj1 = UserGroups()
            obj1.groupName = request.POST['groupname']
            obj1.totalUsers = int(request.POST['totalusers'])
            obj1.save()
            record = UserGroups.objects.get(groupName=request.POST['groupname'])
            all_users = request.POST['users']
            if all_users != "":
                for u in all_users.split(","):
                    obj2 = GroupedUsers()
                    obj2.group_id = record.groupId
                    obj2.user_id = int(u)
                    obj2.save()
            return render(request, "usergroups.html", context={ "header": "Users & Groups", "user_data": Targets.objects.all(), "group_data": UserGroups.objects.all() })
        return redirect("/usergroups")


def editUser(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if request.method == "POST":
            queryset = Targets.objects.filter(email=request.POST['email'])
            if queryset.exists():
                record = Targets.objects.get(email=request.POST['email'])
                fullname = request.POST['fullname']
                fullname_list = fullname.split(" ")
                record.firstName = fullname_list[0]
                record.lastName = fullname_list[1]
                record.position = request.POST['position']
                record.save()
                return render(request, "usergroups.html", context={ "header": "Users & Groups", "user_data": Targets.objects.all(), "group_data": UserGroups.objects.all() })
            else:
                addUser(request)
        return redirect("/usergroups")


def editGroup(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if request.method == "POST":
            added = []
            removed = []
            gid = request.POST['gid']
            initial = request.POST['initialusers']
            selected = request.POST['selectedusers']
            record = UserGroups.objects.get(groupId=gid)
            if initial != "" and selected != "":
                for s in selected.split(","):
                    if s not in initial:
                        added.append(s)
                for i in initial.split(","):
                    if i not in selected:
                        removed.append(i)
                for element in removed:
                    r = GroupedUsers.objects.get(user=element, group=gid)
                    r.delete()
                for element in added:
                    obj = GroupedUsers()
                    obj.group_id = gid
                    obj.user_id = element
                    obj.save()
                record.totalUsers = request.POST['totalusers']
            record.groupName = request.POST['groupname']
            record.save()
            return render(request, "usergroups.html", context={ "header": "Users & Groups", "user_data": Targets.objects.all(), "group_data": UserGroups.objects.all() })
        return redirect("/usergroups")


def modUsersTable(table):
    data = []
    for record in table:
        fullname = record.firstName + " " + record.lastName
        record_dict = { "id": record.id, "fullname": fullname, "position": record.position }
        data.append(record_dict)
    return data


def getUsersA(request):
    if request.session.has_key('id'):
        id = request.session['id']
        users_table = Targets.objects.all()
        mod_users = modUsersTable(users_table)
        return HttpResponse(json.dumps(mod_users))


def getCurrentUsers(qset):
    current = []
    for q in qset:
        current.append(q.user_id)
    return current


def getUsersE(request, gid):
    if request.session.has_key('id'):
        id = request.session['id']
        users_table = Targets.objects.all()
        mod_users = modUsersTable(users_table)
        queryset = GroupedUsers.objects.filter(group=gid)
        if queryset.exists():
            current_users = getCurrentUsers(queryset)
            data = [current_users, mod_users]
            return HttpResponse(json.dumps(data))
        return redirect("/usergroups")


def deleteUser(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if request.method == "POST":
            queryset = Targets.objects.filter(email=request.POST['email'])
            if queryset.exists():
                record = Targets.objects.get(email=request.POST['email'])
                record.delete()
            return render(request, "usergroups.html", context={ "header": "Users & Groups", "user_data": Targets.objects.all(), "group_data": UserGroups.objects.all() })
        return redirect("/usergroups")


def deleteGroup(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if request.method == "POST":
            queryset = GroupedUsers.objects.filter(group=request.POST['gid'])
            if queryset.exists():
                queryset.delete()
            UserGroups.objects.get(groupId=request.POST['gid']).delete()
            return render(request, "usergroups.html", context={ "header": "Users & Groups", "user_data": Targets.objects.all(), "group_data": UserGroups.objects.all() })
        return redirect("/usergroups")


def emailtemp(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method=="GET"):
            return render(request, "emailtemp.html", context = { "header": "Email Templates" })
        elif(request.method=="POST"):
            tempname=request.POST['tempname']
            subject = request.POST['subject']
            emailtext = request.POST['emailtext']
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
        return redirect("dashboard")
    else:
        messages.info(request, 'Invalid Credentials')
        return redirect("login")


def logoutfunc(request):
    logout(request)
    messages.info(request, 'LOG OUT')
    return redirect("login")
