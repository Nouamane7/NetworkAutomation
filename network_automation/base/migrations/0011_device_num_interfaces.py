# Generated by Django 4.2.3 on 2023-08-07 14:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0010_alter_interface_ip_address'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='num_interfaces',
            field=models.IntegerField(default=0),
        ),
    ]
