-- ============================================
-- FoodExpress Dummy Data Seeding Script
-- Password for all users: Password@123
-- Hash: $2a$12$jmyCQfCQTH20rxbcYRPDEumssETWrSZMFImNtbtLYMfPduBp2mpPq
-- ============================================

USE user_db;

-- ============================================
-- 1. USERS (4 users with different roles)
-- ============================================

INSERT INTO users (name, email, phone, password, role, is_active, created_at, updated_at)
VALUES 
('Admin User', 'admin@gmail.com', '+1234567890', '$2a$12$jmyCQfCQTH20rxbcYRPDEumssETWrSZMFImNtbtLYMfPduBp2mpPq', 'ADMIN', true, NOW(), NOW()),
('Restaurant Owner', 'owner@gmail.com', '+1234567891', '$2a$12$jmyCQfCQTH20rxbcYRPDEumssETWrSZMFImNtbtLYMfPduBp2mpPq', 'RESTAURANT_OWNER', true, NOW(), NOW()),
('Delivery Agent', 'agent@gmail.com', '+1234567892', '$2a$12$jmyCQfCQTH20rxbcYRPDEumssETWrSZMFImNtbtLYMfPduBp2mpPq', 'DELIVERY_AGENT', true, NOW(), NOW()),
('Customer User', 'customer@gmail.com', '+1234567893', '$2a$12$jmyCQfCQTH20rxbcYRPDEumssETWrSZMFImNtbtLYMfPduBp2mpPq', 'CUSTOMER', true, NOW(), NOW());

-- ============================================
-- 2. RESTAURANTS (All owned by owner@gmail.com)
-- ============================================

USE restaurant_db;

-- Get owner ID (should be 2 since admin is 1)
SET @owner_id = 2;

