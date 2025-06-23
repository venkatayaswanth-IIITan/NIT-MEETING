import { Task, Notification } from '../types';
import { addDays, formatDate, getWeekdayNumber, getNextWeekday, parseDate } from './dateUtils';

export const importanceColors = {
  critical: 'border-l-red-500 bg-red-50',
  high: 'border-l-orange-500 bg-orange-50',
  medium: 'border-l-blue-500 bg-blue-50',
  low: 'border-l-green-500 bg-green-50'
};

export const importanceTextColors = {
  critical: 'text-red-700 bg-red-100',
  high: 'text-orange-700 bg-orange-100',
  medium: 'text-blue-700 bg-blue-100',
  low: 'text-green-700 bg-green-100'
};

export const importanceGradients = {
  critical: 'bg-gradient-to-r from-red-500 to-pink-500',
  high: 'bg-gradient-to-r from-orange-500 to-red-500',
  medium: 'bg-gradient-to-r from-blue-500 to-purple-500',
  low: 'bg-gradient-to-r from-green-500 to-blue-500'
};

export const generateRecurringTasks = (task: Task): Task[] => {
  if (!task.isRecurring || !task.recurringEndDate || task.type !== 'class') {
    return [task];
  }

  const tasks: Task[] = [task];
  const startDate = parseDate(task.date);
  const endDate = parseDate(task.recurringEndDate);
  const weekday = getWeekdayNumber(startDate);
  
  let currentDate = getNextWeekday(startDate, weekday);
  
  while (currentDate <= endDate) {
    const recurringTask: Task = {
      ...task,
      id: `${task.id}-${formatDate(currentDate)}`,
      date: formatDate(currentDate),
    };
    tasks.push(recurringTask);
    currentDate = addDays(currentDate, 7);
  }
  
  return tasks;
};

export const createNotification = (
  task: Task,
  type: Notification['type'],
  message: string
): Notification => {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    taskId: task.id,
    title: task.title,
    message,
    type,
    timestamp: new Date().toISOString(),
    isRead: false,
    isArchived: false,
    importance: task.importance,
    taskType: task.type,
  };
};

export const sortTasksByTime = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => {
    const timeA = a.startTime.replace(':', '');
    const timeB = b.startTime.replace(':', '');
    return timeA.localeCompare(timeB);
  });
};