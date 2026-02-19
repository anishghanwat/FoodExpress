import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const navigate = useNavigate();

    const recentNotifications = notifications.slice(0, 5);

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        if (notification.relatedEntityType === 'ORDER' && notification.relatedEntityId) {
            navigate(`/order-tracking/${notification.relatedEntityId}`);
        }
        setIsOpen(false);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'ORDER': return '📦';
            case 'PAYMENT': return '💳';
            case 'DELIVERY': return '🚚';
            default: return '🔔';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'SUCCESS': return 'text-[#10B981]';
            case 'ERROR': return 'text-[#EF4444]';
            case 'WARNING': return 'text-[#F59E0B]';
            default: return 'text-[#FF6B35]';
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#FF6B35] rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-96 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-50 max-h-[600px] overflow-hidden flex flex-col">
                        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-[#FF6B35] hover:text-[#ff8a5c] font-medium transition-colors"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {recentNotifications.length === 0 ? (
                                <div className="px-4 py-8 text-center text-white/40">
                                    <Bell className="w-10 h-10 mx-auto mb-2 text-white/20" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {recentNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors ${!notification.isRead ? 'bg-[#FF6B35]/5' : ''
                                                }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 text-xl">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <p className={`text-sm font-medium ${getCategoryColor(notification.category)}`}>
                                                            {notification.title}
                                                        </p>
                                                        {!notification.isRead && (
                                                            <span className="ml-2 w-2 h-2 bg-[#FF6B35] rounded-full flex-shrink-0 mt-1" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-white/50 mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-white/30 mt-1">
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {recentNotifications.length > 0 && (
                            <div className="px-4 py-3 border-t border-white/10">
                                <button
                                    onClick={() => { navigate('/notifications'); setIsOpen(false); }}
                                    className="w-full text-center text-sm text-[#FF6B35] hover:text-[#ff8a5c] font-medium transition-colors"
                                >
                                    View all notifications
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
