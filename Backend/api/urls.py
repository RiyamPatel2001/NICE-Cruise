from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DetailedTripViewSet,
    AroTripViewSet,
    TripBookingViewSet,
    PassengerViewSet,
)

# Create a router and register ViewSets
router = DefaultRouter()

# Register ViewSets
router.register(r'trips', AroTripViewSet)
router.register(r'detailed-trips', DetailedTripViewSet, basename='detailed-trip')
router.register(r'trip-booking', TripBookingViewSet, basename='trip-booking')
router.register(r'passengers', PassengerViewSet, basename='passengers')

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
] 