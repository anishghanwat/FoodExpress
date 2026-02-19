# Seed Data Reference

## Overview
This document provides a complete reference for all dummy data seeded in the FoodExpress database.

## Password
All users have the same password for testing:
- **Password**: `Password@123`
- **BCrypt Hash**: `$2a$12$jmyCQfCQTH20rxbcYRPDEumssETWrSZMFImNtbtLYMfPduBp2mpPq`

## Users

### Admin (1 user)
| Name | Email | Phone | Role |
|------|-------|-------|------|
| Admin User | admin@foodexpress.com | +1234567890 | ADMIN |

### Restaurant Owners (5 users)
| Name | Email | Phone | Restaurants |
|------|-------|-------|-------------|
| John Smith | john.smith@restaurants.com | +1234567891 | Bella Italia, Sakura Sushi |
| Maria Garcia | maria.garcia@restaurants.com | +1234567892 | El Mariachi, Spice Garden |
| David Chen | david.chen@restaurants.com | +1234567893 | Golden Dragon, Bangkok Street |
| Sarah Johnson | sarah.johnson@restaurants.com | +1234567894 | The Burger Joint, Olive Grove |
| Ahmed Hassan | ahmed.hassan@restaurants.com | +1234567895 | Sahara Nights, Le Petit Bistro |

### Delivery Agents (4 users)
| Name | Email | Phone |
|------|-------|-------|
| Mike Wilson | mike.wilson@delivery.com | +1234567896 |
| Lisa Brown | lisa.brown@delivery.com | +1234567897 |
| James Taylor | james.taylor@delivery.com | +1234567898 |
| Emma Davis | emma.davis@delivery.com | +1234567899 |

### Customers (5 users)
| Name | Email | Phone |
|------|-------|-------|
| Robert Anderson | robert.anderson@customer.com | +1234567900 |
| Jennifer Martinez | jennifer.martinez@customer.com | +1234567901 |
| William Lee | william.lee@customer.com | +1234567902 |
| Patricia White | patricia.white@customer.com | +1234567903 |
| Michael Harris | michael.harris@customer.com | +1234567904 |

## Restaurants

### 1. Bella Italia 🇮🇹
- **Owner**: John Smith
- **Cuisine**: Italian
- **Rating**: 4.5/5
- **Delivery Time**: 30 min
- **Min Order**: $15.00
- **Delivery Fee**: $3.99
- **Image**: Italian restaurant ambiance
- **Menu Items**: 5 (Pizza, Pasta, Lasagna, Salad, Tiramisu)

### 2. El Mariachi 🇲🇽
- **Owner**: Maria Garcia
- **Cuisine**: Mexican
- **Rating**: 4.7/5
- **Delivery Time**: 25 min
- **Min Order**: $12.00
- **Delivery Fee**: $2.99
- **Image**: Mexican food spread
- **Menu Items**: 5 (Tacos, Burrito, Quesadilla, Guacamole, Churros)

### 3. Golden Dragon 🇨🇳
- **Owner**: David Chen
- **Cuisine**: Chinese
- **Rating**: 4.6/5
- **Delivery Time**: 35 min
- **Min Order**: $20.00
- **Delivery Fee**: $4.99
- **Image**: Chinese cuisine
- **Menu Items**: 5 (Kung Pao, Sweet & Sour, Fried Rice, Spring Rolls, Mango Pudding)

### 4. The Burger Joint 🍔
- **Owner**: Sarah Johnson
- **Cuisine**: American
- **Rating**: 4.4/5
- **Delivery Time**: 20 min
- **Min Order**: $10.00
- **Delivery Fee**: $2.49
- **Image**: Gourmet burger
- **Menu Items**: 5 (Cheeseburger, BBQ Burger, Veggie Burger, Loaded Fries, Milkshake)

### 5. Sahara Nights 🌙
- **Owner**: Ahmed Hassan
- **Cuisine**: Middle Eastern
- **Rating**: 4.8/5
- **Delivery Time**: 28 min
- **Min Order**: $18.00
- **Delivery Fee**: $3.49
- **Image**: Middle Eastern cuisine
- **Menu Items**: 5 (Shawarma, Kebab, Falafel, Hummus, Baklava)

### 6. Sakura Sushi 🍣
- **Owner**: John Smith
- **Cuisine**: Japanese
- **Rating**: 4.9/5
- **Delivery Time**: 40 min
- **Min Order**: $25.00
- **Delivery Fee**: $5.99
- **Image**: Fresh sushi
- **Menu Items**: 5 (California Roll, Salmon Nigiri, Tempura, Miso Soup, Mochi)

