-- Create Tables

CREATE TABLE aro_address (
  address_id INT(10) NOT NULL AUTO_INCREMENT,
  address_type VARCHAR(10) NOT NULL COMMENT 'Type of address: primary, contact, office, etc.',
  address_line1 VARCHAR(60) NOT NULL COMMENT 'Line 1 of the address',
  address_line2 VARCHAR(60) COMMENT 'Line 2 of the address',
  city VARCHAR(30) NOT NULL COMMENT 'City in the address',
  state VARCHAR(30) NOT NULL COMMENT 'State in the address',
  zip_code VARCHAR(10) NOT NULL COMMENT 'ZIP code of the address',
  country VARCHAR(30) NOT NULL COMMENT 'Country of the address',
  PRIMARY KEY (address_id)
);

CREATE TABLE aro_booking (
  booking_id INT(10) NOT NULL AUTO_INCREMENT,
  passenger_id INT(10) NOT NULL,
  group_id INT(10) NOT NULL,
  booking_cost DECIMAL(10,2) NOT NULL COMMENT 'Cost of booking',
  PRIMARY KEY (booking_id),
  FOREIGN KEY (passenger_id, group_id) REFERENCES aro_passenger(passenger_id, group_id)
);

CREATE TABLE aro_entertainments (
  entertainment_id INT(5) NOT NULL AUTO_INCREMENT,
  entertainment_name VARCHAR(30) NOT NULL COMMENT 'Name of the activity or entertainment',
  number_units INT(1) NOT NULL COMMENT 'Number of units',
  age_limit INT(2) NOT NULL COMMENT 'Age limit of the entertainment or activity',
  floor INT(1) NOT NULL COMMENT 'Floor of the entertainment venue',
  PRIMARY KEY (entertainment_id)
);

CREATE TABLE aro_invoice (
  invoice_id INT(5) NOT NULL AUTO_INCREMENT,
  booking_id INT(10) NOT NULL,
  issue_date DATE NOT NULL COMMENT 'Date of issuance',
  due_date DATE NOT NULL COMMENT 'Due date for payment',
  total_amount DECIMAL(10,2) NOT NULL COMMENT 'Total amount of the trip',
  PRIMARY KEY (invoice_id),
  FOREIGN KEY (booking_id) REFERENCES aro_booking(booking_id)
);

CREATE TABLE aro_packages (
  package_id INT(5) NOT NULL AUTO_INCREMENT,
  package_name VARCHAR(30) NOT NULL COMMENT 'Name of the package',
  package_price DECIMAL(6,2) NOT NULL COMMENT 'Cost per person',
  price_type VARCHAR(5) NOT NULL COMMENT 'Price per night or trip',
  PRIMARY KEY (package_id)
);

CREATE TABLE aro_passenger (
  passenger_id INT(10) NOT NULL AUTO_INCREMENT,
  group_id INT(10),
  fname VARCHAR(30) NOT NULL COMMENT 'First name of the passenger',
  lname VARCHAR(30) NOT NULL COMMENT 'Last name of the passenger',
  gender VARCHAR(10) NOT NULL COMMENT 'Gender of the passenger',
  age INT(3) NOT NULL COMMENT 'Age at trip start',
  email VARCHAR(30) NOT NULL COMMENT 'Email of the passenger',
  phone VARCHAR(20) NOT NULL COMMENT 'Phone number of the customer',
  address_id INT(10),
  nationality VARCHAR(30) NOT NULL COMMENT 'Citizenship of the passenger',
  room_number INT(5),
  PRIMARY KEY (passenger_id),
  FOREIGN KEY (address_id) REFERENCES aro_address(address_id),
  FOREIGN KEY (room_number) REFERENCES aro_rooms(room_number)
);

CREATE TABLE aro_payments (
  payment_id INT(10) NOT NULL AUTO_INCREMENT,
  invoice_id INT(5),
  trip_id INT(10),
  payment_date DATE NOT NULL COMMENT 'Date of payment',
  payment_method VARCHAR(30) NOT NULL COMMENT 'Method of payment',
  payment_amount DECIMAL(10,2) NOT NULL COMMENT 'Payment amount in USD',
  group_id INT(10),
  payment_status VARCHAR(10),
  PRIMARY KEY (payment_id),
  FOREIGN KEY (invoice_id) REFERENCES aro_invoice(invoice_id)
);

