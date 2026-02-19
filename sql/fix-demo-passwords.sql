-- Fix demo user passwords
UPDATE users SET password = '$2a$10$uXoHUxdDgn1Lb9rAonBV5OGYHQudSh.ALmmEC.0T9AgukGcIM0KCO' WHERE email = 'customer@test.com';
UPDATE users SET password = '$2a$10$uXoHUxdDgn1Lb9rAonBV5OGYHQudSh.ALmmEC.0T9AgukGcIM0KCO' WHERE email = 'owner@test.com';
UPDATE users SET password = '$2a$10$uXoHUxdDgn1Lb9rAonBV5OGYHQudSh.ALmmEC.0T9AgukGcIM0KCO' WHERE email = 'agent@test.com';
UPDATE users SET password = '$2a$10$uXoHUxdDgn1Lb9rAonBV5OGYHQudSh.ALmmEC.0T9AgukGcIM0KCO' WHERE email = 'admin@test.com';
