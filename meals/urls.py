from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, SubCategoryViewSet, MealViewSet, MealHistoryViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubCategoryViewSet)
router.register(r'meals', MealViewSet)
router.register(r"meal-histories", MealHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/', include(router.urls)),
]
