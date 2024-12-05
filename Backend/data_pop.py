# data_exploration.py
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from api.models import AroTrip, AroAddress, AroPort

def explore_data():
    print("🚢 Trip Data:")
    for trip in AroTrip.objects.all():
        print(f"Trip {trip.trip_id}: {trip.ship_name}")
        print(f"  Passengers: {trip.number_passengers}")
        print(f"  Route: {trip.start_port} to {trip.end_port}")
        print("---")
    
    print("\n🏠 Address Data:")
    for address in AroAddress.objects.all():
        print(f"Address {address.address_id}: {address.address_line1}, {address.city}, {address.country}")

if __name__ == "__main__":
    explore_data()