from django.contrib import admin
from django.urls import path, include
from users.views import me

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('api/', include('items.urls')),
    path('api/me/', me),
]