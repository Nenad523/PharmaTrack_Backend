USE pharmacy_db;

-- =========================================================
-- CITY
-- =========================================================
INSERT INTO City (name) VALUES
('Podgorica'),
('Nikšić'),
('Herceg Novi'),
('Budva'),
('Bar'),
('Ulcinj'),
('Kotor'),
('Tivat'),
('Cetinje'),
('Bijelo Polje'),
('Berane'),
('Pljevlja'),
('Danilovgrad'),
('Mojkovac'),
('Kolašin');

-- =========================================================
-- PHARMACY
-- =========================================================
INSERT INTO Pharmacy (name, address, latitude, longitude, isActive, city_id) VALUES
('Apoteka Zdravlje', 'Bulevar Svetog Petra Cetinjskog 12, Podgorica', 42.44128600, 19.26289200, 1, 1),
('Apoteka Montefarm Centar', 'Ulica Slobode 45, Podgorica', 42.43865000, 19.26421000, 1, 1),
('Apoteka Forum', 'Moskovska 101, Podgorica', 42.43085000, 19.24432000, 1, 1),
('Apoteka Delta Med', 'Cetinjski put bb, Podgorica', 42.41298000, 19.22850000, 1, 1),

('Apoteka NikMed', 'Njegoševa 18, Nikšić', 42.77310000, 18.94450000, 1, 2),
('Apoteka Hipokrat Nikšić', 'Vuka Karadžića 7, Nikšić', 42.77425000, 18.94712000, 1, 2),

('Apoteka Herceg Grad', 'Njegoševa 33, Herceg Novi', 42.45320000, 18.53110000, 1, 3),
('Apoteka Jadran', 'Šetalište Pet Danica 14, Herceg Novi', 42.45085000, 18.53650000, 1, 3),

('Apoteka Budva Centar', 'Mediteranska 22, Budva', 42.28640000, 18.84020000, 1, 4),
('Apoteka Mediteran', 'Jadranski put bb, Budva', 42.29110000, 18.83630000, 1, 4),

('Apoteka Topolica', 'Maršala Tita 9, Bar', 42.09982000, 19.10045000, 1, 5),
('Apoteka Luka Bar', 'Jovana Tomaševića 21, Bar', 42.09820000, 19.09570000, 1, 5),

('Apoteka Ulcinj Med', 'Bulevar Teuta 55, Ulcinj', 41.92960000, 19.22480000, 1, 6),
('Apoteka Stari Grad Ulcinj', '26. novembra 11, Ulcinj', 41.92830000, 19.20650000, 1, 6),

('Apoteka Kotor Care', 'Dobrota bb, Kotor', 42.43010000, 18.77120000, 1, 7),
('Apoteka Stari Grad Kotor', 'Trg od oružja 3, Kotor', 42.42470000, 18.77100000, 1, 7),

('Apoteka Tivat Health', 'Palih boraca 17, Tivat', 42.43390000, 18.69430000, 1, 8),
('Apoteka Porto Med', 'Arsenalska 6, Tivat', 42.43180000, 18.69110000, 1, 8),

('Apoteka Cetinje Plus', 'Njegoševa 66, Cetinje', 42.39010000, 18.91480000, 1, 9),
('Apoteka Biljarda', 'Bajova 2, Cetinje', 42.39350000, 18.92020000, 1, 9),

('Apoteka Bjelasica', 'Slobode 20, Bijelo Polje', 43.03840000, 19.74750000, 1, 10),
('Apoteka Lim', 'Muniba Kučevića 12, Bijelo Polje', 43.03690000, 19.74480000, 1, 10),

('Apoteka Berane Med', 'Mojsija Zečevića 18, Berane', 42.84230000, 19.87350000, 1, 11),
('Apoteka Polimlje', 'Dušana Vujoševića 4, Berane', 42.84140000, 19.87060000, 1, 11),

('Apoteka Pljevlja Care', 'Kralja Petra 15, Pljevlja', 43.35650000, 19.35890000, 1, 12),
('Apoteka Breznica', 'Tršova 7, Pljevlja', 43.35800000, 19.35540000, 1, 12),

('Apoteka Danilovgrad', 'Njegoševa 9, Danilovgrad', 42.55350000, 19.14640000, 1, 13),
('Apoteka Zeta Farm', 'Novice Škerovića 3, Danilovgrad', 42.55200000, 19.14480000, 1, 13),

('Apoteka Tara', 'Trg Ljubomira Bakoča 4, Mojkovac', 42.96050000, 19.58330000, 1, 14),
('Apoteka Biogradska', 'Mojkovačke bitke 10, Kolašin', 42.82210000, 19.51620000, 1, 15);

-- =========================================================
-- PHONE
-- =========================================================
INSERT INTO Phone (number, pharmacy_id) VALUES
('+38220220101', 1),
('+38220220102', 1),
('+38220221010', 2),
('+38220221011', 2),
('+38220222020', 3),
('+38220223030', 4),

('+38240201010', 5),
('+38240201011', 5),
('+38240202020', 6),

