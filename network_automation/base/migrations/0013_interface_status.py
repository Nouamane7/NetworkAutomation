# Generated by Django 4.2.3 on 2023-08-13 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0012_remove_interface_interface_neib_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='interface',
            name='status',
            field=models.CharField(default='down', max_length=10),
        ),
    ]
