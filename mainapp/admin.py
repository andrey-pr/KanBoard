from django.contrib import admin

# Register your models here.
from mainapp.models import *

admin.site.register(Color)
admin.site.register(Board)
admin.site.register(TaskColumn)
admin.site.register(Task)
admin.site.register(Label)