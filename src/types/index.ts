export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  type: 'task' | 'meeting' | 'class';
  roomNumber?: string;
  isRecurring?: boolean;
  recurringEndDate?: string;
  isArchived?: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  taskId: string;
  title: string;
  message: string;
  type: 'reminder' | 'created' | 'updated' | 'deleted';
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  importance: 'critical' | 'high' | 'medium' | 'low';
  taskType: 'task' | 'meeting' | 'class';
}