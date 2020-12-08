from django.db import models
from django.contrib.auth.models import User


class TimeStampMixin(models.Model):
    class Meta:
        abstract = True
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)


class Targets(TimeStampMixin):
    id = models.AutoField(primary_key=True)
    firstName=models.CharField(max_length=50)
    lastName=models.CharField(max_length=50)
    email=models.CharField(max_length=100, unique=True)
    position = models.CharField(max_length=50)
    userId = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')


class Campaign(TimeStampMixin):
    campId = models.AutoField(primary_key=True)
    campaignName = models.CharField(max_length=50)
    emailTemplate = models.IntegerField()
    landingPage = models.IntegerField()
    sendingProfile = models.IntegerField()
    group = models.IntegerField()
    users = models.ManyToManyField(Targets, through='CampaignResults')
    userId = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')


class CampaignResults(TimeStampMixin):
    class Meta:
        unique_together = (('campaign', 'user'),)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    user = models.ForeignKey(Targets, on_delete=models.CASCADE)
    userClickStatus = models.BooleanField(default=False)
    userEmailStatus = models.BooleanField(default=False)
    image_id = models.CharField(max_length=50, unique=True)

class UserGroups(TimeStampMixin):
    groupId = models.AutoField(primary_key=True)
    groupName = models.CharField(max_length=50, unique=True)
    totalUsers = models.IntegerField(default=0)
    users = models.ManyToManyField(Targets, through='GroupedUsers')
    userId = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')

class GroupedUsers(TimeStampMixin):
    class Meta:
        unique_together = (('user', 'group'),) 
    user = models.ForeignKey(Targets, on_delete=models.CASCADE)
    group = models.ForeignKey(UserGroups, on_delete=models.CASCADE)


class EmailTemp(TimeStampMixin):
    tempId = models.AutoField(primary_key=True)
    userId = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    tempName = models.CharField(max_length=50, unique=True)
    subject = models.CharField(max_length=50)
    text_html = models.TextField()


class LandingPage(TimeStampMixin):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    filename = models.CharField(max_length=50, unique=True)
    userId = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')


class SendingProfile(TimeStampMixin):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    _from = models.EmailField(max_length=100, db_column='from')
    host = models.CharField(max_length=100)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=512)
    userId = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
