# Generated by Django 3.0.3 on 2020-02-24 20:36

import colorfield.fields
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Color',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('color', colorfield.fields.ColorField(default='#FFFFFF', max_length=18)),
            ],
        ),
        migrations.AddField(
            model_name='task',
            name='priority',
            field=models.IntegerField(default=5, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(10)]),
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=30, null=True)),
                ('color', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mainapp.Color')),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mainapp.Task')),
            ],
        ),
    ]