('+38231200111', 7),
('+38231200112', 7),
('+38231200222', 8),

('+38233250111', 9),
('+38233250222', 10),

('+38230210101', 11),
('+38230210202', 12),

('+38230350101', 13),
('+38230350202', 14),

('+38232200101', 15),
('+38232200202', 16),

('+38232680101', 17),
('+38232680202', 18),

('+38241230101', 19),
('+38241230202', 20),

('+38250210101', 21),
('+38250210202', 22),

('+38251220101', 23),
('+38251220202', 24),

('+38252250101', 25),
('+38252250202', 26),

('+38220260101', 27),
('+38220260202', 28),

('+38250330101', 29),
('+38250340101', 30);

-- =========================================================
-- WORKING HOURS
-- =========================================================
INSERT INTO WorkingHours (day_of_week, open_time, close_time, pharmacy_id) VALUES
-- Pharmacy 1
('Monday', '07:00:00', '22:00:00', 1),
('Tuesday', '07:00:00', '22:00:00', 1),
('Wednesday', '07:00:00', '22:00:00', 1),
('Thursday', '07:00:00', '22:00:00', 1),
('Friday', '07:00:00', '22:00:00', 1),
('Saturday', '08:00:00', '20:00:00', 1),
('Sunday', '08:00:00', '15:00:00', 1),

-- Pharmacy 2
('Monday', '07:00:00', '21:00:00', 2),
('Tuesday', '07:00:00', '21:00:00', 2),
('Wednesday', '07:00:00', '21:00:00', 2),
('Thursday', '07:00:00', '21:00:00', 2),
('Friday', '07:00:00', '21:00:00', 2),
('Saturday', '08:00:00', '18:00:00', 2),
('Sunday', '09:00:00', '14:00:00', 2),

-- Pharmacy 3
('Monday', '08:00:00', '21:00:00', 3),
('Tuesday', '08:00:00', '21:00:00', 3),
('Wednesday', '08:00:00', '21:00:00', 3),
('Thursday', '08:00:00', '21:00:00', 3),
('Friday', '08:00:00', '21:00:00', 3),
('Saturday', '08:00:00', '18:00:00', 3),
('Sunday', '09:00:00', '14:00:00', 3),

-- Pharmacy 4
('Monday', '09:00:00', '22:00:00', 4),
('Tuesday', '09:00:00', '22:00:00', 4),
('Wednesday', '09:00:00', '22:00:00', 4),
('Thursday', '09:00:00', '22:00:00', 4),
('Friday', '09:00:00', '22:00:00', 4),
('Saturday', '09:00:00', '20:00:00', 4),
('Sunday', '10:00:00', '16:00:00', 4),

-- Pharmacy 5
('Monday', '07:30:00', '20:00:00', 5),
('Tuesday', '07:30:00', '20:00:00', 5),
('Wednesday', '07:30:00', '20:00:00', 5),
('Thursday', '07:30:00', '20:00:00', 5),
('Friday', '07:30:00', '20:00:00', 5),
('Saturday', '08:00:00', '15:00:00', 5),
('Sunday', '00:00:00', '00:00:00', 5),

-- Pharmacy 6
('Monday', '08:00:00', '20:00:00', 6),
('Tuesday', '08:00:00', '20:00:00', 6),
('Wednesday', '08:00:00', '20:00:00', 6),
('Thursday', '08:00:00', '20:00:00', 6),
('Friday', '08:00:00', '20:00:00', 6),
('Saturday', '08:00:00', '16:00:00', 6),
('Sunday', '00:00:00', '00:00:00', 6),

-- Pharmacy 7
('Monday', '07:00:00', '21:00:00', 7),
('Tuesday', '07:00:00', '21:00:00', 7),
('Wednesday', '07:00:00', '21:00:00', 7),
('Thursday', '07:00:00', '21:00:00', 7),
('Friday', '07:00:00', '21:00:00', 7),
('Saturday', '08:00:00', '18:00:00', 7),
('Sunday', '09:00:00', '14:00:00', 7),

-- Pharmacy 8
('Monday', '08:00:00', '22:00:00', 8),
('Tuesday', '08:00:00', '22:00:00', 8),
('Wednesday', '08:00:00', '22:00:00', 8),
('Thursday', '08:00:00', '22:00:00', 8),
('Friday', '08:00:00', '22:00:00', 8),
('Saturday', '08:00:00', '20:00:00', 8),
('Sunday', '09:00:00', '16:00:00', 8),

-- Pharmacy 9
('Monday', '08:00:00', '22:00:00', 9),
('Tuesday', '08:00:00', '22:00:00', 9),
('Wednesday', '08:00:00', '22:00:00', 9),
('Thursday', '08:00:00', '22:00:00', 9),
('Friday', '08:00:00', '22:00:00', 9),
('Saturday', '08:00:00', '20:00:00', 9),
('Sunday', '09:00:00', '15:00:00', 9),

