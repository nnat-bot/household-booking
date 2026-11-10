-- test data for development, all the names and reviews are made up
-- the password for every test account is password123
-- weekday: 0 = Sunday, 1 = Monday ... 6 = Saturday

-- the two customer accounts
insert into users (name, email, password_hash, role) values
  ('Anna Virtanen', 'anna@example.com', '$2b$10$Ad5U58M6oRNBwUwjgu8Yv.LdIaExYEnbIgK3Dd82kq36FL6VpYgq2', 'customer'),
  ('Mikko Laine', 'mikko@example.com', '$2b$10$Ad5U58M6oRNBwUwjgu8Yv.LdIaExYEnbIgK3Dd82kq36FL6VpYgq2', 'customer');

-- the cleaner accounts
insert into users (name, email, password_hash, role, avatar_url, bio, hourly_rate) values
  ('Sofia Nieminen', 'sofia@example.com', '$2b$10$Ad5U58M6oRNBwUwjgu8Yv.LdIaExYEnbIgK3Dd82kq36FL6VpYgq2', 'provider',
   'https://i.pravatar.cc/150?img=47', 'Cleaning apartments in Helsinki for 5 years. I bring my own eco-friendly products.', 28.00),
  ('Elena Petrova', 'elena@example.com', '$2b$10$Ad5U58M6oRNBwUwjgu8Yv.LdIaExYEnbIgK3Dd82kq36FL6VpYgq2', 'provider',
   'https://i.pravatar.cc/150?img=45', 'I do deep cleaning and ovens. Flexible with evening hours.', 25.00),
  ('Linh Tran', 'linh@example.com', '$2b$10$Ad5U58M6oRNBwUwjgu8Yv.LdIaExYEnbIgK3Dd82kq36FL6VpYgq2', 'provider',
   'https://i.pravatar.cc/150?img=32', 'Windows and balcony glass are my speciality. Working in Espoo and Helsinki.', 26.50),
  ('Maria Koskinen', 'maria@example.com', '$2b$10$Ad5U58M6oRNBwUwjgu8Yv.LdIaExYEnbIgK3Dd82kq36FL6VpYgq2', 'provider',
   'https://i.pravatar.cc/150?img=20', 'Move-out cleaning with a checklist so you get the deposit back.', 30.00),
  ('Olga Ivanova', 'olga@example.com', '$2b$10$Ad5U58M6oRNBwUwjgu8Yv.LdIaExYEnbIgK3Dd82kq36FL6VpYgq2', 'provider',
   'https://i.pravatar.cc/150?img=23', 'Used to work for a cleaning company, now independent. Pets are no problem.', 24.00),
  ('Daniel Makinen', 'daniel@example.com', '$2b$10$Ad5U58M6oRNBwUwjgu8Yv.LdIaExYEnbIgK3Dd82kq36FL6VpYgq2', 'provider',
   'https://i.pravatar.cc/150?img=12', 'Student doing cleaning in the afternoons and weekends.', 27.00);

-- services, two for each cleaner
insert into services (provider_id, category, title, description, price_from) values
  (3, 'standard', 'Standard home cleaning', 'Regular cleaning of kitchen, bathroom and living areas.', 28.00),
  (3, 'window', 'Window cleaning', 'Inside and outside window washing for apartments.', 22.00),
  (4, 'deep', 'Deep cleaning', 'Thorough cleaning including appliances and cupboards.', 25.00),
  (4, 'standard', 'Standard home cleaning', 'Weekly or biweekly apartment cleaning.', 24.00),
  (5, 'window', 'Window cleaning', 'Window washing, balcony glass included.', 26.50),
  (5, 'standard', 'Standard home cleaning', 'Basic cleaning for small apartments.', 23.00),
  (6, 'moveout', 'Move-out cleaning', 'Full cleaning before handing over the keys.', 30.00),
  (6, 'deep', 'Deep cleaning', 'Kitchen, bathroom and floors cleaned in detail.', 29.00),
  (7, 'standard', 'Standard home cleaning', 'Cleaning for families with children or pets.', 24.00),
  (7, 'moveout', 'Move-out cleaning', 'Cleaning for rental inspections.', 28.00),
  (8, 'deep', 'Deep cleaning', 'Spring cleaning for bigger homes.', 27.00),
  (8, 'standard', 'Standard home cleaning', 'Light cleaning and tidying.', 25.00);

