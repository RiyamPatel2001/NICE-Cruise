# Django Shell Testing
from api.models import AroPassenger, AroBooking
from api.serializers import AroPassengerSerializer, AroBookingSerializer

# Read Operations
def test_read_operations():
    print("🔍 Read Operations Test")
    
    # Retrieve All Passengers
    passengers = AroPassenger.objects.all()
    print(f"Total Passengers: {passengers.count()}")
    
    # Retrieve First 5 Passengers
    for passenger in passengers[:5]:
        print(f"Passenger: {passenger.fname} {passenger.lname}")
        print(f"ID: {passenger.passenger_id}")
        print("---")
    
    # Filtering Example
    male_passengers = AroPassenger.objects.filter(gender='Male')
    print(f"Male Passengers: {male_passengers.count()}")

# Update Operations
def test_update_operations():
    print("\n🔧 Update Operations Test")
    
    # Find a specific passenger
    try:
        passenger = AroPassenger.objects.first()
        
        # Update Passenger Details
        original_email = passenger.email
        passenger.email = f"updated_{original_email}"
        passenger.save()
        
        print(f"Updated Passenger Email: {passenger.email}")
        print(f"Passenger ID: {passenger.passenger_id}")
    
    except Exception as e:
        print(f"Update Error: {e}")

# Run Tests
test_read_operations()
test_update_operations()