-- Pharmacy 10
('Monday', '08:00:00', '23:00:00', 10),
('Tuesday', '08:00:00', '23:00:00', 10),
('Wednesday', '08:00:00', '23:00:00', 10),
('Thursday', '08:00:00', '23:00:00', 10),
('Friday', '08:00:00', '23:00:00', 10),
('Saturday', '08:00:00', '23:00:00', 10),
('Sunday', '09:00:00', '18:00:00', 10),

-- Pharmacy 11
('Monday', '07:00:00', '21:00:00', 11),
('Tuesday', '07:00:00', '21:00:00', 11),
('Wednesday', '07:00:00', '21:00:00', 11),
('Thursday', '07:00:00', '21:00:00', 11),
('Friday', '07:00:00', '21:00:00', 11),
('Saturday', '08:00:00', '18:00:00', 11),
('Sunday', '09:00:00', '14:00:00', 11),

-- Pharmacy 12
('Monday', '08:00:00', '20:00:00', 12),
('Tuesday', '08:00:00', '20:00:00', 12),
('Wednesday', '08:00:00', '20:00:00', 12),
('Thursday', '08:00:00', '20:00:00', 12),
('Friday', '08:00:00', '20:00:00', 12),
('Saturday', '08:00:00', '16:00:00', 12),
('Sunday', '00:00:00', '00:00:00', 12),

-- Pharmacy 13
('Monday', '08:00:00', '21:00:00', 13),
('Tuesday', '08:00:00', '21:00:00', 13),
('Wednesday', '08:00:00', '21:00:00', 13),
('Thursday', '08:00:00', '21:00:00', 13),
('Friday', '08:00:00', '21:00:00', 13),
('Saturday', '08:00:00', '18:00:00', 13),
('Sunday', '09:00:00', '14:00:00', 13),

-- Pharmacy 14
('Monday', '08:00:00', '20:00:00', 14),
('Tuesday', '08:00:00', '20:00:00', 14),
('Wednesday', '08:00:00', '20:00:00', 14),
('Thursday', '08:00:00', '20:00:00', 14),
('Friday', '08:00:00', '20:00:00', 14),
('Saturday', '08:00:00', '15:00:00', 14),
('Sunday', '00:00:00', '00:00:00', 14),

-- Pharmacy 15
('Monday', '08:00:00', '21:00:00', 15),
('Tuesday', '08:00:00', '21:00:00', 15),
('Wednesday', '08:00:00', '21:00:00', 15),
('Thursday', '08:00:00', '21:00:00', 15),
('Friday', '08:00:00', '21:00:00', 15),
('Saturday', '08:00:00', '18:00:00', 15),
('Sunday', '09:00:00', '14:00:00', 15),

-- Pharmacy 16
('Monday', '08:00:00', '22:00:00', 16),
('Tuesday', '08:00:00', '22:00:00', 16),
('Wednesday', '08:00:00', '22:00:00', 16),
('Thursday', '08:00:00', '22:00:00', 16),
('Friday', '08:00:00', '22:00:00', 16),
('Saturday', '08:00:00', '20:00:00', 16),
('Sunday', '09:00:00', '15:00:00', 16),

-- Pharmacy 17
('Monday', '08:00:00', '20:00:00', 17),
('Tuesday', '08:00:00', '20:00:00', 17),
('Wednesday', '08:00:00', '20:00:00', 17),
('Thursday', '08:00:00', '20:00:00', 17),
('Friday', '08:00:00', '20:00:00', 17),
('Saturday', '08:00:00', '16:00:00', 17),
('Sunday', '00:00:00', '00:00:00', 17),

-- Pharmacy 18
('Monday', '09:00:00', '21:00:00', 18),
('Tuesday', '09:00:00', '21:00:00', 18),
('Wednesday', '09:00:00', '21:00:00', 18),
('Thursday', '09:00:00', '21:00:00', 18),
('Friday', '09:00:00', '21:00:00', 18),
('Saturday', '09:00:00', '19:00:00', 18),
('Sunday', '10:00:00', '15:00:00', 18),

-- Pharmacy 19
('Monday', '08:00:00', '20:00:00', 19),
('Tuesday', '08:00:00', '20:00:00', 19),
('Wednesday', '08:00:00', '20:00:00', 19),
('Thursday', '08:00:00', '20:00:00', 19),
('Friday', '08:00:00', '20:00:00', 19),
('Saturday', '08:00:00', '15:00:00', 19),
('Sunday', '00:00:00', '00:00:00', 19),

-- Pharmacy 20
('Monday', '08:00:00', '19:00:00', 20),
('Tuesday', '08:00:00', '19:00:00', 20),
('Wednesday', '08:00:00', '19:00:00', 20),
('Thursday', '08:00:00', '19:00:00', 20),
('Friday', '08:00:00', '19:00:00', 20),
('Saturday', '08:00:00', '14:00:00', 20),
('Sunday', '00:00:00', '00:00:00', 20),

