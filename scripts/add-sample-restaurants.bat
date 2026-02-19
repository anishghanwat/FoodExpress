@echo off
echo ========================================
echo Adding Sample Restaurants and Menu Items
echo ========================================
echo.

REM Restaurant 1: Pizza Palace
echo Adding Pizza Palace...
curl -X POST http://localhost:8080/api/restaurants ^
  -H "Content-Type: application/json" ^
  -d "{\"ownerId\":1,\"name\":\"Pizza Palace\",\"description\":\"Authentic Italian pizzas with fresh ingredients\",\"address\":\"123 Main St, Downtown\",\"phone\":\"555-0101\",\"email\":\"contact@pizzapalace.com\",\"imageUrl\":\"https://images.unsplash.com/photo-1513104890138-7c749659a591\",\"cuisine\":\"Italian\",\"rating\":4.5,\"totalReviews\":120,\"openingTime\":\"11:00\",\"closingTime\":\"23:00\",\"deliveryFee\":40.00,\"estimatedDeliveryTime\":30}"
echo.
echo.

REM Restaurant 2: Burger Hub
echo Adding Burger Hub...
curl -X POST http://localhost:8080/api/restaurants ^
  -H "Content-Type: application/json" ^
  -d "{\"ownerId\":1,\"name\":\"Burger Hub\",\"description\":\"Juicy burgers and crispy fries\",\"address\":\"456 Oak Ave, Midtown\",\"phone\":\"555-0102\",\"email\":\"info@burgerhub.com\",\"imageUrl\":\"https://images.unsplash.com/photo-1568901346375-23c9450c58cd\",\"cuisine\":\"American\",\"rating\":4.7,\"totalReviews\":250,\"openingTime\":\"10:00\",\"closingTime\":\"22:00\",\"deliveryFee\":30.00,\"estimatedDeliveryTime\":25}"
echo.
echo.

REM Restaurant 3: Sushi Express
echo Adding Sushi Express...
curl -X POST http://localhost:8080/api/restaurants ^
  -H "Content-Type: application/json" ^
  -d "{\"ownerId\":1,\"name\":\"Sushi Express\",\"description\":\"Fresh sushi and Japanese cuisine\",\"address\":\"789 Pine Rd, Uptown\",\"phone\":\"555-0103\",\"email\":\"hello@sushiexpress.com\",\"imageUrl\":\"https://images.unsplash.com/photo-1579584425555-c3ce17fd4351\",\"cuisine\":\"Japanese\",\"rating\":4.3,\"totalReviews\":89,\"openingTime\":\"12:00\",\"closingTime\":\"22:00\",\"deliveryFee\":60.00,\"estimatedDeliveryTime\":35}"
echo.
echo.

REM Restaurant 4: Taco Fiesta
echo Adding Taco Fiesta...
curl -X POST http://localhost:8080/api/restaurants ^
  -H "Content-Type: application/json" ^
  -d "{\"ownerId\":1,\"name\":\"Taco Fiesta\",\"description\":\"Authentic Mexican street food\",\"address\":\"321 Elm St, Westside\",\"phone\":\"555-0104\",\"email\":\"orders@tacofiesta.com\",\"imageUrl\":\"https://images.unsplash.com/photo-1565299585323-38d6b0865b47\",\"cuisine\":\"Mexican\",\"rating\":4.8,\"totalReviews\":310,\"openingTime\":\"11:00\",\"closingTime\":\"23:00\",\"deliveryFee\":35.00,\"estimatedDeliveryTime\":20}"
echo.
echo.

