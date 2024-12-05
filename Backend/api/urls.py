from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DetailedTripViewSet,
    AroTripViewSet
)

# Create a router and register ViewSets
router = DefaultRouter()

# Register ViewSets
router.register(r'trips', AroTripViewSet)
router.register(r'detailed-trips', DetailedTripViewSet, basename='detailed-trip')

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
] 