import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Star } from 'lucide-react';
import { Task } from '../types';
import { formatDate } from '../utils/dateUtils';

interface TaskFormProps {
  task?: Task;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  selectedDate: Date;
  defaultType?: 'task' | 'meeting' | 'class';
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSave,
  onCancel,
  selectedDate,
  defaultType = 'task',
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: formatDate(selectedDate),
    startTime: '09:00',
    endTime: '10:00',
    importance: 'low' as Task['importance'], // ✅ Default set to 'low'
    type: defaultType as Task['type'],
    roomNumber: '',
    isRecurring: false,
    recurringEndDate: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        date: task.date,
        startTime: task.startTime,
        endTime: task.endTime,
        importance: task.importance,
        type: task.type,
        roomNumber: task.roomNumber || '',
        isRecurring: task.isRecurring || false,
        recurringEndDate: task.recurringEndDate || '',
      });
    } else {
      setFormData((prev) => ({ ...prev, type: defaultType }));
    }
  }, [task, defaultType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const importanceOptions = [
    { value: 'critical', label: 'Critical', color: 'bg-red-500 hover:bg-red-600' },
    { value: 'high', label: 'High', color: 'bg-orange-500 hover:bg-orange-600' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-500 hover:bg-blue-600' },
    { value: 'low', label: 'Low', color: 'bg-green-500 hover:bg-green-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-pink-500 text-white p-4 flex items-center gap-3">
          <button onClick={onCancel} className="text-white hover:text-gray-200 transition-colors p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">
            {task ? 'Edit' : 'Create'}{' '}
            {formData.type === 'class'
              ? 'Class'
              : formData.type === 'meeting'
              ? 'Meeting'
              : 'Task'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          {!task && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <div className="flex space-x-3">
                {['task', 'meeting', 'class'].map((option) => {
                  const isSelected = formData.type === option;
                  return (
                    <label
                      key={option}
                      className={`cursor-pointer px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        value={option}
                        checked={isSelected}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value as Task['type'] })
                        }
                        name="type"
                        className="hidden"
                      />
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Venue (Optional)</label>
            <input
              type="text"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter room number"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Importance Level (4 Colors)</label>
            <div className="grid grid-cols-2 gap-3">
              {importanceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, importance: option.value as Task['importance'] })
                  }
                  className={`p-3 rounded-xl border-2 transition-all font-medium flex items-center justify-center gap-2 ${
                    formData.importance === option.value
                      ? `${option.color} text-white border-transparent shadow-lg transform scale-105`
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      formData.importance === option.value
                        ? 'bg-white'
                        : option.color.replace('hover:', '').replace('bg-', 'bg-')
                    }`}
                  ></div>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {formData.type === 'class' && (
            <div className="bg-gradient-to-r from-blue-50 to-pink-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <label
                  htmlFor="recurring"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                >
                  <Star className="w-4 h-4 text-pink-500" />
                  Recurring Weekly Class
                </label>
              </div>

              {formData.isRecurring && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date for Recurring Class
                  </label>
                  <input
                    type="date"
                    value={formData.recurringEndDate}
                    onChange={(e) =>
                      setFormData({ ...formData, recurringEndDate: e.target.value })
                    }
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                    min={formData.date}
                    required
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-pink-500 rounded-xl hover:from-blue-600 hover:to-pink-600 transition-all font-medium shadow-lg"
            >
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
