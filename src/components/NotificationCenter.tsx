import React from 'react';
import { Bell, Archive, Clock, Trash2, X, Star, Calendar, Users } from 'lucide-react';
import { Notification } from '../types';
import { importanceColors, importanceTextColors } from '../utils/taskUtils';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onArchive,
  onDelete,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const recentNotifications = notifications.filter(n => !n.isArchived);
  const archivedNotifications = notifications.filter(n => n.isArchived);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTypeIcon = (taskType: string) => {
    switch (taskType) {
      case 'class':
        return <Star className="w-4 h-4 text-pink-500" />;
      case 'meeting':
        return <Users className="w-4 h-4 text-blue-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const getImportanceColor = (importance: string) => {
    return importanceColors[importance as keyof typeof importanceColors] || importanceColors.medium;
  };

  const getImportanceTextColor = (importance: string) => {
    return importanceTextColors[importance as keyof typeof importanceTextColors] || importanceTextColors.medium;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-pink-500 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="p-4">
            <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              Recent Notifications
            </h3>
            {recentNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No recent notifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border-l-4 transition-all duration-200 ${
                      getImportanceColor(notification.importance)
                    } ${
                      notification.isRead 
                        ? 'border-gray-200' 
                        : 'border-blue-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(notification.taskType)}
                          <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
                        </div>
                        <p className="text-gray-600 text-xs mb-2">{notification.message}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getImportanceTextColor(notification.importance)}`}>
                            {notification.importance.charAt(0).toUpperCase() + notification.importance.slice(1)}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-100 to-pink-100 text-gray-700 font-medium">
                            {notification.taskType.charAt(0).toUpperCase() + notification.taskType.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(notification.timestamp)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-blue-100 transition-all"
                          >
                            Read
                          </button>
                        )}
                        <button
                          onClick={() => onArchive(notification.id)}
                          className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all"
                        >
                          <Archive className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDelete(notification.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {archivedNotifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <Archive className="w-5 h-5 text-gray-500" />
                Archived Notifications
              </h3>
              <div className="space-y-3">
                {archivedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border-l-4 ${getImportanceColor(notification.importance)} bg-white border border-gray-200 shadow-sm`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(notification.taskType)}
                          <h4 className="font-semibold text-gray-700 text-sm">{notification.title}</h4>
                        </div>
                        <p className="text-gray-500 text-xs mb-2">{notification.message}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getImportanceTextColor(notification.importance)}`}>
                            {notification.importance.charAt(0).toUpperCase() + notification.importance.slice(1)}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-100 to-pink-100 text-gray-700 font-medium">
                            {notification.taskType.charAt(0).toUpperCase() + notification.taskType.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(notification.timestamp)}
                        </div>
                      </div>
                      <button
                        onClick={() => onDelete(notification.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};