-- Pharmacy 21
('Monday', '08:00:00', '20:00:00', 21),
('Tuesday', '08:00:00', '20:00:00', 21),
('Wednesday', '08:00:00', '20:00:00', 21),
('Thursday', '08:00:00', '20:00:00', 21),
('Friday', '08:00:00', '20:00:00', 21),
('Saturday', '08:00:00', '15:00:00', 21),
('Sunday', '00:00:00', '00:00:00', 21),

-- Pharmacy 22
('Monday', '08:00:00', '19:00:00', 22),
('Tuesday', '08:00:00', '19:00:00', 22),
('Wednesday', '08:00:00', '19:00:00', 22),
('Thursday', '08:00:00', '19:00:00', 22),
('Friday', '08:00:00', '19:00:00', 22),
('Saturday', '08:00:00', '14:00:00', 22),
('Sunday', '00:00:00', '00:00:00', 22),

-- Pharmacy 23
('Monday', '08:00:00', '19:30:00', 23),
('Tuesday', '08:00:00', '19:30:00', 23),
('Wednesday', '08:00:00', '19:30:00', 23),
('Thursday', '08:00:00', '19:30:00', 23),
('Friday', '08:00:00', '19:30:00', 23),
('Saturday', '08:00:00', '15:00:00', 23),
('Sunday', '00:00:00', '00:00:00', 23),

-- Pharmacy 24
('Monday', '08:00:00', '19:00:00', 24),
('Tuesday', '08:00:00', '19:00:00', 24),
('Wednesday', '08:00:00', '19:00:00', 24),
('Thursday', '08:00:00', '19:00:00', 24),
('Friday', '08:00:00', '19:00:00', 24),
('Saturday', '08:00:00', '14:00:00', 24),
('Sunday', '00:00:00', '00:00:00', 24),

-- Pharmacy 25
('Monday', '08:00:00', '20:00:00', 25),
('Tuesday', '08:00:00', '20:00:00', 25),
('Wednesday', '08:00:00', '20:00:00', 25),
('Thursday', '08:00:00', '20:00:00', 25),
('Friday', '08:00:00', '20:00:00', 25),
('Saturday', '08:00:00', '16:00:00', 25),
('Sunday', '00:00:00', '00:00:00', 25),

-- Pharmacy 26
('Monday', '08:00:00', '19:00:00', 26),
('Tuesday', '08:00:00', '19:00:00', 26),
('Wednesday', '08:00:00', '19:00:00', 26),
('Thursday', '08:00:00', '19:00:00', 26),
('Friday', '08:00:00', '19:00:00', 26),
('Saturday', '08:00:00', '14:00:00', 26),
('Sunday', '00:00:00', '00:00:00', 26),

-- Pharmacy 27
('Monday', '08:00:00', '19:00:00', 27),
('Tuesday', '08:00:00', '19:00:00', 27),
('Wednesday', '08:00:00', '19:00:00', 27),
('Thursday', '08:00:00', '19:00:00', 27),
('Friday', '08:00:00', '19:00:00', 27),
('Saturday', '08:00:00', '14:00:00', 27),
('Sunday', '00:00:00', '00:00:00', 27),

-- Pharmacy 28
('Monday', '08:00:00', '18:00:00', 28),
('Tuesday', '08:00:00', '18:00:00', 28),
('Wednesday', '08:00:00', '18:00:00', 28),
('Thursday', '08:00:00', '18:00:00', 28),
('Friday', '08:00:00', '18:00:00', 28),
('Saturday', '08:00:00', '13:00:00', 28),
('Sunday', '00:00:00', '00:00:00', 28),

-- Pharmacy 29
('Monday', '08:00:00', '18:00:00', 29),
('Tuesday', '08:00:00', '18:00:00', 29),
('Wednesday', '08:00:00', '18:00:00', 29),
('Thursday', '08:00:00', '18:00:00', 29),
('Friday', '08:00:00', '18:00:00', 29),
('Saturday', '08:00:00', '13:00:00', 29),
('Sunday', '00:00:00', '00:00:00', 29),

-- Pharmacy 30
('Monday', '08:00:00', '19:00:00', 30),
('Tuesday', '08:00:00', '19:00:00', 30),
('Wednesday', '08:00:00', '19:00:00', 30),
('Thursday', '08:00:00', '19:00:00', 30),
('Friday', '08:00:00', '19:00:00', 30),
('Saturday', '08:00:00', '15:00:00', 30),
('Sunday', '00:00:00', '00:00:00', 30);

-- =========================================================
-- DUTY SCHEDULE
-- =========================================================
INSERT INTO DutySchedule (start_datetime, end_datetime, pharmacy_id) VALUES
('2026-04-01 20:00:00', '2026-04-02 08:00:00', 1),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 2),
('2026-04-03 20:00:00', '2026-04-04 08:00:00', 3),
('2026-04-04 20:00:00', '2026-04-05 08:00:00', 4),

('2026-04-01 20:00:00', '2026-04-02 08:00:00', 5),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 6),

('2026-04-01 20:00:00', '2026-04-02 08:00:00', 7),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 8),

('2026-04-01 20:00:00', '2026-04-02 08:00:00', 9),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 10),

