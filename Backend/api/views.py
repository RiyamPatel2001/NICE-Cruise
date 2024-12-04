from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Item
from .serializers import ItemSerializer
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import (
    Item,
    AroAddress,
    AroBooking,
    AroInvoice,
    AroPort,
    AroRestaurants,
    AroTrip,
    AroEntertainments,
    AroPackages,
    AroPayments,
    AroRooms,
    AroPassenger,
    EntertainmentTrip,
    PassengerPackage,
    PassengerTrip,
    RestaurantsTrip,
    RoomTrip,
    TripPort,
)

from .serializers import (
    ItemSerializer,
    AroAddressSerializer,
    AroBookingSerializer,
    AroInvoiceSerializer,
    AroPortSerializer,
    AroRestaurantsSerializer,
    AroTripSerializer,
    AroEntertainmentsSerializer,
    AroPackagesSerializer,
    AroPaymentsSerializer,
    AroRoomsSerializer,
    AroPassengerSerializer,
    EntertainmentTripSerializer,
    PassengerPackageSerializer,
    PassengerTripSerializer,
    RestaurantsTripSerializer,
    RoomTripSerializer,
    TripPortSerializer,
)

# Create your views here.

class ItemListView(APIView):
    def get(self, request):
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

# Base ViewSet with common functionality
class BaseModelViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet providing default CRUD operations with optional permissions.
    """
    permission_classes = [permissions.IsAuthenticated]  # Default authentication

    @action(detail=False, methods=['GET'])
    def count(self, request):
        """
        Custom action to return the total count of objects.
        """
        count = self.get_queryset().count()
        return Response({'count': count})

# Item ViewSet
class ItemViewSet(BaseModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.AllowAny]  # Open access for items

# Address ViewSet
class AroAddressViewSet(BaseModelViewSet):
    queryset = AroAddress.objects.all()
    serializer_class = AroAddressSerializer

    @action(detail=True, methods=['GET'])
    def passengers(self, request, pk=None):
        """
        Get all passengers for a specific address.
        """
        address = self.get_object()
        passengers = AroPassenger.objects.filter(address_id=address)
        serializer = AroPassengerSerializer(passengers, many=True)
        return Response(serializer.data)

# Passenger ViewSet
class AroPassengerViewSet(BaseModelViewSet):
    queryset = AroPassenger.objects.all()
    serializer_class = AroPassengerSerializer

    def get_queryset(self):
        """
        Optionally filter passengers by query parameters.
        """
        queryset = AroPassenger.objects.all()
        group_id = self.request.query_params.get('group_id')
        if group_id is not None:
            queryset = queryset.filter(group_id=group_id)
        return queryset

    @action(detail=True, methods=['GET'])
    def bookings(self, request, pk=None):
        """
        Get all bookings for a specific passenger.
        """
        passenger = self.get_object()
        bookings = AroBooking.objects.filter(passenger_id=passenger.passenger_id)
        serializer = AroBookingSerializer(bookings, many=True)
        return Response(serializer.data)

# Booking ViewSet
class AroBookingViewSet(BaseModelViewSet):
    queryset = AroBooking.objects.all()
    serializer_class = AroBookingSerializer

    @action(detail=True, methods=['GET'])
    def invoice(self, request, pk=None):
        """
        Get the invoice for a specific booking.
        """
        booking = self.get_object()
        invoice = AroInvoice.objects.filter(booking_id=booking).first()
        if invoice:
            serializer = AroInvoiceSerializer(invoice)
            return Response(serializer.data)
        return Response({'detail': 'No invoice found for this booking.'}, status=404)

# Trip ViewSet
class AroTripViewSet(BaseModelViewSet):
    queryset = AroTrip.objects.all()
    serializer_class = AroTripSerializer

    @action(detail=True, methods=['GET'])
    def passengers(self, request, pk=None):
        """
        Get all passengers for a specific trip.
        """
        trip = self.get_object()
        passenger_trips = PassengerTrip.objects.filter(trip_id=trip)
        passengers = [pt.passenger for pt in passenger_trips]
        serializer = AroPassengerSerializer(passengers, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def entertainments(self, request, pk=None):
        """
        Get all entertainments for a specific trip.
        """
        trip = self.get_object()
        entertainment_trips = EntertainmentTrip.objects.filter(trip_id=trip)
        entertainments = [et.entertainment for et in entertainment_trips]
        serializer = AroEntertainmentsSerializer(entertainments, many=True)
        return Response(serializer.data)

# Other ViewSets follow similar patterns
class AroInvoiceViewSet(BaseModelViewSet):
    queryset = AroInvoice.objects.all()
    serializer_class = AroInvoiceSerializer

class AroPortViewSet(BaseModelViewSet):
    queryset = AroPort.objects.all()
    serializer_class = AroPortSerializer

class AroRestaurantsViewSet(BaseModelViewSet):
    queryset = AroRestaurants.objects.all()
    serializer_class = AroRestaurantsSerializer

class AroEntertainmentsViewSet(BaseModelViewSet):
    queryset = AroEntertainments.objects.all()
    serializer_class = AroEntertainmentsSerializer

class AroPackagesViewSet(BaseModelViewSet):
    queryset = AroPackages.objects.all()
    serializer_class = AroPackagesSerializer

class AroPaymentsViewSet(BaseModelViewSet):
    queryset = AroPayments.objects.all()
    serializer_class = AroPaymentsSerializer

class AroRoomsViewSet(BaseModelViewSet):
    queryset = AroRooms.objects.all()
    serializer_class = AroRoomsSerializer

# Relationship ViewSets
class EntertainmentTripViewSet(BaseModelViewSet):
    queryset = EntertainmentTrip.objects.all()
    serializer_class = EntertainmentTripSerializer

class PassengerPackageViewSet(BaseModelViewSet):
    queryset = PassengerPackage.objects.all()
    serializer_class = PassengerPackageSerializer

class PassengerTripViewSet(BaseModelViewSet):
    queryset = PassengerTrip.objects.all()
    serializer_class = PassengerTripSerializer

class RestaurantsTripViewSet(BaseModelViewSet):
    queryset = RestaurantsTrip.objects.all()
    serializer_class = RestaurantsTripSerializer

class RoomTripViewSet(BaseModelViewSet):
    queryset = RoomTrip.objects.all()
    serializer_class = RoomTripSerializer

class TripPortViewSet(BaseModelViewSet):
    queryset = TripPort.objects.all()
    serializer_class = TripPortSerializer

    