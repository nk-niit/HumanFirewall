from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, logout
from django.contrib import messages
from django.contrib.auth.models import User
from django.core.mail import get_connection, send_mail
from django.core.mail import EmailMultiAlternatives
from .models import LandingPage, SendingProfile, Targets, UserGroups, GroupedUsers, EmailTemp, CampaignResults, Campaign
from PIL import Image
import json, uuid, os

def dashboard(request):
    if request.session.has_key('id'):
        id = request.session['id']
        return render(request, "dashboard.html", context={ "title": "Dashboard - Human Firewall", "header": "Dashboard","data": CampaignResults.objects.all() })
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")

def runcampaign(targets,sendprofile,emaildata, campname):
    my_host = sendprofile[1].split(':')[0]
    my_port = int(sendprofile[1].split(':')[1])
    my_username = sendprofile[2]
    my_password = sendprofile[3]
    my_use_tls = True
    connection = get_connection(host=my_host,
                                port=my_port,
                                username=my_username,
                                password=my_password,
                                use_tls=my_use_tls)
    for key,value in targets.items():
        subject, from_email, to = emaildata[0], sendprofile[0], value
        text_content = 'Random'
        randomise = uuid.uuid4().hex
        imageurl = '<img src = "http://firewallapp.herokuapp.com/image_load/'+randomise+'" width="0px" height="0px"/>'
        splitbodypart = emaildata[1].split('</body>')
        bodypart = splitbodypart[0]+imageurl+"</body>"+splitbodypart[1]
        print(bodypart)
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to], connection=connection)
        msg.attach_alternative(bodypart, "text/html")
        msg.send()
        campn = Campaign.objects.get(campaignName=campname)
        objcampresult = CampaignResults()
        objcampresult.campaign_id = campn.campId
        objcampresult.user_id = key
        objcampresult.image_id = randomise
        objcampresult.save()

def campaign(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method == "POST"):
            campaign_name = request.POST['campname']
            email_template = request.POST['emailtemp']
            landing_page = request.POST['landpage']
            sending_profile = request.POST['sendprofile']
            group = request.POST['group']
            objug = UserGroups.objects.get(groupName=group)
            objgu = GroupedUsers.objects.filter(group_id=objug.groupId)
            targetsemail = {}
            for i in objgu:
                objt = Targets.objects.get(id=i.user_id)
                targetsemail[objt.id] = objt.email
            print(targetsemail)
            objs = SendingProfile.objects.get(name = sending_profile)
            profile = [objs._from,objs.host,objs.username,objs.password]

            obje = EmailTemp.objects.get(tempName = email_template)
            emaildata = [obje.subject,obje.text_html]

            objl = LandingPage.objects.get(name=landing_page)
            campaign_obj = Campaign()
            campaign_obj.campaignName = campaign_name
            campaign_obj.emailTemplate = obje.tempId
            campaign_obj.landingPage = objl.id
            campaign_obj.sendingProfile = objs.id
            campaign_obj.group = objug.groupId
            campaign_obj.userId_id = id
            campaign_obj.save()

            runcampaign(targetsemail,profile,emaildata, campaign_name)

            return render(request, "dashboard.html", context={"title": "Campaigns - Human Firewall", "header": "Dashboard"})
        return render(request, "campaign.html", context={"title": "Campaigns - Human Firewall", "emailtemp":EmailTemp.objects.filter(userId_id=id),"landing":LandingPage.objects.filter(userId_id=id),"sending":SendingProfile.objects.filter(userId_id=id) ,"header": "Campaigns","group_data": UserGroups.objects.filter(userId=id) })
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")

