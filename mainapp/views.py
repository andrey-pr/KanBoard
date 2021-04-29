from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, \
    RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from mainapp.models import Board, TaskColumn, Task
from mainapp.permissions import IsOwner, IsBoardOwner, IsTaskColumnOwner
from mainapp.serializers import BoardSerializer, TaskColumnSerializer, TaskSerializer


@login_required
def boards_list(request):
    boards = Board.objects.filter(owner=request.user)
    return render(
        request,
        'boards_list.html',
        context={'boards': boards}
    )


@login_required
def board(request, pk):
    board_data = Board.objects.get(id=pk)
    columns = TaskColumn.objects.filter(board_id=pk)
    return render(
        request,
        'board.html',
        context={'board': board_data,
                 'columns': columns}
    )


class BoardsView(ListAPIView, CreateAPIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    queryset = Board.objects.all()

    def filter_queryset(self, queryset):
        return Board.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        saved = serializer.save(owner=self.request.user)
        TaskColumn.objects.create(board=saved, name="To do")
        TaskColumn.objects.create(board=saved, name="In progress")
        TaskColumn.objects.create(board=saved, name="Done")
        return saved


class BoardsRetrieveView(RetrieveAPIView, UpdateAPIView, DestroyAPIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    queryset = Board.objects.all()


class TaskColumnView(ListAPIView, CreateAPIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    serializer_class = TaskColumnSerializer
    permission_classes = [IsAuthenticated, IsBoardOwner]
    queryset = TaskColumn.objects.all()

    def filter_queryset(self, queryset):
        return TaskColumn.objects.filter(board__owner=self.request.user,
                                         board__id=self.request.query_params.get('board'))


class TaskColumnRetrieveView(RetrieveAPIView, UpdateAPIView, DestroyAPIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    serializer_class = TaskColumnSerializer
    permission_classes = [IsAuthenticated, IsBoardOwner]
    queryset = TaskColumn.objects.all()


class TaskView(ListAPIView, CreateAPIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsTaskColumnOwner]
    queryset = Task.objects.all()

    def filter_queryset(self, queryset):
        return Task.objects.filter(column__board__owner=self.request.user, column__id=self.request.query_params.get('column'))


class TaskRetrieveView(RetrieveAPIView, UpdateAPIView, DestroyAPIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsTaskColumnOwner]
    queryset = Task.objects.all()