-- Initial Client Data
INSERT INTO client (first_name, last_name, address, city, canton, birth_date, email, phone_number, zip)
VALUES
('Gabriel', 'Keller', 'Poststrasse 29', 'Zürich', 'ZH', '1956-12-03', 'gabriel.keller@proton.me', '+41 076 030 11 27', 8005),
('Elia', 'Schwarz', 'Feldstrasse 29', 'Neuchâtel', 'NE', '2005-04-08', 'elia.schwarz@outlook.com', '+41 078 284 19 27', 2008),
('Noah', 'Fischer', 'Seestrasse 119', 'Lausanne', 'VD', '1973-05-28', 'noah.fischer@outlook.com', '+41 076 046 84 29', 1011),
('Matteo', 'Schwarz', 'Hauptstrasse 48', 'Aarau', 'AG', '1999-06-12', 'matteo.schwarz@bluewin.ch', '+41 077 167 59 48', 5005),
('Paul', 'Meier', 'Feldstrasse 35', 'Schaffhausen', 'SH', '1977-08-14', 'paul.meier@gmail.com', '+41 079 905 82 58', 8205),
('Sara', 'Frei', 'Feldstrasse 115', 'Fribourg', 'FR', '1993-06-10', 'sara.frei@gmx.ch', '+41 076 881 14 19', 1709),
('Zoé', 'Fontana', 'Gartenweg 111', 'Montreux', 'VD', '1957-09-04', 'zoé.fontana@gmail.com', '+41 078 114 37 55', 1824),
('Laura', 'Keller', 'Lindenweg 82', 'Olten', 'SO', '1972-04-21', 'laura.keller@gmx.ch', '+41 076 613 41 62', 4604),
('Julia', 'Hofmann', 'Seestrasse 94', 'Herisau', 'AR', '1958-01-22', 'julia.hofmann@outlook.com', '+41 079 969 70 21', 9101),
('Sofia', 'Bianchi', 'Panoramastrasse 116', 'Bellinzona', 'TI', '1985-09-10', 'sofia.bianchi@gmx.ch', '+41 077 602 28 00', 6505),
('Julia', 'Meier', 'Seestrasse 66', 'Olten', 'SO', '1986-08-18', 'julia.meier@proton.me', '+41 079 248 60 52', 4605),
('Marie', 'Fischer', 'Bahnhofstrasse 52', 'Winterthur', 'ZH', '1996-01-18', 'marie.fischer@posteo.net', '+41 079 143 54 23', 8401),
('Marie', 'Graf', 'Bahnhofstrasse 84', 'St. Gallen', 'SG', '1984-08-23', 'marie.graf@gmx.ch', '+41 079 218 51 07', 9001),
('Elia', 'Fischer', 'Rathausgasse 92', 'Schaffhausen', 'SH', '1986-04-27', 'elia.fischer@outlook.com', '+41 076 765 40 07', 8208),
('Emma', 'Schmid', 'Rathausgasse 111', 'Chur', 'GR', '1983-10-06', 'emma.schmid@proton.me', '+41 076 429 84 74', 7001),
('Jonas', 'Brunner', 'Hauptstrasse 86', 'Luzern', 'LU', '1999-05-05', 'jonas.brunner@posteo.net', '+41 076 075 68 27', 6009),
('Julia', 'Brunner', 'Hauptstrasse 57', 'Baar', 'ZG', '1958-05-25', 'julia.brunner@gmx.ch', '+41 078 954 84 13', 6344),
('Elena', 'Meißner', 'Rathausgasse 82', 'Zug', 'ZG', '2001-04-17', 'elena.meißner@bluewin.ch', '+41 078 045 00 42', 6303),
('Matteo', 'Zimmermann', 'Gartenweg 2', 'Neuchâtel', 'NE', '1992-06-23', 'matteo.zimmermann@gmail.com', '+41 078 596 70 18', 2006),
('Laura', 'Gerber', 'Alpenblick 46', 'Olten', 'SO', '1996-08-17', 'laura.gerber@proton.me', '+41 079 997 79 95', 4600),
('Giulia', 'Gerber', 'Bahnhofstrasse 23', 'Biel/Bienne', 'BE', '1968-11-29', 'giulia.gerber@posteo.net', '+41 077 273 20 89', 2508),
('Lina', 'Fischer', 'Kirchweg 40', 'Aarau', 'AG', '1988-07-10', 'lina.fischer@proton.me', '+41 076 990 98 35', 5007),
('Nina', 'Huber', 'Bahnhofstrasse 14', 'Rapperswil-Jona', 'SG', '1977-09-16', 'nina.huber@gmx.ch', '+41 076 394 73 24', 8644),
('David', 'Schäfer', 'Kirchweg 85', 'Zug', 'ZG', '1969-03-18', 'david.schäfer@gmail.com', '+41 078 567 16 24', 6309),
('Paul', 'Müller', 'Poststrasse 56', 'Kriens', 'LU', '1964-02-19', 'paul.müller@gmx.ch', '+41 077 523 60 94', 6014),
('Gabriel', 'Meister', 'Lindenweg 97', 'Zug', 'ZG', '1987-12-26', 'gabriel.meister@proton.me', '+41 077 486 78 98', 6301),
('Lina', 'Weber', 'Alpenblick 97', 'Lugano', 'TI', '1959-05-20', 'lina.weber@gmail.com', '+41 077 939 15 58', 6900),
('Laura', 'Zimmermann', 'Schulstrasse 111', 'Lausanne', 'VD', '1983-09-02', 'laura.zimmermann@outlook.com', '+41 079 641 30 35', 1005),
('Jonas', 'Wyss', 'Seestrasse 18', 'Stans', 'NW', '1992-02-21', 'jonas.wyss@proton.me', '+41 079 417 42 69', 6378),
('Leon', 'Suter', 'Schulstrasse 3', 'Sion', 'VS', '1974-04-17', 'leon.suter@gmx.ch', '+41 079 551 95 94', 1959);


