import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDayName, getMonthName, isToday } from '../utils/dateUtils';

interface DateNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateNavigation: React.FC<DateNavigationProps> = ({ currentDate, onDateChange }) => {
  const handlePrevDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    onDateChange(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-pink-50 border-b border-gray-100">
      <button
        onClick={handlePrevDay}
        className="p-3 rounded-full hover:bg-white hover:shadow-md transition-all duration-200 text-gray-600 hover:text-blue-600"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center">
        <button
          onClick={handleToday}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
            isToday(currentDate)
              ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-700 hover:bg-white hover:shadow-md'
          }`}
        >
          {isToday(currentDate) ? 'TODAY' : getDayName(currentDate).toUpperCase()}
        </button>
        <div className="text-sm text-gray-500 mt-1 font-medium">
          {getMonthName(currentDate)} {currentDate.getDate()}, {currentDate.getFullYear()}
        </div>
      </div>

      <button
        onClick={handleNextDay}
        className="p-3 rounded-full hover:bg-white hover:shadow-md transition-all duration-200 text-gray-600 hover:text-pink-600"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};