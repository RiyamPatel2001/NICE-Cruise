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