REM Restaurant 5: Curry House
echo Adding Curry House...
curl -X POST http://localhost:8080/api/restaurants ^
  -H "Content-Type: application/json" ^
  -d "{\"ownerId\":1,\"name\":\"Curry House\",\"description\":\"Spicy Indian curries and tandoori\",\"address\":\"654 Maple Dr, Eastside\",\"phone\":\"555-0105\",\"email\":\"info@curryhouse.com\",\"imageUrl\":\"https://images.unsplash.com/photo-1585937421612-70a008356fbe\",\"cuisine\":\"Indian\",\"rating\":4.2,\"totalReviews\":67,\"openingTime\":\"11:30\",\"closingTime\":\"22:30\",\"deliveryFee\":40.00,\"estimatedDeliveryTime\":40}"
echo.
echo.

echo ========================================
echo Adding Menu Items for Pizza Palace (ID: 1)
echo ========================================
echo.

REM Pizza Palace Menu Items
curl -X POST http://localhost:8080/api/menu ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":1,\"name\":\"Margherita Pizza\",\"description\":\"Classic tomato, mozzarella, and basil\",\"price\":299.00,\"imageUrl\":\"https://images.unsplash.com/photo-1574071318508-1cdbab80d002\",\"category\":\"Pizza\",\"isVegetarian\":true}"
echo.

curl -X POST http://localhost:8080/api/menu ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":1,\"name\":\"Pepperoni Pizza\",\"description\":\"Loaded with pepperoni and cheese\",\"price\":449.00,\"imageUrl\":\"https://images.unsplash.com/photo-1628840042765-356cda07504e\",\"category\":\"Pizza\",\"isVegetarian\":false}"
echo.

curl -X POST http://localhost:8080/api/menu ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":1,\"name\":\"Veggie Supreme\",\"description\":\"Bell peppers, onions, mushrooms, olives\",\"price\":399.00,\"imageUrl\":\"https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f\",\"category\":\"Pizza\",\"isVegetarian\":true}"
echo.

curl -X POST http://localhost:8080/api/menu ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":1,\"name\":\"Garlic Bread\",\"description\":\"Toasted bread with garlic butter\",\"price\":129.00,\"imageUrl\":\"https://images.unsplash.com/photo-1573140401552-388e3ead0b5e\",\"category\":\"Sides\",\"isVegetarian\":true}"
echo.

echo ========================================
echo Adding Menu Items for Burger Hub (ID: 2)
echo ========================================
echo.

curl -X POST http://localhost:8080/api/menu ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":2,\"name\":\"Classic Cheeseburger\",\"description\":\"Beef patty with cheese, lettuce, tomato\",\"price\":199.00,\"imageUrl\":\"https://images.unsplash.com/photo-1568901346375-23c9450c58cd\",\"category\":\"Burgers\",\"isVegetarian\":false}"
echo.

curl -X POST http://localhost:8080/api/menu ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":2,\"name\":\"Bacon Burger\",\"description\":\"Double beef with crispy bacon\",\"price\":249.00,\"imageUrl\":\"https://images.unsplash.com/photo-1553979459-d2229ba7433b\",\"category\":\"Burgers\",\"isVegetarian\":false}"
echo.

curl -X POST http://localhost:8080/api/menu ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":2,\"name\":\"Veggie Burger\",\"description\":\"Plant-based patty with fresh veggies\",\"price\":179.00,\"imageUrl\":\"https://images.unsplash.com/photo-1520072959219-c595dc870360\",\"category\":\"Burgers\",\"isVegetarian\":true}"
echo.

curl -X POST http://localhost:8080/api/menu ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":2,\"name\":\"French Fries\",\"description\":\"Crispy golden fries\",\"price\":99.00,\"imageUrl\":\"https://images.unsplash.com/photo-1573080496219-bb080dd4f877\",\"category\":\"Sides\",\"isVegetarian\":true}"
echo.

echo ========================================
echo Sample Data Added Successfully!
echo ========================================
echo.
echo You can now:
echo 1. Open http://localhost:5173 to browse restaurants
echo 2. View all restaurants: http://localhost:8080/api/restaurants
echo 3. View Pizza Palace menu: http://localhost:8080/api/menu/restaurant/1
echo.
pause
