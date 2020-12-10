# Generated by Django 3.1.2 on 2020-12-10 11:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('App', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='sendingprofile',
            old_name='_from',
            new_name='email_from',
        ),
        migrations.AddField(
            model_name='campaignresults',
            name='userCredStatus',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='campaignresults',
            name='userEmailStatus',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='campaignresults',
            name='userClickStatus',
            field=models.BooleanField(default=False),
        ),
    ]