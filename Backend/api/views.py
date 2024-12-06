from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from .models import Item
from .serializers import ItemSerializer
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from django.core.cache import cache
from django.db.models import Prefetch, Q
from django.utils import timezone
from django.db import connection, transaction
import random
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from django.contrib.auth import get_user_model, authenticate
from .serializers import UserSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response



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
    DetailedTripSerializer,
    UserRegistrationSerializer, 
    PassengerGroupSerializer, 
    PassengerDetailSerializer
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
class AroTripViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Trip-related operations
    Provides comprehensive CRUD and custom actions for trips
    """
    queryset = AroTrip.objects.all()
    serializer_class = AroTripSerializer
    permission_classes = [AllowAny]  # Adjust as needed
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['start_date', 'start_port', 'end_port']
    ordering_fields = ['start_date', 'end_date']

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        """
        Optimized queryset with prefetched related data
        Reduces database queries and improves performance
        """

        return AroTrip.objects.all()

    def get_serializer_class(self):
        """
        Use different serializers based on the action
        """
        if self.action == 'retrieve':
            return DetailedTripSerializer
        return AroTripSerializer

    def list(self, request):
        """
        Advanced filtering for trips with multiple options
        """
        queryset = self.get_queryset()
        
        # Multiple filter options
        filters = {}
        
        # Date range filtering
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if start_date and end_date:
            filters['start_date__range'] = [start_date, end_date]
        
        # Port filtering
        start_port = request.query_params.get('start_port')
        end_port = request.query_params.get('end_port')
        if start_port:
            filters['start_port'] = start_port
        if end_port:
            filters['end_port'] = end_port
        
        # Passenger count filtering
        min_passengers = request.query_params.get('min_passengers')
        max_passengers = request.query_params.get('max_passengers')
        if min_passengers:
            filters['number_passengers__gte'] = min_passengers
        if max_passengers:
            filters['number_passengers__lte'] = max_passengers
        
        # Apply filters
        queryset = queryset.filter(**filters)
        
        # Sorting
        sort_by = request.query_params.get('sort', '-start_date')
        queryset = queryset.order_by(sort_by)
        
        # Pagination (if using default pagination)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a specific trip with caching
        """
        trip_id = kwargs.get('pk')
        cache_key = f'trip_details_{trip_id}'
        
        # Try to get from cache first
        cached_trip = cache.get(cache_key)
        if cached_trip:
            return Response(cached_trip)
        
        # If not in cache, fetch and cache
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        trip_data = serializer.data
        
        # Cache for 1 hour
        cache.set(cache_key, trip_data, timeout=3600)
        
        return Response(trip_data)

    @action(detail=True, methods=['GET'])
    def available_rooms(self, request, pk=None):
        """
        Get available rooms for this specific trip
        """
        trip = self.get_object()
        room_trips = RoomTrip.objects.filter(trip_id=trip)
        serializer = RoomTripSerializer(room_trips, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def trip_entertainment(self, request, pk=None):
        """
        Get entertainments for this specific trip
        """
        trip = self.get_object()
        entertainment_trips = EntertainmentTrip.objects.filter(trip_id=trip)
        serializer = EntertainmentTripSerializer(entertainment_trips, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def trip_restaurants(self, request, pk=None):
        """
        Get restaurants for this specific trip
        """
        trip = self.get_object()
        restaurants_trips = RestaurantsTrip.objects.filter(trip_id=trip)
        serializer = RestaurantsTripSerializer(restaurants_trips, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def trip_ports(self, request, pk=None):
        """
        Get ports for this specific trip
        """
        trip = self.get_object()
        trip_ports = TripPort.objects.filter(trip_id=trip)
        serializer = TripPortSerializer(trip_ports, many=True)
        return Response(serializer.data)

    def create(self, request):
        """
        Custom create method with additional validation
        """
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            
            # Additional custom validation
            start_date = serializer.validated_data.get('start_date')
            if start_date and start_date < timezone.now().date():
                return Response(
                    {'error': 'Trip start date cannot be in the past'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create the trip
            self.perform_create(serializer)
            
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED
            )
        
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        """
        Custom update method with additional validation
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, 
            data=request.data, 
            partial=partial
        )
        
        try:
            serializer.is_valid(raise_exception=True)
            
            # Additional custom validation
            start_date = serializer.validated_data.get('start_date', instance.start_date)
            if start_date < timezone.now().date():
                return Response(
                    {'error': 'Trip start date cannot be in the past'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update the trip
            self.perform_update(serializer)
            
            # Clear cache for this trip
            cache.delete(f'trip_details_{instance.id}')
            
            return Response(serializer.data)
        
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        """
        Custom destroy method with additional logic
        """
        instance = self.get_object()
        
        # Optional: Check if trip can be deleted
        if instance.start_date < timezone.now().date():
            return Response(
                {'error': 'Cannot delete past trips'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Clear cache
        cache.delete(f'trip_details_{instance.id}')
        
        # Perform deletion
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

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

    
class DetailedTripViewSet(BaseModelViewSet):
    queryset = AroTrip.objects.all()
    serializer_class = AroTripSerializer
    permission_classes = [AllowAny]

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve detailed information for a specific trip
        """
        try:
            # Get the specific trip
            instance = self.get_object()
            
            # Fetch related information
            trip_details = {
                # Basic trip information
                'trip_info': {
                    'trip_id': instance.trip_id,
                    'ship_name': instance.ship_name,
                    'start_date': instance.start_date,
                    'end_date': instance.end_date,
                    'start_port': instance.start_port,
                    'end_port': instance.end_port,
                    'number_passengers': instance.number_passengers,
                },
                
                # Rooms available for this trip
                'available_rooms': self.get_available_rooms(instance),
                
                # Packages offered
                'packages': self.get_available_packages(),
                
                # Entertainments
                'entertainments': self.get_entertainments(instance),
                
                # Restaurants
                'restaurants': self.get_restaurants(instance),
                
                # Ports
                'ports': self.get_ports(instance)
            }
            
            return Response(trip_details)
        
        except Exception as e:
            print(f"Error in retrieve method: {e}")
            return Response(
                {'error': 'Unable to retrieve trip details'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    @action(detail=True, methods=['GET'], url_path='rooms')
    def available_rooms(self, request, pk=None):
        """
        Get available rooms for this specific trip
        """
        trip = self.get_object()
        rooms = self.get_available_rooms(trip)
        return Response(rooms)

    @action(detail=True, methods=['GET'], url_path='packages')
    def packages(self, request, pk=None):
        """
        Get available packages
        """
        packages = self.get_available_packages()
        return Response(packages)

    @action(detail=True, methods=['GET'], url_path='entertainments')
    def entertainments(self, request, pk=None):
        """
        Get entertainments for this specific trip
        """
        trip = self.get_object()
        entertainments = self.get_entertainments(trip)
        return Response(entertainments)

    @action(detail=True, methods=['GET'], url_path='restaurants')
    def restaurants(self, request, pk=None):
        """
        Get restaurants for this specific trip
        """
        trip = self.get_object()
        restaurants = self.get_restaurants(trip)
        return Response(restaurants)

    @action(detail=True, methods=['GET'], url_path='ports')
    def ports(self, request, pk=None):
        """
        Get ports for this specific trip
        """
        trip = self.get_object()
        ports = self.get_ports(trip)
        return Response(ports)


    def get_available_rooms(self, trip):
        """
        Get rooms for this specific trip
        """
        try:
            # Use raw SQL query to bypass Django ORM limitations
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT r.room_number, r.room_type, r.room_size, 
                           r.number_beds, r.number_bath, r.number_balcony, 
                           r.room_location, r.room_price
                    FROM aro_rooms r
                    JOIN room_trip rt ON r.room_number = rt.room_number
                    WHERE rt.trip_id = %s
                """, [trip.trip_id])
                
                columns = [col[0] for col in cursor.description]
                return [
                    dict(zip(columns, row)) for row in cursor.fetchall()
                ]
        except Exception as e:
            print(f"Error retrieving rooms: {e}")
            return []

    def get_available_packages(self):
        """
        Get all available packages
        """
        try:
            return [
                {
                    'package_id': pkg.package_id,
                    'package_name': pkg.package_name,
                    'package_price': pkg.package_price,
                    'price_type': pkg.price_type
                } for pkg in AroPackages.objects.all()
            ]
        except Exception as e:
            print(f"Error retrieving packages: {e}")
            return []

    def get_entertainments(self, trip):
        """
        Get entertainments for this specific trip
        """
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT e.entertainment_id, e.entertainment_name, 
                           e.number_units, e.age_limit, e.floor
                    FROM aro_entertainments e
                    JOIN entertainment_trip et ON e.entertainment_id = et.entertainment_id
                    WHERE et.trip_id = %s
                """, [trip.trip_id])
                
                columns = [col[0] for col in cursor.description]
                return [
                    dict(zip(columns, row)) for row in cursor.fetchall()
                ]
        except Exception as e:
            print(f"Error retrieving entertainments: {e}")
            return []

    def get_restaurants(self, trip):
        """
        Get restaurants for this specific trip
        """
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT r.restaurant_id, r.restaurant_name, 
                           r.opening_time, r.closing_time, r.floor,
                           r.breakfast, r.lunch, r.dinner
                    FROM aro_restaurants r
                    JOIN restaurants_trip rt ON r.restaurant_id = rt.restaurant_id
                    WHERE rt.trip_id = %s
                """, [trip.trip_id])
                
                columns = [col[0] for col in cursor.description]
                return [
                    dict(zip(columns, row)) for row in cursor.fetchall()
                ]
        except Exception as e:
            print(f"Error retrieving restaurants: {e}")
            return []

    def get_ports(self, trip):
        """
        Get ports for this specific trip with address details
        """
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT p.port_id, p.port_name, p.airport, p.parking_spots,
                           tp.arrival_date, tp.departure_date,
                           a.address_line1, a.address_line2, a.city, 
                           a.state, a.zip_code, a.country
                    FROM aro_port p
                    JOIN trip_port tp ON p.port_id = tp.port_id
                    JOIN aro_address a ON p.address_id = a.address_id
                    WHERE tp.trip_id = %s
                """, [trip.trip_id])
                
                columns = [col[0] for col in cursor.description]
                ports = [dict(zip(columns, row)) for row in cursor.fetchall()]
                
                # Restructure the result to match previous format
                return [
                    {
                        'port_id': port['port_id'],
                        'port_name': port['port_name'],
                        'airport': port['airport'],
                        'parking_spots': port['parking_spots'],
                        'arrival_date': port['arrival_date'],
                        'departure_date': port['departure_date'],
                        'address': {
                            'address_line1': port['address_line1'],
                            'address_line2': port['address_line2'],
                            'city': port['city'],
                            'state': port['state'],
                            'zip_code': port['zip_code'],
                            'country': port['country']
                        }
                    } for port in ports
                ]
        except Exception as e:
            print(f"Error retrieving ports: {e}")
            return []
        
class UserRegistrationView(APIView):
    """
    User registration view
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User registered successfully',
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(UserLoginView, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        user = token.user
        return Response({
            'token': token.key,
            'user_id': user.id,
            'email': user.email
        })
    
class TripBookingViewSet(viewsets.ViewSet):
    """
    Comprehensive Trip Booking Process
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    @action(detail=False, methods=['POST'], url_path='select-trip')
    def select_trip(self, request):
        """
        Select a trip for booking
        """
        trip_id = request.data.get('trip_id')
        try:
            trip = AroTrip.objects.get(trip_id=trip_id)
            
            # Store trip selection in session or temporary storage
            request.session['selected_trip_id'] = trip_id
            
            return Response({
                'trip_details': {
                    'trip_id': trip.trip_id,
                    'ship_name': trip.ship_name,
                    'start_date': trip.start_date,
                    'end_date': trip.end_date
                },
                'message': 'Trip selected successfully'
            })
        except AroTrip.DoesNotExist:
            return Response({'error': 'Trip not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['POST'], url_path='group-details')
    def group_details(self, request):
        """
        Capture group booking details
        """
        serializer = PassengerGroupSerializer(data=request.data)
        if serializer.is_valid():
            # Generate unique group ID
            group_id = self.generate_group_id()
            
            # Store group details in session
            request.session['group_details'] = {
                'group_id': group_id,
                **serializer.validated_data
            }
            
            return Response({
                'group_id': group_id,
                'message': 'Group details captured successfully'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'], url_path='add-passengers')
    def add_passengers(self, request):
        """
        Add passengers to the group
        Handles both registered and unregistered passengers
        """
        permission_classes = [IsAuthenticated]
        authentication_classes = [TokenAuthentication, SessionAuthentication]

        # Retrieve group details from session
        group_details = request.session.get('group_details')
        selected_trip_id = request.session.get('selected_trip_id')

        if not group_details or not selected_trip_id:
            return Response({
                'error': 'No trip or group selected'
            }, status=status.HTTP_400_BAD_REQUEST)

        passengers_data = request.data.get('passengers', [])

        # Validate passenger count matches group details
        total_expected_passengers = group_details.get('total_passengers', 0)
        if len(passengers_data) != total_expected_passengers:
            return Response({
                'error': f'Expected {total_expected_passengers} passengers, received {len(passengers_data)}'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate and create passengers
        created_passengers = []
        try:
            with transaction.atomic():
                trip = AroTrip.objects.get(trip_id=selected_trip_id)

                for passenger_info in passengers_data:
                    # Add group_id from session
                    passenger_info['group_id'] = group_details['group_id']

                    # Validate and save passenger
                    serializer = PassengerDetailSerializer(
                        data=passenger_info,
                        context={'request': request}
                    )

                    if serializer.is_valid():
                        passenger = serializer.save()

                        # Create PassengerTrip entry
                        PassengerTrip.objects.create(
                            trip=trip,
                            passenger_id=passenger.passenger_id,
                            group_id=group_details['group_id']
                        )

                        created_passengers.append({
                            'passenger_id': passenger.passenger_id,
                            'user_id': passenger.user_id.id if passenger.user_id else None
                        })
                    else:
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Clear session data
            del request.session['group_details']
            del request.session['selected_trip_id']

            return Response({
                'message': 'Passengers added successfully',
                'group_id': group_details['group_id'],
                'created_passengers': created_passengers
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Debugging: Log the exception
            import traceback
            print(f"Error in add_passengers: {e}")
            print(traceback.format_exc())

            return Response({
                'error': 'An error occurred while adding passengers.',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def generate_group_id(self):
        """
        Generate a unique group ID 
        """
        return random.randint(10000, 99999)

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer  # Create a specific serializer if needed

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, username=email, password=password)
        if user is not None:
            # Return user data or token
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)