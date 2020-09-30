# Generated by Django 3.1.1 on 2020-09-29 06:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='usergroups',
            fields=[
                ('usergroupId', models.AutoField(primary_key=True, serialize=False)),
                ('groupName', models.CharField(max_length=5000)),
                ('userId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='targets',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('firstName', models.CharField(max_length=5000)),
                ('lastName', models.CharField(max_length=5000)),
                ('email', models.CharField(max_length=5000)),
                ('position', models.CharField(max_length=5000)),
                ('userId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='emailtemp',
            fields=[
                ('tempId', models.AutoField(primary_key=True, serialize=False)),
                ('tempName', models.CharField(max_length=5000)),
                ('subject', models.CharField(max_length=5000)),
                ('text_html', models.TextField()),
                ('userId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='campaign',
            fields=[
                ('campId', models.AutoField(primary_key=True, serialize=False)),
                ('userId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
