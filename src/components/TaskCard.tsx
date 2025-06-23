import React from 'react';
import { Star, Edit, Trash2, MapPin, Clock, Calendar, Users } from 'lucide-react';
import { Task } from '../types';
import { importanceColors, importanceTextColors } from '../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const colorClass = importanceColors[task.importance];
  const textColorClass = importanceTextColors[task.importance];

  const getTypeIcon = () => {
    switch (task.type) {
      case 'class':
        return <Star className="w-4 h-4 text-pink-500" />;
      case 'meeting':
        return <Users className="w-4 h-4 text-blue-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`rounded-xl border-l-4 p-4 shadow-sm hover:shadow-lg transition-all duration-300 ${colorClass} border border-gray-100`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getTypeIcon()}
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
          </div>
          
          {task.description && (
            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{task.startTime} - {task.endTime}</span>
            </div>
            
            {task.roomNumber && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Room {task.roomNumber}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${textColorClass}`}>
              {task.importance.charAt(0).toUpperCase() + task.importance.slice(1)}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-pink-100 text-gray-700 font-medium">
              {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-50"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};