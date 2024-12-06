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

# User Registration Serializer
class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'first_name', 'last_name']
        extra_kwargs = {
            'email': {'required': True}
        }

    def validate(self, data):
        """
        Password validation
        """
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        
        # Password complexity check
        if len(data['password']) < 8:
            raise serializers.ValidationError({"password": "Password must be at least 8 characters long"})
        
        return data

    def create(self, validated_data):
        """
        Create user with hashed password
        """
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user
    
# Passenger Address Serializer
class AddressSerializer(serializers.ModelSerializer):
    """
    Serializer for passenger address
    """
    class Meta:
        model = AroAddress
        fields = [
            'address_line1', 
            'address_line2', 
            'city', 
            'state', 
            'zip_code', 
            'country'
        ]

# Group Passenger Serializer
class PassengerGroupSerializer(serializers.Serializer):
    """
    Serializer for group booking details
    """
    total_passengers = serializers.IntegerField(min_value=1)
    adults = serializers.IntegerField(min_value=0)
    children = serializers.IntegerField(min_value=0)
    
    
    def validate(self, data):
        """
        Validate passenger count
        """
        total_passengers = data.get('total_passengers')
        adults = data.get('adults')
        children = data.get('children')
        
        if total_passengers != (adults + children):
            raise serializers.ValidationError("Total passengers must equal sum of adults and children")
        
        return data
    
# Passenger Details Serializer
class PassengerDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for individual passenger details
    """
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        required=False, 
        allow_null=True
    )
    address = AddressSerializer(write_only=True, required=False)
    room_number = serializers.SlugRelatedField(
        slug_field='room_number',
        queryset=AroRooms.objects.all(),
        required=True
    )

    class Meta:
        model = AroPassenger
        fields = [
            'group_id',
            'user_id',
            'fname', 
            'lname', 
            'gender', 
            'age', 
            'email', 
            'phone', 
            'nationality',
            'address', 
            'room_number',
        ]
        extra_kwargs = {
            'address_id': {'write_only': True},  # Hide address_id from output
            'group_id': {'write_only': True}
        }
        
    
    def validate_age(self, value):
        """
        Validate age for pricing
        """
        if value < 0 or value > 120:
            raise serializers.ValidationError("Invalid age")
        return value

    def create(self, validated_data):
        """
        Custom create method to handle address creation
        """
        # Extract address data if provided
        address_data = validated_data.pop('address', None)

        # Create address if address data is provided
        if address_data:
            address = AroAddress.objects.create(**address_data)
            validated_data['address'] = address
        else:
            raise serializers.ValidationError({"address": "Address data is required"})

        # Handle user assignment
        email = validated_data.get('email')
        request_user = self.context['request'].user
        user = None

        # Assign user if the email matches the logged-in user's email
        if email == request_user.email:
            user = request_user

        # Assign the User ID to 'user_id'
        validated_data['user_id'] = user.id if user else None

        
        # Room number is already converted to an `AroRooms` instance via `SlugRelatedField`
        return AroPassenger.objects.create(**validated_data)

    def validate(self, data):
        """
        Additional validation for passenger data
        """
        # Ensure required fields are present
        required_fields = [
            'group_id', 'fname', 'lname', 'gender', 
            'age', 'email', 'phone', 'nationality', 
            'room_number'
        ]
        
        for field in required_fields:
            if field not in data:
                raise serializers.ValidationError(f"{field} is required")
        
        return data