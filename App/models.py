from django.db import models

# Create your models here.
# OVI --------------------------------------------------------------











# Navneeth ------------------------------------------------------------

class LandingPage(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    content = models.TextField()
    #user_id = models.ForeignKey('', on_delete=models.CASCADE)


class SendingProfile(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    _from = models.EmailField(max_length=100, db_column='from')
    host = models.GenericIPAddressField(protocol='both', unpack_ipv4=False)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=512)
    #user_id = models.ForeignKey('', on_delete=models.CASCADE)
