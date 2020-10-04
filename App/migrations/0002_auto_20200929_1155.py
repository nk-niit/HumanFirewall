# Generated by Django 3.1.1 on 2020-09-29 06:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('App', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='targets',
            name='userId',
        ),
        migrations.AddField(
            model_name='targets',
            name='userGroupId',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='App.usergroups'),
        ),
    ]