('2026-04-01 20:00:00', '2026-04-02 08:00:00', 11),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 12),

('2026-04-01 20:00:00', '2026-04-02 08:00:00', 13),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 14),

('2026-04-01 20:00:00', '2026-04-02 08:00:00', 15),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 16),

('2026-04-01 20:00:00', '2026-04-02 08:00:00', 17),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 18),

('2026-04-01 20:00:00', '2026-04-02 08:00:00', 19),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 20),

('2026-04-01 20:00:00', '2026-04-02 08:00:00', 21),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 22),

('2026-04-01 20:00:00', '2026-04-02 08:00:00', 23),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 24),

('2026-04-01 20:00:00', '2026-04-02 08:00:00', 25),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 26),

('2026-04-01 20:00:00', '2026-04-02 08:00:00', 27),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 28),

('2026-04-01 20:00:00', '2026-04-02 08:00:00', 29),
('2026-04-02 20:00:00', '2026-04-03 08:00:00', 30);

-- =========================================================
-- USERS
-- Napomena: koristi se kolona passwordHash jer je tako definisana u tvojoj SQL bazi
-- =========================================================
INSERT INTO Users (email, passwordHash, role, pharmacy_id) VALUES
('admin@pharmatrack.me', '$2b$12$adminhash001', 'admin', NULL),

('ana.markovic@zdravlje.me', '$2b$12$hash002', 'pharmacist', 1),
('ivan.vukcevic@montefarm.me', '$2b$12$hash003', 'pharmacist', 2),
('milica.bojovic@forum.me', '$2b$12$hash004', 'pharmacist', 3),
('petar.kovacevic@deltamed.me', '$2b$12$hash005', 'pharmacist', 4),

('jelena.nikolic@nikmed.me', '$2b$12$hash006', 'pharmacist', 5),
('marko.perovic@hipokratnk.me', '$2b$12$hash007', 'pharmacist', 6),

('tamara.jovanovic@herceggrad.me', '$2b$12$hash008', 'pharmacist', 7),
('nikola.mandic@jadran.me', '$2b$12$hash009', 'pharmacist', 8),

('sara.mijatovic@budvacentar.me', '$2b$12$hash010', 'pharmacist', 9),
('luka.popovic@mediteran.me', '$2b$12$hash011', 'pharmacist', 10),

('vanja.ivanovic@topolica.me', '$2b$12$hash012', 'pharmacist', 11),
('bojan.rakicevic@lukabar.me', '$2b$12$hash013', 'pharmacist', 12),

('amina.kurti@ulcinjmed.me', '$2b$12$hash014', 'pharmacist', 13),
('ardit.berisha@starigradul.me', '$2b$12$hash015', 'pharmacist', 14),

('maja.krivokapic@kotorcare.me', '$2b$12$hash016', 'pharmacist', 15),
('filip.draskovic@starigradko.me', '$2b$12$hash017', 'pharmacist', 16),

('teodora.bulatovic@tivathealth.me', '$2b$12$hash018', 'pharmacist', 17),
('andrija.lukic@portomed.me', '$2b$12$hash019', 'pharmacist', 18),

('katarina.martinovic@cetinjeplus.me', '$2b$12$hash020', 'pharmacist', 19),
('vladimir.radojevic@biljarda.me', '$2b$12$hash021', 'pharmacist', 20),

('emir.hadzic@bjelasica.me', '$2b$12$hash022', 'pharmacist', 21),
('selma.kolic@lim.me', '$2b$12$hash023', 'pharmacist', 22),

('stefan.vlahovic@beranemed.me', '$2b$12$hash024', 'pharmacist', 23),
('marija.babic@polimlje.me', '$2b$12$hash025', 'pharmacist', 24),

('milos.scekic@pljevljacare.me', '$2b$12$hash026', 'pharmacist', 25),
('olivera.saric@breznica.me', '$2b$12$hash027', 'pharmacist', 26),

('djordje.zekovic@danilovgrad.me', '$2b$12$hash028', 'pharmacist', 27),
('natasa.vucinic@zetafarm.me', '$2b$12$hash029', 'pharmacist', 28),

('mina.jankovic@tara.me', '$2b$12$hash030', 'pharmacist', 29),
('nemanja.djurisic@biogradska.me', '$2b$12$hash031', 'pharmacist', 30),

('korisnik1@gmail.com', '$2b$12$userhash032', 'user', NULL),
('korisnik2@gmail.com', '$2b$12$userhash033', 'user', NULL),
('korisnik3@gmail.com', '$2b$12$userhash034', 'user', NULL),
('korisnik4@gmail.com', '$2b$12$userhash035', 'user', NULL),
('korisnik5@gmail.com', '$2b$12$userhash036', 'user', NULL);