-- Create Offering first
INSERT INTO offering (id, name, description) VALUES
(1, 'Life Insurance Application', 'Standard life insurance questionnaire for underwriting assessment');

-- Questionnaire Data
INSERT INTO question (offering_id, title, description, type, type_options) VALUES
(1, 'Height', 'What is your height in cm?', 'NUMBER', NULL),
(1, 'Weight', 'What is your weight in kg?', 'NUMBER', NULL),
(1, 'Smoking Status', 'Are you a smoker?', 'RADIO_BUTTON', 'Yes,No'),
(1, 'Medical Conditions', 'Do you have any medical conditions? (select all that apply)', 'TAGS', 'none,anxiety,insomnia,gastritis,stress,heart disease,back pain,high cholesterol,arthritis,diabetes,asthma,hypertension,other'),
(1, 'Occupation', 'What is your job occupation?', 'TEXT', 'sedentary/office,manual labor,healthcare,emergency services,unemployed,other'),
-- (1, 'Occupation', 'What is your job occupation?', 'TEXT', NULL),
(1, 'Annual Income', 'What is your annual income?', 'NUMBER', NULL),
(1, 'Age', 'What is your age?', 'NUMBER', NULL),
(1, 'Sport Activities', 'What sport activities do you participate in? (select all that apply)', 'TAGS', 'cycling,running,hiking,tennis,gym,dancing,skiing,pilates,swimming,yoga,climbing,boxing,other');


INSERT INTO question_weights (parameter_weight, question_id, weights) VALUES
(0.9, 7, '-,17:0.6;18,30:0.1;31,50:0.2;51,67:0.5;68,|:0.8'),
(0.3, 1, '-,149:0.4;150,165:0.1;166,185:0.1;186,|:0.5'),
(0.7, 2, '-,49:0.5;50,65:0.1;66,85:0.2;86,110:0.6;111,|:0.9'),
(0.5, 6, '-,29999:0.7;30000,80000:0.2;80001,120000:0.1;120001,|:0.1'),
(0.22, 4, 'none:1;stress:0.95;insomnia:0.9;gastritis:0.85;back pain:0.8;anxiety:0.75;high cholesterol:0.65;hypertension:0.55;asthma:0.5;arthritis:0.45;diabetes:0.3;heart disease:0.2;other:0.6'),
(0.18, 5, 'sedentary/office:0.6;manual labor:0.7;healthcare:0.4;emergency services:0.8;unemployed:0.5;other:0.3'),
(0.35, 3, 'No:0.1;Yes:0.5'),
(0.1, 8, 'cycling:0.2;running:0.3;hiking:0.3;tennis:0.4;gym:0.2;dancing:0.3;skiing:0.5;pilates:0.1;swimming:0.1;yoga:0.3;climbing:0.4;boxing:0.7;other:0.2');



-- User Submissions
-- Client 1: 158cm, 55.5kg, Non-smoker, anxiety, Insurance Underwriter, 57002, 26 years, cycling+running
INSERT INTO submission (client_id, question_id, value, type) VALUES
(1, 1, '158', 'NUMBER'),
(1, 2, '55.5', 'NUMBER'),
(1, 3, 'No', 'TEXT'),
(1, 4, 'anxiety', 'TEXT'),
(1, 5, 'Insurance Underwriter', 'TEXT'),
(1, 6, '57002', 'NUMBER'),
(1, 7, '26', 'NUMBER'),
(1, 8, 'cycling; running', 'TEXT');

