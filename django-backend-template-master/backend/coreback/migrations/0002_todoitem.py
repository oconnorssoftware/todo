# Generated by Django 2.2 on 2019-04-12 02:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('coreback', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TodoItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField(blank=True, max_length=500)),
                ('Profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='coreback.Profile')),
            ],
        ),
    ]
