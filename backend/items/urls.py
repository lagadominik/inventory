from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, LocationViewSet, ChangeLogViewSet

# Router automatycznie tworzy wszystkie URL-e dla ViewSet
router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'changelog', ChangeLogViewSet)

urlpatterns = router.urls