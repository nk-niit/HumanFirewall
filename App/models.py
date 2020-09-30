from django.db import models
from django.contrib.auth.models import User

class emailtemp(models.Model):
    tempId = models.AutoField(primary_key=True)
    userId = models.ForeignKey(User, on_delete=models.CASCADE)
    tempName = models.CharField(max_length=5000)
    subject = models.CharField(max_length=5000)
    text_html = models.TextField()

class campaign(models.Model):
    campId = models.AutoField(primary_key=True)
    userId = models.ForeignKey(User, on_delete=models.CASCADE)

class usergroups(models.Model):
    usergroupId = models.AutoField(primary_key=True)
    groupName = models.CharField(max_length=5000)
    userId = models.ForeignKey(User, on_delete=models.CASCADE)

class targets(models.Model):
    id = models.AutoField(primary_key=True)
    firstName=models.CharField(max_length=5000)
    lastName=models.CharField(max_length=5000)
    email=models.CharField(max_length=5000)
    position = models.CharField(max_length=5000)
    userGroupId = models.ForeignKey(usergroups, on_delete=models.CASCADE, default=None)

class LandingPage(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    content = models.TextField()
    userId = models.ForeignKey(User, on_delete=models.CASCADE)

class SendingProfile(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    _from = models.EmailField(max_length=100, db_column='from')
    host = models.GenericIPAddressField(protocol='both', unpack_ipv4=False)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=512)
    userId = models.ForeignKey(User, on_delete=models.CASCADE)
