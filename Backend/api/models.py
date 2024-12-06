# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class Item(models.Model):
    # Define your fields here
    name = models.CharField(max_length=100)
    description = models.TextField()
    # ... other fields as needed

    def __str__(self):
        return self.name


class AroAddress(models.Model):
    address_id = models.AutoField(primary_key=True)
    address_type = models.CharField(max_length=10)
    address_line1 = models.CharField(max_length=60)
    address_line2 = models.CharField(max_length=60, blank=True, null=True)
    city = models.CharField(max_length=30)
    state = models.CharField(max_length=30)
    zip_code = models.CharField(max_length=10)
    country = models.CharField(max_length=30)


    class Meta:
        managed = False
        db_table = 'aro_address'
        db_table_comment = 'Address Table'


class AroBooking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    passenger_id = models.IntegerField()
    group_id = models.IntegerField()
    booking_cost = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'aro_booking'
        db_table_comment = 'PRIMARY KEY OF THE BOOKING TABLE'


class AroEntertainments(models.Model):
    entertainment_id = models.AutoField(primary_key=True)
    entertainment_name = models.CharField(max_length=30)
    number_units = models.IntegerField()
    age_limit = models.IntegerField()
    floor = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'aro_entertainments'
        db_table_comment = 'PRIMARY KEY OF THE ENTERTAINMENT TABLE'


class AroInvoice(models.Model):
    invoice_id = models.AutoField(primary_key=True)
    booking_id = models.ForeignKey(AroBooking, models.DO_NOTHING)
    issue_date = models.DateField()
    due_date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'aro_invoice'
        db_table_comment = 'PRIMARY KEY OF THE INVOICE TABLE'


class AroPackages(models.Model):
    package_id = models.AutoField(primary_key=True)
    package_name = models.CharField(max_length=30)
    package_price = models.DecimalField(max_digits=6, decimal_places=2)
    price_type = models.CharField(max_length=10) 
    description = models.CharField(max_length=255) 

    class Meta:
        managed = False
        db_table = 'aro_packages'
        db_table_comment = 'PRIMARY KEY OF THE PACKAGE TABLE'


class AroPassenger(models.Model):
    passenger_id = models.AutoField(primary_key=True)
    group_id = models.IntegerField()
    fname = models.CharField(max_length=30)
    lname = models.CharField(max_length=30)
    gender = models.CharField(max_length=10)
    age = models.IntegerField()
    email = models.CharField(max_length=30)
    phone = models.CharField(max_length=20)
    address = models.ForeignKey(AroAddress, models.DO_NOTHING, db_column='address_id')
    nationality = models.CharField(max_length=30)
    room_number = models.ForeignKey('AroRooms', models.DO_NOTHING, db_column='room_number')
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, db_column='user_id')

    class Meta:
        managed = True
        db_table = 'aro_passenger'
        unique_together = (('passenger_id', 'group_id'),)
        db_table_comment = 'PRIMARY KEY OF THE PASSENGER TABLE'


class AroPayments(models.Model):
    payment_id = models.AutoField(primary_key=True)
    invoice_id= models.ForeignKey(AroInvoice, models.DO_NOTHING)
    trip_id = models.IntegerField()
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=30)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2)
    group_id = models.IntegerField()
    payment_status = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'aro_payments'
        db_table_comment = 'PRIMARY KEY OF THE PAYMENTS TABLE'


class AroPort(models.Model):
    port_id = models.AutoField(primary_key=True)
    address_id = models.OneToOneField(AroAddress, models.DO_NOTHING)
    port_name = models.CharField(max_length=30)
    airport = models.CharField(max_length=30)
    parking_spots = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'aro_port'
        db_table_comment = 'PRIMARY KEY OF THE PORT'