CREATE TABLE aro_port (
 port_id INT(10) NOT NULL AUTO_INCREMENT,
 address_id INT(10),
 port_name VARCHAR(30),
 airport VARCHAR(30),
 parking_spots INT UNSIGNED,
 PRIMARY KEY (port_ID),
 UNIQUE INDEX (address_ID),
 FOREIGN KEY (address_ID ) REFERENCES aro_address(address_ID )
);

CREATE TABLE aro_restaurants (
 restaurant_ID int (5), 
 restaurant_name varchar (30), 
 opening_time TIME, 
 closing_time TIME, 
 floor int (1), 
 breakfast ENUM('Y', 'N') DEFAULT 'N', 
 lunch ENUM('Y', 'N') DEFAULT 'N', 
 dinner ENUM('Y', 'N') DEFAULT 'N', 
 PRIMARY key(restaurants_trip_pk )
);

CREATE TABLE aro_rooms (
 room_number int (5), 
 room_type varchar (20), 
 room_size DECIMAL (5,2), 
 number_beds TINYINT UNSIGNED, 
 number_bath DECIMAL (2,1), 
 number_balcony TINYINT UNSIGNED, 
 room_location varchar (10), 
 room_price DECIMAL (5,2), 
 PRIMARY key(room_number )
);

CREATE TABLE aro_trip (
 trip_ID int (10), 
 number_passengers SMALLINT UNSIGNED , 
 ship_name varchar (30), 
 start_date date , 
 end_date date , 
 start_port varchar (20), 
 end_port varchar (20), 
 PRIMARY key(trip_ID )
);

CREATE TABLE entertainment_trip (
 entertainment_ID int (5), 
 trip_ID int (10), 
 PRIMARY key(entertainment_ID , trip_ID ), 
 FOREIGN key(entertainment_ID ) REFERENCES aro_entertainments(entertainment_ID ), 
 FOREIGN key(trip_ID ) REFERENCES aro_trip(trip_ID )
);

CREATE TABLE passenger_package (
 passenger_ID int (10), 
 package_ID int (5), 
 group_ID int (10), 
 PRIMARY key(passenger_ID , package_ID , group_ID ), 
 FOREIGN key(package_ID ) REFERENCES aro_packages(package_ID ), 
 FOREIGN key(passenger_ID , group_ID ) REFERENCES aro_passenger(passenger_ID , group_ID )
);

CREATE TABLE passenger_trip (
 trip_ID int (10), 
 passenger_ID int (10), 
 group_ID int (10), 
 PRIMARY key(tripID , passengerID , groupID ), 
 FOREIGN key(passengerID , groupID ) REFERENCES aro_passenger(passengerID , groupID ), 
 FOREIGN key(tripID ) REFERENCES aro_trip(tripID )
);

CREATE TABLE restaurants_trip (
 restaurant_ID int (5), 
 trip_ID int (10), 
 PRIMARY key(restaurants_trip_pk ), 
 FOREIGN key(restaurants_trip_pk ) REFERENCES restaurants_trip_pk(restaurants_trip_pk )
);

CREATE TABLE room_trip (
 room_number int (5), 
 tripID int (10), 
 PRIMARY key(room_number , tripID ), 
 FOREIGN key(room_number ) REFERENCES aro_rooms(room_number ), 
 FOREIGN key(tripID ) REFERENCES aro_trip(tripID )
);

CREATE TABLE trip_port (
 tripID int (10), 
 portID int (10),  
 visit_order smallint unsigned ,
 arrival_date datetime ,
 departure_date datetime ,
 PRIMARY key(portID , tripID ),
 FOREIGN key(portID ) REFERENCES aro_port(portID ),
 FOREIGN key(tripID ) REFERENCES aro_trip(tripID )
);

