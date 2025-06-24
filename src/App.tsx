import React, { useState } from 'react';
import { Plus, Bell, Calendar, Star } from 'lucide-react';
import { Task, Notification } from './types';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { DateNavigation } from './components/DateNavigation';
import { NotificationCenter } from './components/NotificationCenter';
import { useLocalStorage } from './hooks/useLocalStorage';
import { isSameDay } from './utils/dateUtils';
import {
  generateRecurringTasks,
  createNotification,
  sortTasksByTime,
  importanceColors,
  importanceTextColors,
} from './utils/taskUtils';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [showNotifications, setShowNotifications] = useState(false);
  const [formType, setFormType] = useState<'task' | 'meeting' | 'class'>('task');

  // Generate all recurring tasks
  const allTasks = tasks.flatMap(task => generateRecurringTasks(task));
  
  // Filter tasks for current date
  const todaysTasks = allTasks.filter(task => isSameDay(new Date(task.date), currentDate));
  const sortedTasks = sortTasksByTime(todaysTasks);
  const unreadNotifications = notifications.filter(n => !n.isRead && !n.isArchived);

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();

    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id
          ? { ...taskData, id: editingTask.id, createdAt: editingTask.createdAt }
          : task
      );
      setTasks(updatedTasks);

      // Add notification
      const notification = createNotification(
        { ...taskData, id: editingTask.id, createdAt: editingTask.createdAt },
        'updated',
        `${taskData.type.charAt(0).toUpperCase() + taskData.type.slice(1)} updated successfully`
      );
      setNotifications(prev => [notification, ...prev]);
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
      };
      setTasks(prev => [...prev, newTask]);

      // Add notification
      const notification = createNotification(
        newTask,
        'created',
        `${taskData.type.charAt(0).toUpperCase() + taskData.type.slice(1)} created successfully`
      );
      setNotifications(prev => [notification, ...prev]);
    }

    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (taskToDelete) {
      setTasks(prev => prev.filter(task => task.id !== taskId));

      // Add notification
      const notification = createNotification(
        taskToDelete,
        'deleted',
        `${taskToDelete.type.charAt(0).toUpperCase() + taskToDelete.type.slice(1)} deleted`
      );
      setNotifications(prev => [notification, ...prev]);
    }
  };

  const handleEditTask = (task: Task) => {
    const originalTask = tasks.find(t => t.id === task.id || task.id.startsWith(`${t.id}-`));
    if (originalTask) {
      setEditingTask(originalTask);
      setShowTaskForm(true);
    }
  };

  const handleCreateTask = (type: 'task' | 'meeting' | 'class') => {
    setFormType(type);
    setShowTaskForm(true);
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleArchiveNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isArchived: true, isRead: true }
          : notification
      )
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
    {/* Header */}
    <div className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between p-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            NITT
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
            >
              <Bell className="w-6 h-6" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
          </div>
        </div>
    

          {/* Action Buttons */}
          <div className="flex gap-2 p-4 pt-0">
            <button
              onClick={() => handleCreateTask('task')}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
            <button
              onClick={() => handleCreateTask('meeting')}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4" />
              Class
            </button>
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="max-w-md mx-auto">
        <DateNavigation currentDate={currentDate} onDateChange={setCurrentDate} />
      </div>

      {/* Task List */}
      <div className="max-w-md mx-auto p-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-300 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg mb-4">
              No tasks, meetings, or classes for this day 
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => handleCreateTask('task')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-medium shadow-lg text-sm"
              >
                Create Task
              </button>
              <button
                onClick={() => handleCreateTask('class')}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl hover:from-pink-600 hover:to-red-600 transition-all font-medium shadow-lg text-sm"
              >
                Create Class
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Detailed View</h3>
            {sortedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(undefined);
          }}
          selectedDate={currentDate}
          defaultType={formType}
        />
      )}

      {/* Notification Center */}
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onArchive={handleArchiveNotification}
        onDelete={handleDeleteNotification}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}

export default App;
