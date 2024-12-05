from rest_framework import serializers
from .models import (
    Item, 
    AroAddress,
    AroBooking,
    AroInvoice,
    AroPort,
    AroRestaurants,
    AroTrip,
    AroEntertainments,
    AroPassenger,
    AroPackages,
    AroPayments,
    AroRooms,
    EntertainmentTrip,
    PassengerPackage,
    PassengerTrip,
    RestaurantsTrip,
    RoomTrip,
    TripPort,
)
from django.contrib.auth.models import User

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__' 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__' 

class AroAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = AroAddress
        fields = '__all__' 

class AroBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AroBooking
        fields = '__all__' 

class AroInvoiceSerializer(serializers.ModelSerializer):
    booking = AroBookingSerializer(source='booking_id')
    class Meta:
        model = AroInvoice
        fields = '__all__' 

class AroPortSerializer(serializers.ModelSerializer):
    address = AroAddressSerializer(source='address_id')
    class Meta:
        model = AroPort
        fields = '__all__' 

class AroRestaurantsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AroRestaurants
        fields = '__all__' 

class AroTripSerializer(serializers.ModelSerializer):
    class Meta:
        model = AroTrip
        fields = '__all__' 

class AroEntertainmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AroEntertainments
        fields = '__all__' 

class AroPackagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AroPackages
        fields = '__all__' 

class AroPaymentsSerializer(serializers.ModelSerializer):
    invoice = AroInvoiceSerializer(source='invoice_id')
    class Meta:
        model = AroPayments
        fields = '__all__' 

class AroRoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AroRooms
        fields = '__all__' 

class AroPassengerSerializer(serializers.ModelSerializer):
    address = AroAddressSerializer(source='address_id')
    room = AroRoomsSerializer(source='room_number')
    user = UserSerializer(source='user_id')
    class Meta:
        model = AroPassenger
        fields = '__all__' 

class EntertainmentTripSerializer(serializers.ModelSerializer):
    entertainment = AroEntertainmentsSerializer(source='entertainment_id')
    trip = AroTripSerializer(source='trip_id')
    class Meta:
        model = EntertainmentTrip
        fields = '__all__' 

class PassengerPackageSerializer(serializers.ModelSerializer):
    package = AroPackagesSerializer(source='package_id')
    passenger = AroPassengerSerializer()
    class Meta:
        model = PassengerPackage
        fields = '__all__' 

class PassengerTripSerializer(serializers.ModelSerializer):
    trip = AroTripSerializer(source='trip_id')
    passenger = AroPassengerSerializer()
    class Meta:
        model = PassengerTrip
        fields = '__all__' 

class RestaurantsTripSerializer(serializers.ModelSerializer):
    restaurant = AroRestaurantsSerializer(source='restaurant_id')
    trip = AroTripSerializer(source='trip_id')
    class Meta:
        model = RestaurantsTrip
        fields = '__all__' 

class RoomTripSerializer(serializers.ModelSerializer):
    room = AroRoomsSerializer(source='room_number')
    trip = AroTripSerializer(source='trip_id')
    class Meta:
        model = RoomTrip
        fields = '__all__' 

class TripPortSerializer(serializers.ModelSerializer):
    port = AroPortSerializer(source='port_id')
    trip = AroTripSerializer(source='trip_id')
    class Meta:
        model = TripPort
        fields = '__all__' 


class DetailedTripSerializer(serializers.ModelSerializer):
    # Related data for comprehensive trip information
    available_rooms = serializers.SerializerMethodField()
    available_packages = serializers.SerializerMethodField()
    entertainments = serializers.SerializerMethodField()
    restaurants = serializers.SerializerMethodField()
    ports = serializers.SerializerMethodField()

    class Meta:
        model = AroTrip
        fields = '__all__'  # Include all trip fields
        extra_fields = [
            'available_rooms', 
            'available_packages', 
            'entertainments', 
            'restaurants', 
            'ports'
        ]

    def get_available_rooms(self, trip):
        # Optimize room retrieval with select_related
        room_trips = (
            RoomTrip.objects.filter(trip_id=trip)
            .select_related('room')  # Optimize database query
        )
        return RoomTripSerializer(room_trips, many=True).data

    def get_available_packages(self, trip):
        # Get all packages, potentially filter in the future
        return AroPackagesSerializer(
            AroPackages.objects.all(), 
            many=True
        ).data

    def get_entertainments(self, trip):
        # Optimize entertainment retrieval
        entertainment_trips = (
            EntertainmentTrip.objects.filter(trip_id=trip)
            .select_related('entertainment_id')
        )
        return EntertainmentTripSerializer(
            entertainment_trips, 
            many=True
        ).data

    def get_restaurants(self, trip):
        # Optimize restaurant retrieval
        restaurants_trips = (
            RestaurantsTrip.objects.filter(trip_id=trip)
            .select_related('restaurant_id')
        )
        return RestaurantsTripSerializer(
            restaurants_trips, 
            many=True
        ).data

    def get_ports(self, trip):
        # Optimize port retrieval
        trip_ports = (
            TripPort.objects.filter(trip_id=trip)
            .select_related('port_id', 'port_id__address_id')
        )
        return TripPortSerializer(
            trip_ports, 
            many=True
        ).data