----------------------------------------------------------------------------

-- PROCEDURES

DELIMITER //

-- Add new passenger
CREATE PROCEDURE AddPassenger(
    IN fname VARCHAR(30), IN lname VARCHAR(30), IN gender VARCHAR(10),
    IN age INT, IN email VARCHAR(30), IN phone VARCHAR(20),
    IN nationality VARCHAR(30), IN address_id INT, IN room_number INT
)
BEGIN
    INSERT INTO aro_passenger (fname, lname, gender, age, email, phone, nationality, address_id, room_number)
    VALUES (fname, lname, gender, age, email, phone, nationality, address_id, room_number);
END//

-- Book a trip
CREATE PROCEDURE BookTrip(
    IN passenger_id INT, IN trip_id INT, IN group_id INT
)
BEGIN
    INSERT INTO passenger_trip (trip_id, passenger_id, group_id)
    VALUES (trip_id, passenger_id, group_id);
END//

-- Add package to passenger
CREATE PROCEDURE AddPackageToPassenger(
    IN passenger_id INT, IN package_id INT, IN group_id INT
)
BEGIN
    INSERT INTO passenger_package (passenger_id, package_id, group_id)
    VALUES (passenger_id, package_id, group_id);
END//

-- Calculate total trip cost
CREATE FUNCTION CalculateTripCost(
    booking_id INT
) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE total_cost DECIMAL(10,2);
    SELECT SUM(p.package_price) INTO total_cost
    FROM passenger_package pp
    JOIN aro_packages p ON pp.package_id = p.package_id
    WHERE pp.passenger_id IN (
        SELECT passenger_id 
        FROM aro_booking 
        WHERE booking_id = booking_id
    );
    RETURN total_cost;
END//

DELIMITER ;

---------------------------------------------------------------------------

-- TRIGGERS

DELIMITER //

-- Update booking cost when package is added
CREATE TRIGGER update_booking_cost
AFTER INSERT ON passenger_package
FOR EACH ROW
BEGIN
    UPDATE aro_booking b
    SET booking_cost = booking_cost + (
        SELECT package_price 
        FROM aro_packages 
        WHERE package_id = NEW.package_id
    )
    WHERE b.passenger_id = NEW.passenger_id;
END//

