# Generated by Django 3.1.2 on 2020-12-11 12:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('App', '0004_auto_20201211_1420'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='campaign',
            name='totalCredsCaptured',
        ),
        migrations.RemoveField(
            model_name='campaign',
            name='totalEmailOpened',
        ),
        migrations.RemoveField(
            model_name='campaign',
            name='totalLinkOpened',
        ),
    ]