-- =========================================================
-- ACTIVE INGREDIENT
-- =========================================================
INSERT INTO ActiveIngredient (name, description, isActive) VALUES
('Paracetamol', 'Analgetik i antipiretik za ublažavanje bolova i snižavanje temperature.', 1),
('Ibuprofen', 'Nesteroidni antiinflamatorni lijek za bol, temperaturu i upalu.', 1),
('Amoxicillin', 'Penicilinski antibiotik širokog spektra.', 1),
('Clavulanic Acid', 'Inhibitor beta-laktamaze, često u kombinaciji sa amoksicilinom.', 1),
('Azithromycin', 'Makrolidni antibiotik za bakterijske infekcije.', 1),
('Cetirizine', 'Antihistaminik za alergijske reakcije.', 1),
('Loratadine', 'Antihistaminik druge generacije.', 1),
('Omeprazole', 'Inhibitor protonske pumpe za želudačnu kiselinu.', 1),
('Pantoprazole', 'Lijek za refluks i gastritis.', 1),
('Metformin', 'Oralni antidijabetik za tip 2 dijabetes.', 1),
('Amlodipine', 'Blokator kalcijumskih kanala za hipertenziju.', 1),
('Bisoprolol', 'Beta blokator za srčane i hipertenzivne terapije.', 1),
('Vitamin C', 'Dijetetski dodatak i podrška imunom sistemu.', 1),
('Magnesium', 'Mineral za mišiće i nervni sistem.', 1),
('Diclofenac', 'NSAIL za bolove i upalne procese.', 1),
('Nimesulide', 'Analgetik i antiinflamatorni lijek.', 1),
('Acetylsalicylic Acid', 'Lijek protiv bolova i antiagregaciona terapija.', 1),
('Xylometazoline', 'Nazalni dekongestiv za zapušen nos.', 1),
('Dexpanthenol', 'Za njegu kože i regeneraciju sluznice.', 1),
('Ambroxol', 'Mukolitik za iskašljavanje.', 1);

-- =========================================================
-- MEDICATION
-- =========================================================
INSERT INTO Medication (name, description, img_url, isActive) VALUES
('Paracetamol Galenika', 'Tablete protiv bolova i povišene temperature.', 'https://example.com/img/paracetamol_galenika.jpg', 1),
('Brufen', 'Ibuprofen tablete za bol i upalu.', 'https://example.com/img/brufen.jpg', 1),
('Amoksiklav', 'Antibiotik sa amoksicilinom i klavulanskom kiselinom.', 'https://example.com/img/amoksiklav.jpg', 1),
('Hemomicin', 'Azitromicin antibiotik.', 'https://example.com/img/hemomicin.jpg', 1),
('Aerius', 'Antihistaminik za alergije.', 'https://example.com/img/aerius.jpg', 1),
('Pressing', 'Cetirizin za sezonske alergije.', 'https://example.com/img/pressing.jpg', 1),
('Controloc', 'Pantoprazol za zaštitu želuca.', 'https://example.com/img/controloc.jpg', 1),
('Omeprazol Hemofarm', 'Lijek za smanjenje lučenja želudačne kiseline.', 'https://example.com/img/omeprazol.jpg', 1),
('Glucophage', 'Metformin za regulaciju šećera u krvi.', 'https://example.com/img/glucophage.jpg', 1),
('Amlopin', 'Amlodipin za visok krvni pritisak.', 'https://example.com/img/mlodipine.jpg', 1),
('Concor', 'Bisoprolol za srčane tegobe i hipertenziju.', 'https://example.com/img/concor.jpg', 1),
('Vitamin C 1000', 'Šumeće tablete vitamina C.', 'https://example.com/img/vitaminc.jpg', 1),
('Magnezijum Direkt', 'Granule magnezijuma za svakodnevnu upotrebu.', 'https://example.com/img/magnesium.jpg', 1),
('Diklofen Duo', 'Diklofenak kapsule protiv bolova.', 'https://example.com/img/diklofen.jpg', 1),
('Nimulid', 'Nimesulid za kratkotrajnu terapiju bola.', 'https://example.com/img/nimulid.jpg', 1),
('Andol', 'Acetilsalicilna kiselina tablete.', 'https://example.com/img/andol.jpg', 1),
('Operil', 'Kapi za nos sa ksilometazolinom.', 'https://example.com/img/operil.jpg', 1),
('Pantenol Mast', 'Mast sa dekspantenolom za kožu.', 'https://example.com/img/pantenol.jpg', 1),
('Ambroxol Sirup', 'Sirup za iskašljavanje.', 'https://example.com/img/ambroxol.jpg', 1),
('Defrinol Forte', 'Kombinovani lijek za prehladu i grip.', 'https://example.com/img/defrinol.jpg', 1);

