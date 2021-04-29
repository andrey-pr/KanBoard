import uuid

from django.contrib.auth.models import User
from django.db import models


class Color(models.Model):
    color = models.CharField(max_length=7)
    title = models.CharField(max_length=30)


class Board(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=90)
    description = models.CharField(max_length=1000, null=True, blank=True)


class TaskColumn(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    name = models.CharField(max_length=90)


class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    column = models.ForeignKey(TaskColumn, on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    description = models.CharField(max_length=1000, null=True)


class Label(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    color = models.ForeignKey(Color, on_delete=models.CASCADE)
    text = models.CharField(max_length=30, null=True)
