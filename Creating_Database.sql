CREATE DATABASE IF NOT EXISTS pharmacy_db;
USE pharmacy_db;

CREATE TABLE City
(
    id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,

    CONSTRAINT pk_City PRIMARY KEY(id)
);

CREATE TABLE Pharmacy
(
    id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    isActive TINYINT(1) DEFAULT 1,
    city_id INT,

    CONSTRAINT pk_Pharmacy PRIMARY KEY(id),
    CONSTRAINT fk_Pharmacy FOREIGN KEY(city_id) REFERENCES City(id)
);

CREATE TABLE Phone
(
    id INT AUTO_INCREMENT,
    number VARCHAR(20) NOT NULL,
    pharmacy_id INT,

    CONSTRAINT pk_Phone PRIMARY KEY(id),
    CONSTRAINT fk_Phone FOREIGN KEY(pharmacy_id) REFERENCES Pharmacy(id)
);

CREATE TABLE WorkingHours
(
    id INT AUTO_INCREMENT,
    day_of_week TINYINT NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    pharmacy_id INT,

    CONSTRAINT pk_WorkingHours PRIMARY KEY(id),
    CONSTRAINT fk_WorkingHours FOREIGN KEY(pharmacy_id) REFERENCES Pharmacy(id),
    INDEX idx_workinghours(pharmacy_id, day_of_week)
);

CREATE TABLE DutySchedule
(
    id INT AUTO_INCREMENT,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    pharmacy_id INT,

    CONSTRAINT pk_DutySchedule PRIMARY KEY(id),
    CONSTRAINT fk_DutySchedule FOREIGN KEY(pharmacy_id) REFERENCES Pharmacy(id),
    INDEX idx_dutyschedule(pharmacy_id)
);

CREATE TABLE PharmacyScheduleException
(
    id INT AUTO_INCREMENT,
    exception_date DATE NOT NULL,
    name VARCHAR(100) NOT NULL,
    open_time TIME NULL,
    close_time TIME NULL,
    is_closed TINYINT(1) DEFAULT 0,
    reason ENUM('holiday', 'special_hours', 'closure') DEFAULT 'holiday',
    pharmacy_id INT NOT NULL,

    CONSTRAINT pk_PharmacyScheduleException PRIMARY KEY(id),
    CONSTRAINT fk_PharmacyScheduleException FOREIGN KEY(pharmacy_id) REFERENCES Pharmacy(id),
    INDEX idx_schedule_exception_lookup(pharmacy_id, exception_date, reason)
);

CREATE TABLE Users
(
    id INT AUTO_INCREMENT,
    fullName VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'pharmacist', 'user') NOT NULL,
    pharmacy_id INT,

    CONSTRAINT pk_Users PRIMARY KEY(id),
    CONSTRAINT fk_Users FOREIGN KEY(pharmacy_id) REFERENCES Pharmacy(id)
);

CREATE TABLE ActiveIngredient
(
    id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    isActive TINYINT(1) DEFAULT 1,

    CONSTRAINT pk_ActiveIngredient PRIMARY KEY(id)
);

CREATE TABLE Medication
(
    id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    img_url VARCHAR(500),
    isActive TINYINT(1) DEFAULT 1,

    CONSTRAINT pk_Medication PRIMARY KEY(id)
);

ALTER TABLE Medication ADD FULLTEXT INDEX idx_medication_name(name);

CREATE TABLE Medication_ActiveIngredient
(
    medication_id INT,
    activeIngredient_id INT,

    CONSTRAINT pk_mai PRIMARY KEY(medication_id, activeIngredient_id),
    CONSTRAINT fk1_mai FOREIGN KEY(medication_id) REFERENCES Medication(id),
    CONSTRAINT fk2_mai FOREIGN KEY(activeIngredient_id) REFERENCES ActiveIngredient(id),
    INDEX idx_mai_ingredient(activeIngredient_id)
);

CREATE TABLE Doses
(
    id INT AUTO_INCREMENT,
    strength VARCHAR(50) NOT NULL,
    medication_id INT,
    isActive TINYINT(1) DEFAULT 1,

    CONSTRAINT pk_Doses PRIMARY KEY(id),
    CONSTRAINT fk_Doses FOREIGN KEY(medication_id) REFERENCES Medication(id),
    INDEX idx_doses_medication(medication_id)
);

CREATE TABLE Inventory
(
    id INT AUTO_INCREMENT,
    quantity INT,
    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    dose_id INT,
    pharmacy_id INT,

    CONSTRAINT uq_inventory UNIQUE(dose_id, pharmacy_id),
    CONSTRAINT pk_Inventory PRIMARY KEY(id),
    CONSTRAINT fk1_Inventory FOREIGN KEY(dose_id) REFERENCES Doses(id),
    CONSTRAINT fk2_Inventory FOREIGN KEY(pharmacy_id) REFERENCES Pharmacy(id),
    INDEX idx_inventory_search(dose_id, pharmacy_id)
);

CREATE TABLE News
(
    id INT AUTO_INCREMENT,
    article_id VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    link VARCHAR(1000) NOT NULL,
    image_url VARCHAR(1000),
    source_id VARCHAR(255),
    source_url VARCHAR(1000),
    category VARCHAR(100),
    language VARCHAR(10),
    country VARCHAR(10),
    pub_date DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    CONSTRAINT pk_News PRIMARY KEY(id),
    INDEX idx_news_pub_date(pub_date DESC)
);