-- =========================================================
-- MEDICATION_ACTIVEINGREDIENT
-- =========================================================
INSERT INTO Medication_ActiveIngredient (medication_id, activeIngredient_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(3, 4),
(4, 5),
(5, 7),
(6, 6),
(7, 9),
(8, 8),
(9, 10),
(10, 11),
(11, 12),
(12, 13),
(13, 14),
(14, 15),
(15, 16),
(16, 17),
(17, 18),
(18, 19),
(19, 20),
(20, 1),
(20, 18);

-- =========================================================
-- DOSES
-- =========================================================
INSERT INTO Doses (strength, medication_id, isActive) VALUES
('500 mg', 1, 1),
('120 mg/5 ml', 1, 1),

('400 mg', 2, 1),
('600 mg', 2, 1),

('625 mg', 3, 1),
('1000 mg', 3, 1),

('500 mg', 4, 1),
('200 mg/5 ml', 4, 1),

('5 mg', 5, 1),
('10 mg', 5, 1),

('10 mg', 6, 1),
('1 mg/ml', 6, 1),

('20 mg', 7, 1),
('40 mg', 7, 1),

('20 mg', 8, 1),

('500 mg', 9, 1),
('850 mg', 9, 1),
('1000 mg', 9, 1),

('5 mg', 10, 1),
('10 mg', 10, 1),

('5 mg', 11, 1),
('10 mg', 11, 1),

('1000 mg', 12, 1),

('300 mg', 13, 1),
('400 mg', 13, 1),

('75 mg', 14, 1),
('150 mg', 14, 1),

('100 mg', 15, 1),

('100 mg', 16, 1),

('0.05%', 17, 1),

('5%', 18, 1),

('15 mg/5 ml', 19, 1),

('Paracetamol + dekongestiv', 20, 1);

-- =========================================================
-- INVENTORY
-- dosta podataka po više gradova i apoteka
-- =========================================================
INSERT INTO Inventory (quantity, dose_id, pharmacy_id) VALUES
(120, 1, 1),
(60, 2, 1),
(90, 3, 1),
(40, 5, 1),
(35, 7, 1),
(55, 9, 1),
(70, 13, 1),
(80, 16, 1),
(65, 19, 1),
(100, 23, 1),

(100, 1, 2),
(45, 3, 2),
(30, 5, 2),
(20, 6, 2),
(25, 10, 2),
(50, 14, 2),
(60, 17, 2),
(40, 21, 2),
(75, 23, 2),
(90, 31, 2),

(85, 1, 3),
(50, 4, 3),
(28, 7, 3),
(35, 8, 3),
(42, 11, 3),
(37, 13, 3),
(64, 18, 3),
(55, 20, 3),
(70, 23, 3),
(33, 32, 3),

(110, 1, 4),
(70, 3, 4),
(40, 5, 4),
(18, 7, 4),
(45, 9, 4),
(60, 14, 4),
(90, 16, 4),
(20, 24, 4),
(50, 31, 4),
(22, 33, 4),

(95, 1, 5),
(44, 3, 5),
(26, 5, 5),
(24, 7, 5),
(31, 11, 5),
(36, 15, 5),
(80, 16, 5),
(46, 23, 5),
(34, 27, 5),
(18, 32, 5),

(70, 1, 6),
(30, 4, 6),
(22, 6, 6),
(20, 10, 6),
(25, 12, 6),
(33, 14, 6),
(29, 17, 6),
(31, 19, 6),
(40, 23, 6),
(16, 33, 6),

(88, 1, 7),
(40, 3, 7),
(21, 5, 7),
(19, 7, 7),
(27, 9, 7),
(35, 13, 7),
(52, 16, 7),
(43, 21, 7),
(39, 23, 7),
(17, 31, 7),

(90, 1, 8),
(55, 3, 8),
(33, 5, 8),
(25, 8, 8),
(22, 10, 8),
(49, 14, 8),
(65, 16, 8),
(41, 18, 8),
(38, 23, 8),
(20, 32, 8),

(110, 1, 9),
(60, 3, 9),
(30, 5, 9),
(27, 7, 9),
(32, 9, 9),
(40, 13, 9),
(75, 16, 9),
(52, 17, 9),
(48, 23, 9),
(25, 33, 9),

(125, 1, 10),
(72, 3, 10),
(38, 5, 10),
(30, 7, 10),
(34, 9, 10),
(42, 14, 10),
(81, 16, 10),
(56, 21, 10),
(50, 23, 10),
(26, 31, 10),

(93, 1, 11),
(40, 4, 11),
(28, 5, 11),
(20, 7, 11),
(21, 12, 11),
(39, 13, 11),
(63, 16, 11),
(44, 19, 11),
(36, 23, 11),
(15, 32, 11),

(80, 1, 12),
(36, 3, 12),
(22, 6, 12),
(18, 8, 12),
(20, 10, 12),
(31, 14, 12),
(58, 16, 12),
(40, 18, 12),
(30, 23, 12),
(14, 33, 12),

(74, 1, 13),
(35, 3, 13),
(20, 5, 13),
(17, 7, 13),
(18, 11, 13),
(26, 13, 13),
(55, 16, 13),
(33, 17, 13),
(28, 23, 13),
(12, 31, 13),

(68, 1, 14),
(28, 4, 14),
(19, 6, 14),
(14, 10, 14),
(16, 12, 14),
(25, 14, 14),
(47, 16, 14),
(29, 21, 14),
(27, 23, 14),
(10, 32, 14),

(79, 1, 15),
(34, 3, 15),
(21, 5, 15),
(16, 7, 15),
(20, 9, 15),
(30, 13, 15),
(51, 16, 15),
(35, 18, 15),
(31, 23, 15),
(11, 33, 15),

(83, 1, 16),
(39, 3, 16),
(23, 5, 16),
(18, 8, 16),
(21, 10, 16),
(34, 14, 16),
(57, 16, 16),
(37, 19, 16),
(29, 23, 16),
(12, 31, 16),

(77, 1, 17),
(32, 4, 17),
(18, 6, 17),
(15, 7, 17),
(19, 11, 17),
(27, 13, 17),
(49, 16, 17),
(34, 17, 17),
(26, 23, 17),
(10, 32, 17),

(72, 1, 18),
(31, 3, 18),
(17, 5, 18),
(14, 8, 18),
(18, 9, 18),
(25, 14, 18),
(46, 16, 18),
(30, 18, 18),
(24, 23, 18),
(9, 33, 18),

(69, 1, 19),
(27, 3, 19),
(16, 5, 19),
(13, 7, 19),
(17, 10, 19),
(24, 13, 19),
(43, 16, 19),
(28, 17, 19),
(22, 23, 19),
(8, 31, 19),

(65, 1, 20),
(24, 4, 20),
(15, 6, 20),
(12, 8, 20),
(14, 12, 20),
(20, 14, 20),
(40, 16, 20),
(25, 21, 20),
(20, 23, 20),
(7, 32, 20),

(86, 1, 21),
(33, 3, 21),
(19, 5, 21),
(15, 7, 21),
(20, 9, 21),
(29, 13, 21),
(54, 16, 21),
(36, 18, 21),
(30, 23, 21),
(11, 31, 21),

(70, 1, 22),
(25, 4, 22),
(16, 6, 22),
(13, 8, 22),
(17, 11, 22),
(23, 14, 22),
(41, 16, 22),
(27, 19, 22),
(22, 23, 22),
(8, 33, 22),

(66, 1, 23),
(26, 3, 23),
(14, 5, 23),
(11, 7, 23),
(15, 10, 23),
(22, 13, 23),
(38, 16, 23),
(25, 17, 23),
(20, 23, 23),
(7, 31, 23),

(61, 1, 24),
(21, 4, 24),
(13, 6, 24),
(10, 8, 24),
(13, 11, 24),
(19, 14, 24),
(36, 16, 24),
(21, 18, 24),
(18, 23, 24),
(6, 32, 24),

(64, 1, 25),
(22, 3, 25),
(14, 5, 25),
(11, 7, 25),
(14, 9, 25),
(20, 13, 25),
(37, 16, 25),
(22, 17, 25),
(19, 23, 25),
(7, 33, 25),

(59, 1, 26),
(20, 4, 26),
(12, 6, 26),
(9, 8, 26),
(12, 10, 26),
(18, 14, 26),
(34, 16, 26),
(19, 19, 26),
(16, 23, 26),
(5, 31, 26),

(62, 1, 27),
(21, 3, 27),
(13, 5, 27),
(10, 7, 27),
(12, 9, 27),
(18, 13, 27),
(35, 16, 27),
(20, 18, 27),
(17, 23, 27),
(6, 32, 27),

(58, 1, 28),
(19, 4, 28),
(11, 6, 28),
(8, 8, 28),
(11, 11, 28),
(17, 14, 28),
(32, 16, 28),
(18, 17, 28),
(15, 23, 28),
(5, 33, 28),

(55, 1, 29),
(18, 3, 29),
(10, 5, 29),
(8, 7, 29),
(10, 9, 29),
(16, 13, 29),
(31, 16, 29),
(17, 18, 29),
(14, 23, 29),
(4, 31, 29),

(57, 1, 30),
(20, 4, 30),
(12, 6, 30),
(9, 8, 30),
(12, 10, 30),
(18, 14, 30),
(33, 16, 30),
(19, 21, 30),
(16, 23, 30),
(5, 32, 30);

-- =========================================================
-- PHARMACY SCHEDULE EXCEPTIONS / HOLIDAYS
-- =========================================================
INSERT INTO PharmacyScheduleException
    (exception_date, name, open_time, close_time, is_closed, reason, pharmacy_id)
VALUES
('2026-01-01', 'Nova godina', NULL, NULL, 1, 'holiday', 1),
('2026-01-01', 'Nova godina', '09:00:00', '13:00:00', 0, 'holiday', 2),
('2026-01-07', 'Bozic', NULL, NULL, 1, 'holiday', 3),
('2026-01-07', 'Bozic', '10:00:00', '13:00:00', 0, 'holiday', 4),
('2026-01-07', 'Bozic', '15:00:00', '18:00:00', 0, 'holiday', 4),
('2026-05-01', 'Praznik rada', NULL, NULL, 1, 'holiday', 5),
('2026-05-01', 'Praznik rada', '08:00:00', '12:00:00', 0, 'holiday', 10);
