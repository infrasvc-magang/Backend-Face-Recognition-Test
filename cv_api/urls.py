from django.urls import path
from django.contrib import admin
from face_detector import views as v

urlpatterns = [
    path('', v.index, name='index'),
    path('cameraa', v.face, name='cameraa'),
    path('face_detection/detect/', v.detect, name='detection response'),
    path('admin/', admin.site.urls),
]
