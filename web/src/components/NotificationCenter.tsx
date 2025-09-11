'use client';

import { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate real-time notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Bone Density Alert',
        message: 'Crew member ISS-045 showing 18% bone density loss - approaching critical threshold',
        timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
        read: false
      },
      {
        id: '2',
        type: 'info',
        title: 'Mission Update',
        message: 'Expedition 68 completed 120 days - scheduled health assessment due',
        timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
        read: false
      },
      {
        id: '3',
        type: 'success',
        title: 'Recovery Milestone',
        message: 'ISS-042 crew member achieved 95% muscle mass recovery post-mission',
        timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
        read: true
      },
      {
        id: '4',
        type: 'error',
        title: 'Critical Health Metric',
        message: 'Psychological wellness score below threshold for crew member ISS-046',
        timestamp: new Date(Date.now() - 4 * 60 * 60000), // 4 hours ago
        read: false
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-400/10 border-yellow-400/20';
      case 'error': return 'bg-red-400/10 border-red-400/20';
      case 'success': return 'bg-green-400/10 border-green-400/20';
      case 'info': return 'bg-blue-400/10 border-blue-400/20';
      default: return 'bg-blue-400/10 border-blue-400/20';
    }
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={onClose}
        className="relative p-2 text-cosmic-white/80 hover:text-yellow-400 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          
          {/* Panel */}
          <div className="absolute top-full right-0 mt-2 w-96 bg-black/95 backdrop-blur-md border border-yellow-400/20 rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-cosmic-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-cosmic-white">Health Alerts</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="text-cosmic-white/60 hover:text-cosmic-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-cosmic-white/60">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-l-4 cursor-pointer hover:bg-cosmic-white/5 transition-colors ${
                        !notification.read ? 'bg-cosmic-white/2' : ''
                      } ${getBgColor(notification.type)}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium text-cosmic-white ${
                              !notification.read ? 'font-bold' : ''
                            }`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-cosmic-white/60">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-cosmic-white/80 mt-1">
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-cosmic-white/10">
              <button className="w-full text-sm text-blue-400 hover:text-blue-300 transition-colors text-center">
                View All Notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
