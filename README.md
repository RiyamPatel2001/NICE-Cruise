# NICE Cruise Project

## Overview

This project is a database design and web application developed for NICE Cruises. It aims to streamline cruise operations, manage bookings, and enhance customer experience.

## Project Status
Completed

## Features

*   **Database Design:** A robust and efficient database schema to manage all aspects of cruise operations.
*   **Web Application:** A user-friendly web interface for managing bookings, customer data, and cruise details.
*   **SQL Queries:** Optimized SQL queries for data retrieval, reporting, and analytics.
*   **PL/SQL Procedures and Functions:** Stored procedures and functions to automate tasks and enforce business rules.

## Technologies Used

*   MySQL
*   Python (Backend)
*   HTML/CSS/JavaScript (Frontend)

## Database Design

### ER Diagram
The ER Diagram was designed to have efficient tables and correctly related entries.

### Tables

*   `aro_address`: Stores address information for passengers and ports.
*   `aro_booking`: Manages booking details, linking passengers to groups and calculating costs.
*   `aro_entertainments`: Details entertainment options available on cruises.
*   `aro_invoice`: Handles invoice generation and payment tracking.
*   `aro_packages`: Defines various cruise packages and their pricing.
*   `aro_passenger`: Stores passenger information, including personal details and contact information.
*   `aro_payments`: Records payment transactions and statuses.
*   `aro_port`: Manages port information, including location and facilities.
*   `aro_restaurants`: Details restaurant information.
*   `aro_rooms`: Manages the details of the rooms.
*   `aro_trip`: Details the information of the trips.
*   `entertainment_trip`: Establishes a many-to-many relationship between entertainments and trips.
*   `passenger_package`: Manages the packages that passengers have access to.
*   `passenger_trip`: Connects passengers to specific trips.
*   `restaurants_trip`: Establishes a many-to-many relationship between restaurants and trips.
*   `room_trip`: Establishes a many-to-many relationship between rooms and trips.
*   `trip_port`: Connects the ports to the trip.

### SQL Queries
Stored procedures and functions were created.

*   `AddPassenger`: Adds a new passenger to the database.
*   `BookTrip`: Books a passenger for a specific trip.
*   `AddPackageToPassenger`: Adds a package to a passenger's booking.
*   `CalculateTripCost`: Calculates the total cost of a trip based on selected packages.
*   `CalculateAgeAtTrip`: Calculates the age of a passenger at the start of a trip.
*   `IsRoomAvailable`: Checks if a room is available for a given date range.

### Triggers

*   `update_booking_cost`: Updates the booking cost when a package is added.
*   `check_entertainment_age`: Validates the passenger's age for specific entertainment options.

## Installation

1.  Clone the repository:

    ```
    git clone https://github.com/RiyamPatel2001/NICE-Cruise.git
    ```
2.  Set up the database:

    *   Create a MySQL database.
    *   Run the DDL script (`NICE_Cruise.sql`) to create the tables and populate them with initial data.
3.  Configure the backend:

    *   Navigate to the `Backend` directory.
    *   Install the required Python packages:

        ```
        pip install -r requirements.txt
        ```
    *   Configure the database connection settings.
4.  Set up the frontend:

    *   Navigate to the
