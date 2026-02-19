# Seed Data Summary

## Quick Reference

### User Credentials
All users have password: **Password@123**

| Role | Email | Name |
|------|-------|------|
| ADMIN | admin@gmail.com | Admin User |
| RESTAURANT_OWNER | owner@gmail.com | Restaurant Owner |
| DELIVERY_AGENT | agent@gmail.com | Delivery Agent |
| CUSTOMER | customer@gmail.com | Customer User |

### Restaurants (15 total - all owned by owner@gmail.com)

1. **Bella Italia** 🇮🇹 - Italian - Rating: 4.5/5
2. **El Mariachi** 🇲🇽 - Mexican - Rating: 4.7/5
3. **Golden Dragon** 🇨🇳 - Chinese - Rating: 4.6/5
4. **The Burger Joint** 🍔 - American - Rating: 4.4/5
5. **Sahara Nights** 🌙 - Middle Eastern - Rating: 4.8/5
6. **Sakura Sushi** 🍣 - Japanese - Rating: 4.9/5
7. **Spice Garden** 🌶️ - Indian - Rating: 4.5/5
8. **Bangkok Street** 🇹🇭 - Thai - Rating: 4.6/5
9. **Olive Grove** 🫒 - Mediterranean - Rating: 4.7/5
10. **Le Petit Bistro** 🇫🇷 - French - Rating: 4.8/5
11. **Seoul Kitchen** 🇰🇷 - Korean - Rating: 4.7/5
12. **Pho Paradise** 🇻🇳 - Vietnamese - Rating: 4.6/5
13. **Tapas Barcelona** 🇪🇸 - Spanish - Rating: 4.8/5
14. **Rio Grill** 🇧🇷 - Brazilian - Rating: 4.5/5
15. **Island Spice** 🏝️ - Caribbean - Rating: 4.6/5

### Menu Items
Each restaurant has 5-8 menu items including:
- Appetizers
- Main Courses  
- Desserts
- Vegetarian options

All images are from Unsplash (high-quality food photography).

## How to Seed

```bash
# Using Docker
docker exec -i fooddelivery-mysql mysql -uroot -proot < sql/seed-dummy-data.sql

# Or copy the file
Get-Content sql/seed-dummy-data.sql | docker exec -i fooddelivery-mysql mysql -uroot -proot
```

## Test Login

After seeding, you can login with any of these accounts:

- **Admin**: admin@gmail.com / Password@123
- **Owner**: owner@gmail.com / Password@123  
- **Agent**: agent@gmail.com / Password@123
- **Customer**: customer@gmail.com / Password@123

All restaurants will be visible and owned by owner@gmail.com.
