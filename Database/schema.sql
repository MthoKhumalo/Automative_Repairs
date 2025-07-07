
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('user', 'admin')) NOT NULL
);

CREATE TABLE Places (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    address VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE Admins (
    id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

/*Insert*/

INSERT INTO Users (username, email, password, role)
VALUES	('Mtho', 'mtho@gmail.com', 'mtho_happy', 'user'),
		('Gift', 'gift@gmail.com', 'gift_present', 'admin');

INSERT INTO Places (name, type, latitude, longitude, address, description)
VALUES	('AutoFix Panel Beaters', 'Panel Beater', -26.2041028, 28.0473051, '123 Main St, Johannesburg', 'Expert panel beaters and car repair specialists.'),
		('Quick Repair Garage', 'Garage', -26.2051028, 28.0474051, '456 Side St, Johannesburg', 'Fast and reliable car repair services.');