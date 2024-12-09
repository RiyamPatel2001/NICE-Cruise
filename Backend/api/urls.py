from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DetailedTripViewSet,
    AroTripViewSet,
    TripBookingViewSet,
    PassengerViewSet,
    user_booked_trips,
    BookingPaymentViewSet,
)

# Create a router and register ViewSets
router = DefaultRouter()

# Register ViewSets
router.register(r'trips', AroTripViewSet)
router.register(r'detailed-trips', DetailedTripViewSet, basename='detailed-trip')
router.register(r'trip-booking', TripBookingViewSet, basename='trip-booking')
router.register(r'passengers', PassengerViewSet, basename='passengers')
router.register(r'booking-payment', BookingPaymentViewSet, basename='booking-payment')

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    path('user-booked-trips/', user_booked_trips, name='user-booked-trips'),
] 