def usergroups(request):
    if request.session.has_key('id'):
        id = request.session['id']
        return render(request, "usergroups.html", context={ "title": "Users & Groups - Human Firewall", "header": "Users & Groups", "user_data": Targets.objects.filter(userId=id), "group_data": UserGroups.objects.filter(userId=id) })
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
            obj.userId_id = id
            obj.save()
            return render(request, "usergroups.html", context={ "title": "Users & Groups - Human Firewall", "header": "Users & Groups", "user_data": Targets.objects.filter(userId=id), "group_data": UserGroups.objects.filter(userId=id) })
        return redirect("/usergroups")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def addGroup(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if request.method == "POST":
            obj1 = UserGroups()
            obj1.groupName = request.POST['groupname']
            obj1.totalUsers = int(request.POST['totalusers'])
            obj1.userId_id = id
            obj1.save()
            record = UserGroups.objects.get(groupName=request.POST['groupname'])
            all_users = request.POST['users']
            if all_users != "":
                for u in all_users.split(","):
                    obj2 = GroupedUsers()
                    obj2.group_id = record.groupId
                    obj2.user_id = int(u)
                    obj2.save()
            return render(request, "usergroups.html", context={ "title": "Users & Groups - Human Firewall", "header": "Users & Groups", "user_data": Targets.objects.filter(userId=id), "group_data": UserGroups.objects.filter(userId=id) })
        return redirect("/usergroups")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


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
                record.userId_id = id
                record.save()
                return render(request, "usergroups.html", context={ "title": "Users & Groups - Human Firewall", "header": "Users & Groups", "user_data": Targets.objects.filter(userId=id), "group_data": UserGroups.objects.filter(userId=id) })
            else:
                addUser(request)
        return redirect("/usergroups")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


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
            record.userId_id = id
            record.save()
            return render(request, "usergroups.html", context={ "title": "Users & Groups - Human Firewall", "header": "Users & Groups", "user_data": Targets.objects.filter(userId=id), "group_data": UserGroups.objects.filter(userId=id) })
        return redirect("/usergroups")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


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
        users_table = Targets.objects.filter(userId=id)
        mod_users = modUsersTable(users_table)
        return HttpResponse(json.dumps(mod_users))
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def getCurrentUsers(qset):
    current = []
    for q in qset:
        current.append(q.user_id)
    return current


def getUsersE(request, gid):
    if request.session.has_key('id'):
        id = request.session['id']
        users_table = Targets.objects.filter(userId=id)
        mod_users = modUsersTable(users_table)
        queryset = GroupedUsers.objects.filter(group=gid)
        if queryset.exists():
            current_users = getCurrentUsers(queryset)
            data = [current_users, mod_users]
            return HttpResponse(json.dumps(data))
        return redirect("/usergroups")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def deleteUser(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if request.method == "POST":
            queryset = Targets.objects.filter(email=request.POST['email'])
            if queryset.exists():
                record = Targets.objects.get(email=request.POST['email'])
                record.delete()
            return render(request, "usergroups.html", context={ "title": "Users & Groups - Human Firewall", "header": "Users & Groups", "user_data": Targets.objects.filter(userId=id), "group_data": UserGroups.objects.filter(userId=id) })
        return redirect("/usergroups")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def deleteGroup(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if request.method == "POST":
            queryset = GroupedUsers.objects.filter(group=request.POST['gid'])
            if queryset.exists():
                queryset.delete()
            UserGroups.objects.get(groupId=request.POST['gid']).delete()
            return render(request, "usergroups.html", context={ "title": "Users & Groups - Human Firewall", "header": "Users & Groups", "user_data": Targets.objects.filter(userId=id), "group_data": UserGroups.objects.filter(userId=id) })
        return redirect("/usergroups")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def emailtemp(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method=="GET"):
            return render(request, "emailtemp.html", context = { "title": "Email Templates - Human Firewall", "header": "Email Templates" })
        elif(request.method=="POST"):
            obj = EmailTemp()
            obj.tempName=request.POST['tempname']
            obj.subject = request.POST['subject']
            obj.text_html = request.POST['emailtext']
            obj.userId_id = id
            obj.save()
            return redirect('/emailtemp')
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
        return render(request, "sendingprofile.html", context = { "title": "Sending Profiles - Human Firewall", "header": "Sending Profiles" })
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def landingpage(request):
    if request.session.has_key('id'):
        id = request.session['id']       
        return render(request, "landingpage.html", context = { "title": "Landing Pages - Human Firewall", "header": "Landing Pages", "data": LandingPage.objects.filter(userId=id) })
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def createFile(op, filename, content):
    filename = filename + ".html"
    current_dir = os.path.dirname(__file__)
    relative_path = "../static/landingpages/" + filename
    filepath =  os.path.join(current_dir, relative_path)
    f = open(filepath, op, encoding="utf-8")
    f.write(content)
    f.close()

def readFile(filename):
    filename = filename + ".html"
    current_dir = os.path.dirname(__file__)
    relative_path = "../static/landingpages/" + filename
    filepath = os.path.join(current_dir, relative_path)
    f = open(filepath, "r", encoding="utf-8")
    data = f.read()
    f.close()
    return data


def deleteFile(filename):
    filename = filename + ".html"
    current_dir = os.path.dirname(__file__)
    relative_path = "../static/landingpages/" + filename
    filepath = os.path.join(current_dir, relative_path)
    if os.path.exists(filepath):
        os.remove(filepath)


def addPage(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if request.method == "POST":
            obj = LandingPage()
            fname = uuid.uuid4().hex
            createFile("w+", fname, request.POST['content'])
            obj.name = request.POST['pagename']
            obj.filename = fname
            obj.userId_id = id
            obj.save()
            return render(request, "landingpage.html", context = { "title": "Landing Pages - Human Firewall", "header": "Landing Pages", "data": LandingPage.objects.filter(userId=id) })
        return redirect("/landingpage")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def getPageDetails(request, pid):
    if request.session.has_key('id'):
        id = request.session['id']
        record = LandingPage.objects.get(id=pid)
        content = readFile(record.filename)
        pagedetails = [record.name, record.filename, content]
        return HttpResponse(json.dumps(pagedetails))
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def editPage(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if request.method == "POST":
            pid = request.POST['pid']
            queryset = LandingPage.objects.filter(id=pid)
            if queryset.exists():
                record = LandingPage.objects.get(id=pid)
                createFile("w", record.filename, request.POST['content'])
                record.name = request.POST['pagename']
                record.userId_id = id
                record.save()
                return render(request, "landingpage.html", context = { "title": "Landing Pages - Human Firewall", "header": "Landing Pages", "data": LandingPage.objects.filter(userId=id) })
        return redirect("/landingpage")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def deletePage(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if request.method == "POST":
            pid  = request.POST['pid']
            queryset = LandingPage.objects.filter(id=pid)
            if queryset.exists():
                record = LandingPage.objects.get(id=pid)
                deleteFile(record.filename)
                record.delete()
                return render(request, "landingpage.html", context = { "title": "Landing Pages - Human Firewall", "header": "Landing Pages", "data": LandingPage.objects.filter(userId=id) })
        return redirect("/landingpage")
    else:
        messages.info(request, 'Kindly Login To Continue')
        return redirect("login")


def accountsettings(request):
    if request.session.has_key('id'):
        id = request.session['id']
        if (request.method == "GET"):
            return render(request, "accountsettings.html", context = { "title": "Account Settings - Human Firewall", "header": "Account Settings" })
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


def image_load(request,iid):
    ida = CampaignResults.objects.get(image_id = iid)
    ida.userEmailStatus = True
    ida.save()
    print("Image Loaded and Database updated")
    red = Image.new('RGB', (1, 1))
    response = HttpResponse(content_type="image/png")
    red.save(response, "PNG")
    return response