import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Check, CheckCheck, Trash2, Filter, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router';

const Notifications = () => {
    const {
        notifications, unreadCount, loading,
        markAsRead, markAllAsRead, deleteNotification, refreshNotifications
    } = useNotifications();

    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notification.isRead;
        if (filter === 'order') return notification.type === 'ORDER';
        if (filter === 'payment') return notification.type === 'PAYMENT';
        if (filter === 'delivery') return notification.type === 'DELIVERY';
        return true;
    });

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) markAsRead(notification.id);
        if (notification.relatedEntityType === 'ORDER' && notification.relatedEntityId) {
            navigate(`/order-tracking/${notification.relatedEntityId}`);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'ORDER': return '📦';
            case 'PAYMENT': return '💳';
            case 'DELIVERY': return '🚚';
            default: return '🔔';
        }
    };

    const getCategoryBorder = (category) => {
        switch (category) {
            case 'SUCCESS': return 'border-l-[#10B981]';
            case 'ERROR': return 'border-l-[#EF4444]';
            case 'WARNING': return 'border-l-[#F59E0B]';
            default: return 'border-l-[#FF6B35]';
        }
    };

    const getTitleColor = (category) => {
        switch (category) {
            case 'SUCCESS': return 'text-[#10B981]';
            case 'ERROR': return 'text-[#EF4444]';
            case 'WARNING': return 'text-[#F59E0B]';
            default: return 'text-[#FF6B35]';
        }
    };

    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'unread', label: 'Unread' },
        { value: 'order', label: 'Orders' },
        { value: 'payment', label: 'Payments' },
        { value: 'delivery', label: 'Delivery' }
    ];

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                {unreadCount > 0 ? (
                                    <span>You have <span className="font-semibold text-[#FF6B35]">{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}</span>
                                ) : (
                                    <span>All caught up! 🎉</span>
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={refreshNotifications}
                                disabled={loading}
                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                                title="Refresh"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a25] transition-colors text-sm"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    <span>Mark all read</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        <Filter className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                        {filterOptions.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setFilter(value)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === value
                                        ? 'bg-[#FF6B35] text-white'
                                        : 'bg-input border border-border text-foreground/60 hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notifications List */}
                {loading && notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <RefreshCw className="w-10 h-10 mx-auto mb-4 text-muted-foreground/40 animate-spin" />
                        <p className="text-muted-foreground">Loading notifications...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-12 bg-muted/50 border border-border rounded-xl">
                        <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                        <h3 className="text-base font-medium text-foreground mb-1">
                            {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            {filter === 'all' ? "You'll see notifications here when you have updates" : "Try selecting a different filter"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-muted/50 border border-border border-l-4 rounded-xl transition-all hover:bg-muted/80 ${!notification.isRead ? getCategoryBorder(notification.category) : 'border-l-white/10'
                                    }`}
                            >
                                <div className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 text-2xl">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div
                                            className="flex-1 min-w-0 cursor-pointer"
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex items-start justify-between mb-1">
                                                <h3 className={`text-sm font-semibold ${getTitleColor(notification.category)}`}>
                                                    {notification.title}
                                                </h3>
                                                {!notification.isRead && (
                                                    <span className="ml-2 w-2 h-2 bg-[#FF6B35] rounded-full flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                            <p className="text-muted-foreground text-sm mb-2">{notification.message}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-xs text-foreground/30">
                                                    <span className="font-medium text-muted-foreground">{notification.type}</span>
                                                    {notification.priority && (
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${notification.priority === 'URGENT' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
                                                                notification.priority === 'HIGH' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                                                                    notification.priority === 'MEDIUM' ? 'bg-[#FF6B35]/20 text-[#FF6B35]' :
                                                                        'bg-white/10 text-muted-foreground'
                                                            }`}>
                                                            {notification.priority}
                                                        </span>
                                                    )}
                                                    <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                                            className="p-1.5 text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm('Delete this notification?')) deleteNotification(notification.id);
                                                        }}
                                                        className="p-1.5 text-muted-foreground/50 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
