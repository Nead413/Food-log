-- Add test users with known passwords
INSERT INTO "user" (username, email, password, height, height_unit, weight, weight_unit, desired_weight, sex, dob) 
VALUES 
('demo', 'demo@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', '5''8"', 'ft', '70', 'kg', '65', 'Male', '1990-01-01');

-- Add a simple test user with password "password123"
INSERT INTO "user" (username, email, password, height, height_unit, weight, weight_unit, desired_weight, sex, dob) 
VALUES 
('test', 'test@example.com', '$2a$10$9tWNGK8wZgoHQeBL3ZEZKOhZnKIXYUFpRjPaJQWq1V95AQ19o9br6', '180', 'cm', '80', 'kg', '75', 'Male', '2000-01-01');

-- Add another user
INSERT INTO "user" (username, email, password, height, height_unit, weight, weight_unit, desired_weight, sex, dob) 
VALUES 
('user1', 'user1@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', '170', 'cm', '65', 'kg', '60', 'Female', '1995-05-15');

-- Food logs
INSERT INTO food_log (food_name, calories, date, user_id)
VALUES 
('Oatmeal', 150, '2024-01-20', 1),
('Chicken Salad', 350, '2024-01-20', 1);

-- Exercise logs  
INSERT INTO exercise_log (exercise_name, duration, date, user_id)
VALUES 
('Running', 30, '2024-01-20', 1),
('Yoga', 45, '2024-01-20', 1);
