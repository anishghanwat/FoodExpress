# Agent Quick Reference Card 📋

## 🚀 Quick Start

**Login**: http://localhost:5173/login
- Email: `agent@test.com`
- Password: `Password@123`

---

## 📍 Navigation

| Page | Purpose | URL |
|------|---------|-----|
| Dashboard | Overview & stats | `/agent/dashboard` |
| Queue | Available deliveries | `/agent/queue` |
| Active | Current deliveries | `/agent/active` |
| History | Completed deliveries | `/agent/history` |
| Earnings | Earnings details | `/agent/earnings` |

---

## 🔄 Delivery Status Flow

```
ASSIGNED → PICKED_UP → IN_TRANSIT → DELIVERED
```

| Status | Meaning | Action |
|--------|---------|--------|
| ASSIGNED | Accepted by you | Go to restaurant |
| PICKED_UP | Picked up from restaurant | Drive to customer |
| IN_TRANSIT | On the way | Deliver to customer |
| DELIVERED | Successfully delivered | Complete! |

---

## 🎯 Common Actions

### Accept Delivery
1. Go to **Queue**
2. Review delivery details
3. Click **"Accept Delivery"**
4. Delivery moves to **Active**

### Mark as Picked Up
1. Go to **Active**
2. Find your delivery
3. Click **"Mark as Picked Up"**
4. Status → PICKED_UP

### Start Delivery
1. In **Active** page
2. Click **"Start Delivery"**
3. Status → IN_TRANSIT

### Mark as Delivered
1. In **Active** page
2. Click **"Mark as Delivered"**
3. Status → DELIVERED
4. Moves to **History**

---

## 💰 Earnings

**Default**: $2.99 per delivery

**View Earnings**:
- Go to **History** page
- See total earnings
- See average per delivery
- Filter by date

---

## 🔔 Notifications

You'll receive notifications for:
- New delivery available
- Delivery assigned
- Delivery reminders
- Earnings updates

---

## 🎨 Status Colors

- 🔵 **Blue** = ASSIGNED (accepted)
- 🟣 **Purple** = PICKED_UP (at restaurant)
- 🟠 **Orange** = IN_TRANSIT (on the way)
- 🟢 **Green** = DELIVERED (complete)

---

## ⏱️ Auto-Refresh

- Queue: Updates every 15 seconds
- Active: Updates every 15 seconds
- History: Manual refresh

---

## 🐛 Troubleshooting

### Can't see deliveries in Queue?
- Check if orders are marked "READY_FOR_PICKUP"
- Refresh the page
- Check if already assigned to another agent

### Accept button not working?
- Delivery may be already accepted
- Check your internet connection
- Refresh the page

### Status update not working?
- Check current status (must follow order)
- Can't skip statuses
- Refresh the page

### Notifications not appearing?
- Check notification bell (top right)
- Check browser console
- Verify WebSocket connection

---

## 📞 Support

**Technical Issues**:
- Check browser console (F12)
- Check network tab
- Contact support

**Questions**:
- See full documentation: `docs/AGENT_FEATURES_COMPLETE.md`
- See manual test guide: `docs/AGENT_FLOW_MANUAL_TEST.md`

---

## ✅ Daily Checklist

### Start of Shift
- [ ] Login to agent portal
- [ ] Check Queue for available deliveries
- [ ] Review Active deliveries
- [ ] Check notifications

### During Shift
- [ ] Accept deliveries from Queue
- [ ] Update status as you progress
- [ ] Deliver orders on time
- [ ] Mark as delivered when complete

### End of Shift
- [ ] Complete all active deliveries
- [ ] Check History for today's deliveries
- [ ] Review earnings
- [ ] Logout

---

## 🎯 Best Practices

1. **Accept Quickly**: Deliveries go fast!
2. **Update Status**: Keep customers informed
3. **Be Timely**: Deliver on time
4. **Communicate**: Use notifications
5. **Track Earnings**: Check History regularly

---

## 📊 Performance Tips

- Accept deliveries near your location
- Plan efficient routes
- Update status promptly
- Maintain good ratings
- Complete deliveries quickly

---

## 🚨 Emergency

**Order Issues**:
- Contact restaurant
- Contact customer
- Contact support

**Technical Issues**:
- Refresh the page
- Clear browser cache
- Try different browser
- Contact support

---

## 📱 Mobile Tips

- Use mobile browser
- Enable notifications
- Keep screen on during delivery
- Use GPS for navigation
- Save customer address

---

**Last Updated**: February 18, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
