from django.db import models
from django.contrib.auth.models import User


class EmailTemp(models.Model):
    tempId = models.AutoField(primary_key=True)
    userId = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    tempName = models.CharField(max_length=50, unique=True)
    subject = models.CharField(max_length=50)
    text_html = models.TextField()


class Campaign(models.Model):
    campId = models.AutoField(primary_key=True)
    userId = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')


class Targets(models.Model):
    id = models.AutoField(primary_key=True)
    firstName=models.CharField(max_length=50)
    lastName=models.CharField(max_length=50)
    email=models.CharField(max_length=100, unique=True)
    position = models.CharField(max_length=50)



class UserGroups(models.Model):
    groupId = models.AutoField(primary_key=True)
    groupName = models.CharField(max_length=50, unique=True)
    totalUsers = models.IntegerField(default=0)
    users = models.ManyToManyField(Targets, through='GroupedUsers')
    #userId = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')

class GroupedUsers(models.Model):
    class Meta:
        unique_together = (('user', 'group'),) 
    user = models.ForeignKey(Targets, on_delete=models.CASCADE)
    group = models.ForeignKey(UserGroups, on_delete=models.CASCADE)


class LandingPage(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20, unique=True)
    content = models.TextField()
    userId = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')


class SendingProfile(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    _from = models.EmailField(max_length=100, db_column='from')
    host = models.GenericIPAddressField(protocol='both', unpack_ipv4=False)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=512)
    userId = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
