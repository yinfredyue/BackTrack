# Generated by Django 2.2.7 on 2019-11-25 03:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0005_auto_20191124_0954'),
        ('user', '0002_auto_20191124_1503'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='projects',
            field=models.ManyToManyField(related_name='users', to='product.Project'),
        ),
    ]
