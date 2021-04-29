from django.conf.urls import url
from django.urls import path
from django.views.generic import RedirectView

from mainapp import views
from mainapp.views import BoardsView, BoardsRetrieveView, TaskColumnView, TaskColumnRetrieveView, TaskView, \
    TaskRetrieveView

urlpatterns = [
    path('', RedirectView.as_view(url='/board_list', permanent=True), name='index'),
    path('board_list', views.boards_list, name='boards_list'),
    path('board/<uuid:pk>', views.board, name='board'),
    path('board_api', BoardsView.as_view(), name='boards_list_api'),
    path('board_api/<uuid:pk>', BoardsRetrieveView.as_view(), name='boards_retrieve_api'),
    path('task_column_api', TaskColumnView.as_view(), name='task_column_api'),
    path('task_column_api/<uuid:pk>', TaskColumnRetrieveView.as_view(), name='task_column_retrieve_api'),
    path('task_api', TaskView.as_view(), name='task_list_api'),
    path('task_api/<uuid:pk>', TaskRetrieveView.as_view(), name='task_retrieve_api'),
]