# Generated by Django 3.0.3 on 2020-03-18 18:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0005_auto_20200318_1830'),
    ]

    operations = [
        migrations.AlterField(
            model_name='color',
            name='color',
            field=models.CharField(max_length=7),
        ),
    ]