import { useState } from 'react';
import { AssignmentWithPriority } from '../types/assignment';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPriorityColor } from '../utils/assignmentUtils';

interface CalendarViewProps {
  assignments: AssignmentWithPriority[];
  onAssignmentClick: (assignment: AssignmentWithPriority) => void;
}

export function CalendarView({ assignments, onAssignmentClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getAssignmentsForDay = (day: Date) => {
    return assignments.filter(assignment => 
      isSameDay(assignment.dueDate, day) && !assignment.completed
    );
  };
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            aria-label="Go to previous month"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextMonth}
            aria-label="Go to next month"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Week Days */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayAssignments = getAssignmentsForDay(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isTodayDate = isToday(day);
          
          return (
            <div
              key={index}
              className={`min-h-24 border rounded-lg p-2 ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${isTodayDate ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isTodayDate ? 'text-blue-600' : 
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayAssignments.slice(0, 2).map(assignment => (
                  <button
                    key={assignment.id}
                    onClick={() => onAssignmentClick(assignment)}
                    className={`block w-full text-left text-xs p-1 rounded cursor-pointer ${getPriorityColor(assignment.priorityLevel)} bg-opacity-20 hover:bg-opacity-30 transition-colors`}
                    style={{ 
                      borderLeft: `3px solid ${assignment.courseColor}`,
                      backgroundColor: `${assignment.courseColor}20`
                    }}
                  >
                    <div className="font-medium truncate" style={{ color: assignment.courseColor }}>
                      {assignment.title}
                    </div>
                  </button>
                ))}
                {dayAssignments.length > 2 && (
                  <div className="text-xs text-gray-600 pl-1">
                    +{dayAssignments.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-600">Medium Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Low Priority</span>
        </div>
      </div>
    </div>
  );
}