-- Validate age for entertainment
CREATE TRIGGER check_entertainment_age
BEFORE INSERT ON entertainment_trip
FOR EACH ROW
BEGIN
    DECLARE min_age INT;
    SELECT age_limit INTO min_age 
    FROM aro_entertainments 
    WHERE entertainment_id = NEW.entertainment_id;
    
    IF EXISTS (
        SELECT 1 FROM passenger_trip pt
        JOIN aro_passenger p ON pt.passenger_id = p.passenger_id
        WHERE pt.trip_id = NEW.trip_id AND p.age < min_age
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Age requirement not met';
    END IF;
END//

DELIMITER ;

-----------------------------------------------------------------------------

-- FUNCTIONS

DELIMITER //

-- Calculate age at trip start
CREATE FUNCTION CalculateAgeAtTrip(
    birth_date DATE,
    trip_start_date DATE
) RETURNS INT
DETERMINISTIC
BEGIN
    RETURN YEAR(trip_start_date) - YEAR(birth_date) - 
        (DATE_FORMAT(trip_start_date, '%m%d') < DATE_FORMAT(birth_date, '%m%d'));
END//

-- Check room availability
CREATE FUNCTION IsRoomAvailable(
    p_room_number INT,
    p_start_date DATE,
    p_end_date DATE
) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE is_available BOOLEAN;
    SELECT COUNT(*) = 0 INTO is_available
    FROM room_trip rt
    JOIN aro_trip t ON rt.trip_id = t.trip_id
    WHERE rt.room_number = p_room_number
    AND ((t.start_date BETWEEN p_start_date AND p_end_date)
    OR (t.end_date BETWEEN p_start_date AND p_end_date));
    RETURN is_available;
END//

DELIMITER ;

-----------------------------------------------------------------------------

-- ENTRIES

-- Insert passengers
INSERT INTO aro_passenger (passenger_id, group_id, fname, lname, gender, age, email, phone, address_id, nationality, room_number) VALUES
(1, 101, 'John', 'Smith', 'Male', 45, 'john.smith@email.com', '555-0101', 10, 'USA', 101),
(2, 101, 'Mary', 'Smith', 'Female', 42, 'mary.smith@email.com', '555-0102', 10, 'USA', 101),
(3, 101, 'Jimmy', 'Smith', 'Male', 12, 'jimmy.smith@email.com', '555-0103', 10, 'USA', 101),
(4, 102, 'Robert', 'Johnson', 'Male', 35, 'robert.j@email.com', '555-0201', 11, 'USA', 201),
(5, 102, 'Lisa', 'Johnson', 'Female', 33, 'lisa.j@email.com', '555-0202', 11, 'USA', 201);

-- Insert trips
INSERT INTO aro_trip (trip_id, number_passengers, ship_name, start_date, end_date, start_port, end_port) VALUES
(1001, 150, 'NICE Caribbean Dream', '2024-12-20', '2024-12-27', 'Miami', 'Miami'),
(1002, 200, 'NICE Ocean Majesty', '2024-12-27', '2025-01-03', 'Miami', 'Miami');

-- Insert Packages
INSERT INTO aro_packages VALUES
(1, 'Water and Non-Alcoholic', 40.00, 'night'),
(2, 'Unlimited Bar', 80.00, 'night'),
(3, 'Internet 200', 150.00, 'trip'),
(4, 'Unlimited Internet', 220.00, 'trip'),
(5, 'Specialty Dining', 60.00, 'night');

-- Insert Rooms
INSERT INTO aro_rooms VALUES
(101, 'Haven Suite', 1000, 6, 3, 2, 'Forward', 1200.00),
(201, 'Club Balcony Suite', 800, 4, 2, 2, 'Mid', 800.00),
(301, 'Family Balcony', 600, 4, 2, 1, 'Aft', 600.00),
(401, 'Oceanview', 300, 2, 1, 0, 'Mid', 400.00),
(501, 'Inside', 200, 2, 1, 0, 'Forward', 300.00);

-- Insert Restaurants
INSERT INTO aro_restaurants VALUES
(1, 'Common Buffet', '07:00', '21:00', 6, 'Y', 'Y', 'Y'),
(2, 'Italian Specialty', '17:00', '22:00', 7, 'N', 'N', 'Y'),
(3, 'Mexican Specialty', '18:00', '22:00', 7, 'N', 'N', 'Y'),
(4, 'Tokyo Japanese', '12:00', '21:00', 5, 'N', 'Y', 'Y'),
(5, 'Ming Wok Chinese', '12:00', '20:00', 5, 'N', 'Y', 'Y');

-- Insert Entertainments
INSERT INTO aro_entertainments VALUES
(1, 'Theater', 2, 0, 8),
(2, 'Casino', 1, 21, 7),
(3, 'Children Play', 1, 3, 3),
(4, 'Gym', 1, 16, 5),
(5, 'Pool', 1, 0, 11);

-- Insert Ports
INSERT INTO aro_port VALUES
(1, 1, 'Miami', 'MIA', 1000),
(2, 2, 'Nassau', 'NAS', 500),
(3, 3, 'San Juan', 'SJU', 750),
(4, 4, 'St. Thomas', 'STT', 400),
(5, 5, 'Cozumel', 'CZM', 600);

-- Insert addresses for ports
INSERT INTO aro_address (address_id, address_type, address_line1, city, state, zip_code, country) VALUES
(1, 'port', '1015 N. America Way', 'Miami', 'Florida', '33132', 'USA'),
(2, 'port', 'Lynden Pindling International Airport', 'Nassau', 'New Providence', '00000', 'Bahamas'),
(3, 'port', 'Avenida Aeropuerto', 'Carolina', '00979', 'Puerto Rico', 'USA'),
(4, 'port', '2 Miles West of Charlotte Amalie', 'St. Thomas', 'St. Thomas', '00802', 'US Virgin Islands'),
(5, 'port', 'Boulevard Aeropuerto Cozumel s/n', 'Cozumel', 'Quintana Roo', '77600', 'Mexico');
(10, 'PERSON_PRIMARY', '123 Main St', 'Orlando', 'Florida', '32801', 'USA'),
(11, 'PERSON_PRIMARY', '456 Park Ave', 'Miami', 'Florida', '33139', 'USA'),
(12, 'PERSON_PRIMARY', '789 Beach Rd', 'Tampa', 'Florida', '33601', 'USA'),
(13, 'PERSON_PRIMARY', '321 Oak St', 'Atlanta', 'Georgia', '30301', 'USA'),
(14, 'PERSON_PRIMARY', '654 Pine Ave', 'Nashville', 'Tennessee', '37201', 'USA');

-- Insert passenger packages (linking table)
INSERT INTO passenger_package (passenger_id, package_id, group_id) VALUES
(1, 1, 101), -- Water package
(1, 3, 101), -- Internet 200
(2, 2, 101), -- Unlimited Bar
(4, 4, 102), -- Unlimited Internet
(5, 5, 102); -- Specialty dining

-- Insert bookings
INSERT INTO aro_booking (booking_id, passenger_id, group_id, booking_cost) VALUES
(1, 1, 101, 2400.00),
(2, 2, 101, 2400.00),
(3, 3, 101, 1200.00),
(4, 4, 102, 1600.00),
(5, 5, 102, 1600.00);

-- Insert invoices
INSERT INTO aro_invoice (invoice_id, booking_id, issue_date, due_date, total_amount) VALUES
(1, 1, '2024-11-20', '2024-12-01', 2400.00),
(2, 2, '2024-11-20', '2024-12-01', 2400.00),
(3, 3, '2024-11-20', '2024-12-01', 1200.00),
(4, 4, '2024-11-27', '2024-12-08', 1600.00),
(5, 5, '2024-11-27', '2024-12-08', 1600.00);

-- Insert payments
INSERT INTO aro_payments (payment_id, invoice_id, trip_id, payment_date, payment_method, payment_amount, group_id, payment_status) VALUES
(1, 1, 1001, '2024-11-25', 'Credit Card', 2400.00, 101, 'Completed'),
(2, 2, 1001, '2024-11-25', 'Credit Card', 2400.00, 101, 'Completed'),
(3, 3, 1001, '2024-11-25', 'Credit Card', 1200.00, 101, 'Completed'),
(4, 4, 1002, '2024-11-30', 'Credit Card', 1600.00, 102, 'Completed'),
(5, 5, 1002, '2024-11-30', 'Credit Card', 1600.00, 102, 'Completed');

-- Fill entertainment_trip table
INSERT INTO entertainment_trip VALUES
(1, 1001), -- Theater for Trip 1001
(2, 1001), -- Casino for Trip 1001
(3, 1001), -- Children Play for Trip 1001
(1, 1002), -- Theater for Trip 1002
(4, 1002), -- Gym for Trip 1002
(5, 1002); -- Pool for Trip 1002

-- Fill restaurants_trip table
INSERT INTO restaurants_trip VALUES
(1, 1001),
(2, 1001),
(3, 1001),
(1, 1002),
(4, 1002);

-- Fill room_trip table
INSERT INTO room_trip VALUES
(101, 1001),
(201, 1001),
(301, 1001),
(401, 1002),
(501, 1002);

-- Fill trip_port table
INSERT INTO trip_port VALUES
(1001, 1, 1, '2024-12-20 13:00:00', '2024-12-20 23:00:00'),
(1001, 2, 2, '2024-12-21 08:00:00', '2024-12-21 17:00:00'),
(1001, 3, 3, '2024-12-22 09:00:00', '2024-12-22 18:00:00'),
(1002, 4, 1, '2024-12-23 07:00:00', '2024-12-23 16:00:00'),
(1002, 5, 2, '2024-12-24 08:00:00', '2024-12-24 17:00:00');



