import React, { useState } from 'react';
import { Bell, X, UserPlus, FileText, AlertCircle } from 'lucide-react';
import './AdminNotification.css';

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'subscription',
      icon: UserPlus,
      title: 'New Subscription Request',
      message: 'john.doe@example.com requested subscription access',
      time: '5 mins ago',
      isNew: true
    },
    {
      id: 2,
      type: 'user',
      icon: UserPlus,
      title: 'New User Registration',
      message: 'jane.smith@example.com registered to the platform',
      time: '15 mins ago',
      isNew: true
    },
    {
      id: 3,
      type: 'subscription',
      icon: UserPlus,
      title: 'Subscription Request',
      message: 'alice.brown@example.com is waiting for approval',
      time: '1 hour ago',
      isNew: false
    },
    {
      id: 4,
      type: 'alert',
      icon: AlertCircle,
      title: 'Failed Login Attempts',
      message: '3 failed login attempts detected from unknown IP',
      time: '2 hours ago',
      isNew: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.isNew).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isNew: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isNew: false })));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="notifications-container">
      {/* Bell Icon with Badge */}
      <div className="notification-trigger" onClick={() => setIsOpen(!isOpen)}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="notification-dropdown">
          {/* Header */}
          <div className="notification-header">
            <h5 className="notification-title">Notifications</h5>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <Bell size={40} className="text-muted" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => {
                const Icon = notification.icon;
                return (
                  <div 
                    key={notification.id} 
                    className={⁠ notification-item ${notification.isNew ? 'unread' : ''} ⁠}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="notification-icon">
                      <Icon size={18} />
                    </div>
                    <div className="notification-content">
                      <h6 className="notification-item-title">{notification.title}</h6>
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    <button 
                      className="notification-close"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="notification-footer">
              <a href="/audit-logs" className="view-all-link">View All Activity</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;