### 7. Spice Garden 🌶️
- **Owner**: Maria Garcia
- **Cuisine**: Indian
- **Rating**: 4.5/5
- **Delivery Time**: 32 min
- **Min Order**: $16.00
- **Delivery Fee**: $3.99
- **Image**: Indian curry
- **Menu Items**: 5 (Tikka Masala, Biryani, Palak Paneer, Samosas, Gulab Jamun)

### 8. Bangkok Street 🇹🇭
- **Owner**: David Chen
- **Cuisine**: Thai
- **Rating**: 4.6/5
- **Delivery Time**: 27 min
- **Min Order**: $14.00
- **Delivery Fee**: $2.99
- **Image**: Thai street food
- **Menu Items**: 5 (Pad Thai, Green Curry, Pad See Ew, Tom Yum, Mango Sticky Rice)

### 9. Olive Grove 🫒
- **Owner**: Sarah Johnson
- **Cuisine**: Mediterranean
- **Rating**: 4.7/5
- **Delivery Time**: 30 min
- **Min Order**: $17.00
- **Delivery Fee**: $3.49
- **Image**: Mediterranean dishes
- **Menu Items**: 5 (Gyro, Moussaka, Greek Salad, Spanakopita, Baklava)

### 10. Le Petit Bistro 🇫🇷
- **Owner**: Ahmed Hassan
- **Cuisine**: French
- **Rating**: 4.8/5
- **Delivery Time**: 45 min
- **Min Order**: $30.00
- **Delivery Fee**: $4.99
- **Image**: French bistro
- **Menu Items**: 5 (Coq au Vin, Beef Bourguignon, Ratatouille, French Onion Soup, Crème Brûlée)

## Menu Items Summary

Total: **50 menu items** across 10 restaurants

### Categories Distribution
- **Main Course**: 30 items
- **Appetizer**: 15 items
- **Dessert**: 10 items

### Dietary Options
- **Vegetarian Items**: 20+ items
- **Non-Vegetarian Items**: 30+ items

### Price Range
- **Appetizers**: $4.99 - $8.99
- **Main Courses**: $9.99 - $22.99
- **Desserts**: $5.99 - $7.99

## Image Sources

All images are from Unsplash (free to use):
- Restaurant images: High-quality food photography
- Menu item images: Professional food shots
- All images are 800px wide for restaurants, 400px for menu items

## How to Seed

### Method 1: Using MySQL Command
```bash
# From project root
docker exec -i fooddelivery-mysql mysql -uroot -proot < sql/seed-dummy-data.sql
```

### Method 2: Using Docker Exec
```bash
docker exec -i fooddelivery-mysql mysql -uroot -proot user_db < sql/seed-dummy-data.sql
```

### Method 3: Manual Import
```bash
# Copy file into container
docker cp sql/seed-dummy-data.sql fooddelivery-mysql:/tmp/

# Execute inside container
docker exec -it fooddelivery-mysql mysql -uroot -proot -e "source /tmp/seed-dummy-data.sql"
```

## Testing Scenarios

### Customer Flow
1. Login as: `robert.anderson@customer.com`
2. Browse restaurants
3. Add items to cart from multiple restaurants
4. Place order
5. Track delivery

### Restaurant Owner Flow
1. Login as: `john.smith@restaurants.com`
2. View Bella Italia dashboard
3. Manage menu items
4. Process incoming orders
5. View analytics

### Delivery Agent Flow
1. Login as: `mike.wilson@delivery.com`
2. View available deliveries
3. Accept delivery
4. Update delivery status
5. Complete delivery

### Admin Flow
1. Login as: `admin@foodexpress.com`
2. View all users
3. Manage restaurants
4. Monitor orders
5. Send campaigns

## Notes

- All users are active by default
- All restaurants are active and accepting orders
- All menu items are available
- Images are hosted on Unsplash CDN
- Phone numbers are dummy numbers (not real)
- Addresses are fictional

## Cleanup

To remove all seeded data:

```sql
-- Delete in order to respect foreign keys
USE restaurant_db;
DELETE FROM menu_items;
DELETE FROM restaurants;

USE user_db;
DELETE FROM users;
```

Or reset databases:
```bash
docker-compose down -v
docker-compose up -d
```

## Support

For issues with seeding:
1. Check database connections
2. Verify user permissions
3. Check for existing data conflicts
4. Review error logs

---

**Last Updated**: February 19, 2026
**Total Records**: 15 users + 10 restaurants + 50 menu items = 75 records
