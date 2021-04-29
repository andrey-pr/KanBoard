from rest_framework import serializers

from mainapp.models import Board, TaskColumn, Task, Label


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ('id', 'name', 'description')


class TaskColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskColumn
        fields = ('id', 'board', 'name')


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['color', 'text']


class TaskSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(many=True, required=False)

    class Meta:
        model = Task
        fields = ('id', 'column', 'title', 'description', 'labels') #, 'label__text'