-- Client 2: 165cm, 56.1kg, Non-smoker, none, Physiotherapist, 129907, 35 years, hiking
INSERT INTO submission (client_id, question_id, value, type) VALUES
(2, 1, '165', 'NUMBER'),
(2, 2, '56.1', 'NUMBER'),
(2, 3, 'No', 'TEXT'),
(2, 4, 'none', 'TEXT'),
(2, 5, 'Physiotherapist', 'TEXT'),
(2, 6, '129907', 'NUMBER'),
(2, 7, '35', 'NUMBER'),
(2, 8, 'hiking', 'TEXT');

-- Client 3: 179cm, 63.6kg, Non-smoker, insomnia, Marketing Specialist, 155842, 26 years, running+tennis
INSERT INTO submission (client_id, question_id, value, type) VALUES
(3, 1, '179', 'NUMBER'),
(3, 2, '63.6', 'NUMBER'),
(3, 3, 'No', 'TEXT'),
(3, 4, 'insomnia', 'TEXT'),
(3, 5, 'Marketing Specialist', 'TEXT'),
(3, 6, '155842', 'NUMBER'),
(3, 7, '26', 'NUMBER'),
(3, 8, 'running; tennis', 'TEXT');

-- Client 4: 182cm, 85.7kg, Non-smoker, gastritis+stress, Sales Manager, 109225, 22 years, gym+hiking+dancing
INSERT INTO submission (client_id, question_id, value, type) VALUES
(4, 1, '182', 'NUMBER'),
(4, 2, '85.7', 'NUMBER'),
(4, 3, 'No', 'TEXT'),
(4, 4, 'gastritis; stress', 'TEXT'),
(4, 5, 'Sales Manager', 'TEXT'),
(4, 6, '109225', 'NUMBER'),
(4, 7, '22', 'NUMBER'),
(4, 8, 'gym; hiking; dancing', 'TEXT');

-- Client 5: 191cm, 104.7kg, Non-smoker, heart disease+back pain+high cholesterol, UX Designer, 35000, 69 years, dancing+skiing+cycling
INSERT INTO submission (client_id, question_id, value, type) VALUES
(5, 1, '191', 'NUMBER'),
(5, 2, '104.7', 'NUMBER'),
(5, 3, 'No', 'TEXT'),
(5, 4, 'heart disease; back pain; high cholesterol', 'TEXT'),
(5, 5, 'UX Designer', 'TEXT'),
(5, 6, '35000', 'NUMBER'),
(5, 7, '69', 'NUMBER'),
(5, 8, 'dancing; skiing; cycling', 'TEXT');

-- Client 6: 187cm, 67.8kg, Non-smoker, arthritis+high cholesterol+back pain, Banking Associate, 79988, 66 years, cycling+pilates
INSERT INTO submission (client_id, question_id, value, type) VALUES
(6, 1, '187', 'NUMBER'),
(6, 2, '67.8', 'NUMBER'),
(6, 3, 'No', 'TEXT'),
(6, 4, 'arthritis; high cholesterol; back pain', 'TEXT'),
(6, 5, 'Banking Associate', 'TEXT'),
(6, 6, '79988', 'NUMBER'),
(6, 7, '66', 'NUMBER'),
(6, 8, 'cycling; pilates', 'TEXT');


-- Question Weights (each row is one value-score pair)

-- Smoking Status weights (question 3)
INSERT INTO question_weights (question_id, offering_id, value_question, score_question) VALUES
(3, 1, 'Yes', 15.0),
(3, 1, 'No', 0.0);

-- Medical Conditions weights (question 4)
INSERT INTO question_weights (question_id, offering_id, value_question, score_question) VALUES
(4, 1, 'none', 0.0),
(4, 1, 'anxiety', 3.0),
(4, 1, 'insomnia', 2.0),
(4, 1, 'gastritis', 4.0),
(4, 1, 'stress', 3.0),
(4, 1, 'heart disease', 20.0),
(4, 1, 'back pain', 5.0),
(4, 1, 'high cholesterol', 8.0),
(4, 1, 'arthritis', 7.0),
(4, 1, 'diabetes', 12.0),
(4, 1, 'asthma', 6.0),
(4, 1, 'hypertension', 10.0),
(4, 1, 'other', 5.0);

-- Sport Activities weights (question 8) - negative scores reduce risk
INSERT INTO question_weights (question_id, offering_id, value_question, score_question) VALUES
(8, 1, 'cycling', -2.0),
(8, 1, 'running', -3.0),
(8, 1, 'hiking', -2.0),
(8, 1, 'tennis', -2.0),
(8, 1, 'gym', -3.0),
(8, 1, 'dancing', -1.0),
(8, 1, 'skiing', -2.0),
(8, 1, 'pilates', -1.0),
(8, 1, 'swimming', -3.0),
(8, 1, 'yoga', -1.0),
(8, 1, 'climbing', -4.0),
(8, 1, 'boxing', -5.0),
(8, 1, 'other', 0.0);