-- working hours for every cleaner
insert into availability (provider_id, weekday, start_time, end_time) values
  (3, 1, '08:00', '16:00'), (3, 2, '08:00', '16:00'), (3, 3, '08:00', '16:00'),
  (3, 4, '08:00', '16:00'), (3, 5, '08:00', '16:00'),
  (4, 1, '09:00', '15:00'), (4, 2, '09:00', '15:00'), (4, 3, '09:00', '15:00'),
  (4, 4, '09:00', '15:00'), (4, 5, '09:00', '15:00'),
  (5, 1, '10:00', '18:00'), (5, 3, '10:00', '18:00'), (5, 5, '10:00', '18:00'),
  (6, 2, '08:00', '14:00'), (6, 4, '08:00', '14:00'), (6, 6, '08:00', '14:00'),
  (7, 1, '07:00', '15:00'), (7, 2, '07:00', '15:00'), (7, 3, '07:00', '15:00'),
  (7, 4, '07:00', '15:00'), (7, 5, '07:00', '15:00'),
  (8, 3, '12:00', '20:00'), (8, 4, '12:00', '20:00'), (8, 5, '12:00', '20:00'),
  (8, 6, '12:00', '20:00');

-- bookings, one of each status and some finished ones so the profiles have reviews
insert into bookings (customer_id, provider_id, service_id, booking_date, start_time, end_time, status, estimated_price) values
  (1, 3, 1, current_date + 4, '10:00', '13:00', 'pending', 84.00),
  (1, 4, 3, current_date + 7, '09:00', '12:00', 'confirmed', 75.00),
  (2, 6, 7, current_date + 2, '13:00', '17:00', 'confirmed', 120.00),
  (2, 7, 10, current_date - 3, '08:00', '12:00', 'declined', 112.00),
  (2, 3, 1, current_date - 6, '10:00', '12:00', 'cancelled', 56.00),
  (1, 5, 5, current_date - 10, '14:00', '16:00', 'completed', 53.00),
  (1, 8, 11, current_date - 20, '09:00', '13:00', 'completed', 108.00),
  (2, 4, 4, current_date - 14, '09:00', '12:00', 'completed', 72.00),
  (1, 6, 8, current_date - 25, '08:00', '11:00', 'completed', 87.00),
  (2, 5, 6, current_date - 30, '10:00', '13:00', 'completed', 69.00),
  (1, 7, 9, current_date - 18, '07:00', '10:00', 'completed', 72.00),
  (2, 8, 12, current_date - 9, '12:00', '15:00', 'completed', 75.00),
  (1, 3, 2, current_date - 35, '11:00', '13:00', 'completed', 44.00),
  (2, 6, 7, current_date - 40, '08:00', '12:00', 'completed', 120.00);

-- reviews for the bookings that are finished
insert into reviews (booking_id, rating, comment) values
  (6, 5, 'Very careful with the windows, everything was spotless.'),
  (7, 4, 'Good job overall, arrived a bit late.'),
  (8, 5, 'Friendly and fast, will book again.'),
  (9, 5, 'The kitchen looks brand new.'),
  (10, 4, 'Nice work for the price.'),
  (11, 3, 'Cleaning was fine but the bathroom mirror was missed.'),
  (12, 5, 'Very easy to communicate with.'),
  (13, 4, 'Windows are clean, happy with the result.'),
  (14, 5, 'Perfect move-out cleaning, got the deposit back.');

-- some chat messages between customers and cleaners
insert into messages (booking_id, sender_id, body) values
  (1, 1, 'Hi, is it ok if I leave the key with the neighbour?'),
  (1, 3, 'Hello! Yes that works fine.'),
  (1, 1, 'Great, thank you.'),
  (2, 1, 'Could you also clean the oven?'),
  (2, 4, 'Sure, that is included in deep cleaning.'),
  (3, 2, 'We have a cat, is that a problem?'),
  (3, 6, 'Not at all, see you on Friday.'),
  (6, 1, 'Thanks for today!');