INSERT INTO restaurants (name, description, address, phone, email, cuisine, rating, estimated_delivery_time, delivery_fee, is_active, owner_id, image_url, opening_time, closing_time, total_reviews, created_at, updated_at)
VALUES 
-- Restaurant 1: Italian
('Bella Italia', 'Authentic Italian cuisine with fresh pasta and wood-fired pizzas', '123 Main Street, Downtown', '+1234567910', 'contact@bellaitalia.com', 'Italian', 4.5, 30, 3.99, true, @owner_id, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', '10:00', '22:00', 150, NOW(), NOW()),

-- Restaurant 2: Mexican
('El Mariachi', 'Traditional Mexican flavors with a modern twist', '456 Oak Avenue, Midtown', '+1234567911', 'info@elmariachi.com', 'Mexican', 4.7, 25, 2.99, true, @owner_id, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800', '11:00', '23:00', 200, NOW(), NOW()),

-- Restaurant 3: Chinese
('Golden Dragon', 'Exquisite Chinese dishes from various regions', '789 Pine Road, Eastside', '+1234567912', 'hello@goldendragon.com', 'Chinese', 4.6, 35, 4.99, true, @owner_id, 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800', '11:30', '22:30', 180, NOW(), NOW()),

-- Restaurant 4: American
('The Burger Joint', 'Gourmet burgers and classic American comfort food', '321 Elm Street, Westside', '+1234567913', 'orders@burgerjoint.com', 'American', 4.4, 20, 2.49, true, @owner_id, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', '10:00', '23:00', 220, NOW(), NOW()),

-- Restaurant 5: Middle Eastern
('Sahara Nights', 'Authentic Middle Eastern cuisine and mezze', '654 Cedar Lane, Northside', '+1234567914', 'contact@saharanights.com', 'Middle Eastern', 4.8, 28, 3.49, true, @owner_id, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800', '12:00', '23:00', 160, NOW(), NOW()),

-- Restaurant 6: Japanese
('Sakura Sushi', 'Fresh sushi and traditional Japanese dishes', '987 Maple Drive, Central', '+1234567915', 'info@sakurasushi.com', 'Japanese', 4.9, 40, 5.99, true, @owner_id, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800', '12:00', '22:00', 250, NOW(), NOW()),

-- Restaurant 7: Indian
('Spice Garden', 'Aromatic Indian curries and tandoori specialties', '147 Birch Street, Southside', '+1234567916', 'hello@spicegarden.com', 'Indian', 4.5, 32, 3.99, true, @owner_id, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', '11:00', '22:30', 175, NOW(), NOW()),

-- Restaurant 8: Thai
('Bangkok Street', 'Authentic Thai street food and curries', '258 Willow Avenue, Downtown', '+1234567917', 'orders@bangkokstreet.com', 'Thai', 4.6, 27, 2.99, true, @owner_id, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800', '11:00', '22:00', 190, NOW(), NOW()),

-- Restaurant 9: Mediterranean
('Olive Grove', 'Fresh Mediterranean dishes with Greek influences', '369 Spruce Road, Midtown', '+1234567918', 'contact@olivegrove.com', 'Mediterranean', 4.7, 30, 3.49, true, @owner_id, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', '11:30', '23:00', 165, NOW(), NOW()),

-- Restaurant 10: French
('Le Petit Bistro', 'Classic French cuisine in an intimate setting', '741 Ash Lane, Eastside', '+1234567919', 'info@lepetitbistro.com', 'French', 4.8, 45, 4.99, true, @owner_id, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', '17:00', '23:00', 140, NOW(), NOW()),

-- Restaurant 11: Korean
('Seoul Kitchen', 'Modern Korean BBQ and traditional dishes', '852 Bamboo Street, Westside', '+1234567920', 'contact@seoulkitchen.com', 'Korean', 4.7, 33, 3.99, true, @owner_id, 'https://images.unsplash.com/photo-1580554530778-ca36943938b2?w=800', '11:00', '23:00', 185, NOW(), NOW()),

-- Restaurant 12: Vietnamese
('Pho Paradise', 'Authentic Vietnamese pho and banh mi', '963 Lotus Avenue, Northside', '+1234567921', 'info@phoparadise.com', 'Vietnamese', 4.6, 26, 2.49, true, @owner_id, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800', '10:00', '21:00', 195, NOW(), NOW()),

-- Restaurant 13: Spanish
('Tapas Barcelona', 'Spanish tapas and paella specialties', '159 Olive Street, Central', '+1234567922', 'hello@tapasbarcelona.com', 'Spanish', 4.8, 35, 4.49, true, @owner_id, 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800', '12:00', '00:00', 170, NOW(), NOW()),

-- Restaurant 14: Brazilian
('Rio Grill', 'Brazilian churrasco and traditional dishes', '357 Palm Avenue, Southside', '+1234567923', 'orders@riogrill.com', 'Brazilian', 4.5, 38, 4.99, true, @owner_id, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800', '17:00', '23:30', 155, NOW(), NOW()),

-- Restaurant 15: Caribbean
('Island Spice', 'Caribbean jerk chicken and tropical flavors', '486 Coconut Lane, Downtown', '+1234567924', 'contact@islandspice.com', 'Caribbean', 4.6, 29, 3.49, true, @owner_id, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', '11:00', '22:00', 145, NOW(), NOW());

-- ============================================
-- 3. MENU ITEMS
-- ============================================

-- Bella Italia Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(1, 'Margherita Pizza', 'Classic pizza with tomato, mozzarella, and fresh basil', 12.99, 'Main Course', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', true, true, NOW(), NOW()),
(1, 'Spaghetti Carbonara', 'Creamy pasta with pancetta and parmesan', 14.99, 'Main Course', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', true, false, NOW(), NOW()),
(1, 'Lasagna Bolognese', 'Layered pasta with meat sauce and béchamel', 15.99, 'Main Course', 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400', true, false, NOW(), NOW()),
(1, 'Caprese Salad', 'Fresh tomatoes, mozzarella, and basil', 8.99, 'Appetizer', 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400', true, true, NOW(), NOW()),
(1, 'Tiramisu', 'Classic Italian coffee-flavored dessert', 6.99, 'Dessert', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', true, true, NOW(), NOW());

-- El Mariachi Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(2, 'Chicken Tacos', 'Three soft tacos with grilled chicken and salsa', 11.99, 'Main Course', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', true, false, NOW(), NOW()),
(2, 'Beef Burrito', 'Large burrito with seasoned beef, rice, and beans', 13.99, 'Main Course', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', true, false, NOW(), NOW()),
(2, 'Vegetarian Quesadilla', 'Grilled tortilla with cheese and vegetables', 10.99, 'Main Course', 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400', true, true, NOW(), NOW()),
(2, 'Guacamole & Chips', 'Fresh guacamole with crispy tortilla chips', 7.99, 'Appetizer', 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400', true, true, NOW(), NOW()),
(2, 'Churros', 'Fried dough pastry with cinnamon sugar', 5.99, 'Dessert', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400', true, true, NOW(), NOW());

-- Golden Dragon Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(3, 'Kung Pao Chicken', 'Spicy stir-fried chicken with peanuts', 13.99, 'Main Course', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400', true, false, NOW(), NOW()),
(3, 'Sweet & Sour Pork', 'Crispy pork in tangy sweet and sour sauce', 14.99, 'Main Course', 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400', true, false, NOW(), NOW()),
(3, 'Vegetable Fried Rice', 'Wok-fried rice with mixed vegetables', 9.99, 'Main Course', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', true, true, NOW(), NOW()),
(3, 'Spring Rolls', 'Crispy vegetable spring rolls with dipping sauce', 6.99, 'Appetizer', 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=400', true, true, NOW(), NOW()),
(3, 'Mango Pudding', 'Creamy mango dessert', 5.99, 'Dessert', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', true, true, NOW(), NOW());

-- The Burger Joint Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(4, 'Classic Cheeseburger', 'Beef patty with cheese, lettuce, and tomato', 11.99, 'Main Course', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', true, false, NOW(), NOW()),
(4, 'BBQ Bacon Burger', 'Burger with bacon, BBQ sauce, and onion rings', 13.99, 'Main Course', 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', true, false, NOW(), NOW()),
(4, 'Veggie Burger', 'Plant-based patty with avocado and sprouts', 10.99, 'Main Course', 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400', true, true, NOW(), NOW()),
(4, 'Loaded Fries', 'Fries topped with cheese, bacon, and sour cream', 7.99, 'Appetizer', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', true, false, NOW(), NOW()),
(4, 'Chocolate Milkshake', 'Thick and creamy chocolate shake', 5.99, 'Dessert', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', true, true, NOW(), NOW());

-- Sahara Nights Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(5, 'Chicken Shawarma', 'Marinated chicken wrapped in pita bread', 12.99, 'Main Course', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', true, false, NOW(), NOW()),
(5, 'Lamb Kebab', 'Grilled lamb skewers with rice and salad', 16.99, 'Main Course', 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400', true, false, NOW(), NOW()),
(5, 'Falafel Plate', 'Crispy chickpea fritters with tahini sauce', 11.99, 'Main Course', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', true, true, NOW(), NOW()),
(5, 'Hummus & Pita', 'Creamy hummus with warm pita bread', 6.99, 'Appetizer', 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400', true, true, NOW(), NOW()),
(5, 'Baklava', 'Sweet pastry with nuts and honey', 5.99, 'Dessert', 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400', true, true, NOW(), NOW());

-- Sakura Sushi Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(6, 'California Roll', 'Crab, avocado, and cucumber roll', 10.99, 'Main Course', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', true, false, NOW(), NOW()),
(6, 'Salmon Nigiri', 'Fresh salmon over pressed rice (6 pieces)', 14.99, 'Main Course', 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400', true, false, NOW(), NOW()),
(6, 'Vegetable Tempura', 'Lightly battered and fried vegetables', 9.99, 'Appetizer', 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=400', true, true, NOW(), NOW()),
(6, 'Miso Soup', 'Traditional Japanese soup with tofu', 4.99, 'Appetizer', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400', true, true, NOW(), NOW()),
(6, 'Mochi Ice Cream', 'Japanese rice cake with ice cream filling', 6.99, 'Dessert', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', true, true, NOW(), NOW());

-- Spice Garden Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(7, 'Chicken Tikka Masala', 'Creamy tomato curry with grilled chicken', 14.99, 'Main Course', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', true, false, NOW(), NOW()),
(7, 'Lamb Biryani', 'Fragrant rice with spiced lamb', 16.99, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', true, false, NOW(), NOW()),
(7, 'Palak Paneer', 'Spinach curry with Indian cottage cheese', 12.99, 'Main Course', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', true, true, NOW(), NOW()),
(7, 'Samosas', 'Crispy pastries filled with spiced potatoes', 6.99, 'Appetizer', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', true, true, NOW(), NOW()),
(7, 'Gulab Jamun', 'Sweet milk dumplings in syrup', 5.99, 'Dessert', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', true, true, NOW(), NOW());

-- Bangkok Street Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(8, 'Pad Thai', 'Stir-fried rice noodles with shrimp', 13.99, 'Main Course', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', true, false, NOW(), NOW()),
(8, 'Green Curry', 'Spicy coconut curry with chicken', 14.99, 'Main Course', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', true, false, NOW(), NOW()),
(8, 'Vegetable Pad See Ew', 'Wide rice noodles with vegetables', 11.99, 'Main Course', 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400', true, true, NOW(), NOW()),
(8, 'Tom Yum Soup', 'Spicy and sour Thai soup', 7.99, 'Appetizer', 'https://images.unsplash.com/photo-1547928576-94a4f1e1c0e3?w=400', true, false, NOW(), NOW()),
(8, 'Mango Sticky Rice', 'Sweet sticky rice with fresh mango', 6.99, 'Dessert', 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400', true, true, NOW(), NOW());

-- Olive Grove Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(9, 'Greek Gyro', 'Pita wrap with lamb, tzatziki, and vegetables', 12.99, 'Main Course', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', true, false, NOW(), NOW()),
(9, 'Moussaka', 'Layered eggplant and meat casserole', 15.99, 'Main Course', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', true, false, NOW(), NOW()),
(9, 'Greek Salad', 'Fresh vegetables with feta and olives', 9.99, 'Appetizer', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', true, true, NOW(), NOW()),
(9, 'Spanakopita', 'Spinach and feta cheese pie', 8.99, 'Appetizer', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', true, true, NOW(), NOW()),
(9, 'Baklava', 'Layered pastry with nuts and honey', 6.99, 'Dessert', 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400', true, true, NOW(), NOW());

-- Le Petit Bistro Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(10, 'Coq au Vin', 'Chicken braised in red wine', 18.99, 'Main Course', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', true, false, NOW(), NOW()),
(10, 'Beef Bourguignon', 'Slow-cooked beef in burgundy wine', 22.99, 'Main Course', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400', true, false, NOW(), NOW()),
(10, 'Ratatouille', 'Provençal vegetable stew', 14.99, 'Main Course', 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=400', true, true, NOW(), NOW()),
(10, 'French Onion Soup', 'Classic soup with caramelized onions', 8.99, 'Appetizer', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', true, true, NOW(), NOW()),
(10, 'Crème Brûlée', 'Vanilla custard with caramelized sugar', 7.99, 'Dessert', 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400', true, true, NOW(), NOW());

-- Seoul Kitchen Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(11, 'Bulgogi', 'Marinated beef BBQ with vegetables', 16.99, 'Main Course', 'https://images.unsplash.com/photo-1580554530778-ca36943938b2?w=400', true, false, NOW(), NOW()),
(11, 'Bibimbap', 'Mixed rice bowl with vegetables and egg', 13.99, 'Main Course', 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400', true, true, NOW(), NOW()),
(11, 'Korean Fried Chicken', 'Crispy chicken with spicy sauce', 14.99, 'Main Course', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400', true, false, NOW(), NOW()),
(11, 'Kimchi Pancake', 'Savory pancake with fermented vegetables', 8.99, 'Appetizer', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', true, true, NOW(), NOW()),
(11, 'Bingsu', 'Shaved ice dessert with sweet toppings', 7.99, 'Dessert', 'https://images.unsplash.com/photo-1567327684231-bd3b6c8c5e3f?w=400', true, true, NOW(), NOW());

-- Pho Paradise Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(12, 'Pho Bo', 'Traditional beef noodle soup', 12.99, 'Main Course', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400', true, false, NOW(), NOW()),
(12, 'Banh Mi', 'Vietnamese sandwich with pork and pickles', 9.99, 'Main Course', 'https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=400', true, false, NOW(), NOW()),
(12, 'Bun Cha', 'Grilled pork with vermicelli noodles', 13.99, 'Main Course', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', true, false, NOW(), NOW()),
(12, 'Fresh Spring Rolls', 'Rice paper rolls with shrimp and herbs', 7.99, 'Appetizer', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', true, false, NOW(), NOW()),
(12, 'Che Ba Mau', 'Three-color dessert with beans and coconut', 5.99, 'Dessert', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', true, true, NOW(), NOW());

-- Tapas Barcelona Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(13, 'Paella Valenciana', 'Traditional Spanish rice with seafood', 19.99, 'Main Course', 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400', true, false, NOW(), NOW()),
(13, 'Patatas Bravas', 'Crispy potatoes with spicy tomato sauce', 8.99, 'Appetizer', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', true, true, NOW(), NOW()),
(13, 'Gambas al Ajillo', 'Garlic shrimp in olive oil', 15.99, 'Main Course', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', true, false, NOW(), NOW()),
(13, 'Jamón Ibérico', 'Premium cured ham with bread', 16.99, 'Appetizer', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400', true, false, NOW(), NOW()),
(13, 'Churros con Chocolate', 'Fried dough with hot chocolate', 6.99, 'Dessert', 'https://images.unsplash.com/photo-1543257580-7269da773bf5?w=400', true, true, NOW(), NOW());

-- Rio Grill Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(14, 'Picanha Steak', 'Brazilian sirloin cap with chimichurri', 24.99, 'Main Course', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400', true, false, NOW(), NOW()),
(14, 'Feijoada', 'Black bean stew with pork and sausage', 17.99, 'Main Course', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', true, false, NOW(), NOW()),
(14, 'Moqueca', 'Brazilian fish stew with coconut milk', 18.99, 'Main Course', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', true, false, NOW(), NOW()),
(14, 'Pão de Queijo', 'Brazilian cheese bread', 6.99, 'Appetizer', 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400', true, true, NOW(), NOW()),
(14, 'Brigadeiro', 'Chocolate truffle dessert', 5.99, 'Dessert', 'https://images.unsplash.com/photo-1606312619070-d48b4cda8bf6?w=400', true, true, NOW(), NOW());

-- Island Spice Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available, is_vegetarian, created_at, updated_at)
VALUES 
(15, 'Jerk Chicken', 'Spicy grilled chicken with Caribbean spices', 14.99, 'Main Course', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', true, false, NOW(), NOW()),
(15, 'Curry Goat', 'Tender goat meat in curry sauce', 16.99, 'Main Course', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', true, false, NOW(), NOW()),
(15, 'Ackee and Saltfish', 'Jamaican national dish with vegetables', 15.99, 'Main Course', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', true, false, NOW(), NOW()),
(15, 'Plantain Chips', 'Crispy fried plantains with dipping sauce', 6.99, 'Appetizer', 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400', true, true, NOW(), NOW()),
(15, 'Rum Cake', 'Moist cake soaked in Caribbean rum', 7.99, 'Dessert', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', true, true, NOW(), NOW());

-- ============================================
-- SUMMARY
-- ============================================

SELECT '=== SEEDING COMPLETE ===' AS '';
SELECT CONCAT('Total Users: ', COUNT(*)) AS 'User Count' FROM user_db.users;
SELECT CONCAT('Total Restaurants: ', COUNT(*)) AS 'Restaurant Count' FROM restaurant_db.restaurants;
SELECT CONCAT('Total Menu Items: ', COUNT(*)) AS 'Menu Item Count' FROM restaurant_db.menu_items;

SELECT '' AS '';
SELECT '=== USER CREDENTIALS ===' AS '';
SELECT 'All users have password: Password@123' AS '';
SELECT '' AS '';

SELECT 'Role' AS 'Role', 'Email' AS 'Email', 'Name' AS 'Name' FROM (
    SELECT 'ADMIN' AS 'Role', email AS 'Email', name AS 'Name' FROM user_db.users WHERE role = 'ADMIN'
    UNION ALL
    SELECT 'OWNER' AS 'Role', email AS 'Email', name AS 'Name' FROM user_db.users WHERE role = 'RESTAURANT_OWNER'
    UNION ALL
    SELECT 'AGENT' AS 'Role', email AS 'Email', name AS 'Name' FROM user_db.users WHERE role = 'DELIVERY_AGENT'
    UNION ALL
    SELECT 'CUSTOMER' AS 'Role', email AS 'Email', name AS 'Name' FROM user_db.users WHERE role = 'CUSTOMER'
) AS all_users
ORDER BY 
    CASE Role
        WHEN 'ADMIN' THEN 1
        WHEN 'OWNER' THEN 2
        WHEN 'AGENT' THEN 3
        WHEN 'CUSTOMER' THEN 4
    END;
