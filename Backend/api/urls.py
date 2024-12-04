from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ItemViewSet,
    AroAddressViewSet,
    AroBookingViewSet,
    AroInvoiceViewSet,
    AroPortViewSet,
    AroRestaurantsViewSet,
    AroTripViewSet,
    AroEntertainmentsViewSet,
    AroPackagesViewSet,
    AroPaymentsViewSet,
    AroRoomsViewSet,
    AroPassengerViewSet,
    EntertainmentTripViewSet,
    PassengerPackageViewSet,
    PassengerTripViewSet,
    RestaurantsTripViewSet,
    RoomTripViewSet,
    TripPortViewSet
)

# Create a router and register ViewSets
router = DefaultRouter()

# Register Model ViewSets
router.register(r'items', ItemViewSet)
router.register(r'addresses', AroAddressViewSet)
router.register(r'bookings', AroBookingViewSet)
router.register(r'invoices', AroInvoiceViewSet)
router.register(r'ports', AroPortViewSet)
router.register(r'restaurants', AroRestaurantsViewSet)
router.register(r'trips', AroTripViewSet)
router.register(r'entertainments', AroEntertainmentsViewSet)
router.register(r'packages', AroPackagesViewSet)
router.register(r'payments', AroPaymentsViewSet)
router.register(r'rooms', AroRoomsViewSet)
router.register(r'passengers', AroPassengerViewSet)

# Register Relationship ViewSets
router.register(r'entertainment-trips', EntertainmentTripViewSet)
router.register(r'passenger-packages', PassengerPackageViewSet)
router.register(r'passenger-trips', PassengerTripViewSet)
router.register(r'restaurants-trips', RestaurantsTripViewSet)
router.register(r'room-trips', RoomTripViewSet)
router.register(r'trip-ports', TripPortViewSet)

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Optional: Add custom action routes if needed
    # Example:
    # path('passengers/search/', AroPassengerViewSet.as_view({'get': 'search'}), name='passenger-search'),
] 