class AroRestaurants(models.Model):
    YES_NO_CHOICES = [
        ('Y', 'Yes'),
        ('N', 'No'),
    ]
    restaurant_id = models.IntegerField(primary_key=True)
    restaurant_name = models.CharField(max_length=30)
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    floor = models.IntegerField()
    breakfast = models.CharField(max_length=1, choices=YES_NO_CHOICES)
    lunch = models.CharField(max_length=1, choices=YES_NO_CHOICES)
    dinner = models.CharField(max_length=1, choices=YES_NO_CHOICES)

    class Meta:
        managed = False
        db_table = 'aro_restaurants'
        db_table_comment = 'PRIMARY KEY OF THE RESTAURANT TABLE'


class AroRooms(models.Model):
    room_number = models.IntegerField(primary_key=True)
    room_type = models.CharField(max_length=20)
    room_size = models.IntegerField()
    number_beds = models.IntegerField()
    number_bath = models.DecimalField(max_digits=2, decimal_places=1)
    number_balcony = models.IntegerField()
    room_location = models.CharField(max_length=10)
    room_price = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'aro_rooms'
        db_table_comment = 'PRIMARY KEY OF THE ROOM TABLE'


class AroTrip(models.Model):
    trip_id = models.IntegerField(primary_key=True)
    number_passengers = models.IntegerField()
    ship_name = models.CharField(max_length=30)
    start_date = models.DateField()
    end_date = models.DateField()
    start_port = models.CharField(max_length=20)
    end_port = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'aro_trip'
        db_table_comment = 'PRIMARY KEY OF THE TRIP TABLE'


class EntertainmentTrip(models.Model):
    id = models.AutoField(primary_key=True)
    entertainment_id = models.OneToOneField(AroEntertainments, models.DO_NOTHING)  # The composite primary key (entertainment_id, trip_id) found, that is not supported. The first column is selected.
    trip_id = models.ForeignKey(AroTrip, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'entertainment_trip'
        unique_together = (('entertainment_id', 'trip_id'),)


class PassengerPackage(models.Model):
    id = models.AutoField(primary_key=True)
    package_id = models.ForeignKey(AroPackages, models.DO_NOTHING)
    group_id = models.IntegerField()
    passenger_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'passenger_package'
        unique_together = (('passenger_id', 'package_id', 'group_id'),)

    @property
    def passenger(self):
        try:
            return AroPassenger.objects.get(passenger_id=self.passenger_id, group_id=self.group_id)
        except AroPassenger.DoesNotExist:
            return None


class PassengerTrip(models.Model):
    passenger_id = models.IntegerField()
    trip = models.ForeignKey(AroTrip, on_delete=models.DO_NOTHING, db_column='trip_id') 
    group_id = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'passenger_trip'
        unique_together = (('trip', 'passenger_id', 'group_id'),)

    @property
    def passenger(self):
        return AroPassenger.objects.get(passenger_id=self.passenger_id, group_id=self.group_id)


class RestaurantsTrip(models.Model):
    id = models.AutoField(primary_key=True)
    restaurant_id = models.OneToOneField(AroRestaurants, models.DO_NOTHING)  # The composite primary key (restaurant_id, trip_id) found, that is not supported. The first column is selected.
    trip_id = models.ForeignKey(AroTrip, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'restaurants_trip'
        unique_together = (('restaurant_id', 'trip_id'),)


class RoomTrip(models.Model):
    id = models.AutoField(primary_key=True)
    room_number = models.OneToOneField(AroRooms, models.DO_NOTHING, db_column='room_number')  # The composite primary key (room_number, trip_id) found, that is not supported. The first column is selected.
    trip_id = models.ForeignKey(AroTrip, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'room_trip'
        unique_together = (('room_number', 'trip_id'),)


class TripPort(models.Model):
    id = models.AutoField(primary_key=True)
    trip_id = models.ForeignKey(AroTrip, models.DO_NOTHING)
    port_id = models.OneToOneField(AroPort, models.DO_NOTHING) 
    arrival_date = models.DateField()
    departure_date = models.DateField()

    class Meta:
        managed = False
        db_table = 'trip_port'
        unique_together = (('port_id', 'trip_id'),)
        db_table_comment = 'Trip Port Table'

