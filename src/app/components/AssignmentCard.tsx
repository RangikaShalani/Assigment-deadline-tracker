import { Calendar, Clock, TrendingUp, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { AssignmentWithPriority } from '../types/assignment';
import { formatDaysRemaining, getPriorityBadgeColor, getPriorityColor } from '../utils/assignmentUtils';
import { motion } from 'motion/react';
import { format } from 'date-fns';

interface AssignmentCardProps {
  assignment: AssignmentWithPriority;
  onClick: () => void;
  onToggleComplete: () => void;
}

export function AssignmentCard({ assignment, onClick, onToggleComplete }: AssignmentCardProps) {
  const isOverdue = assignment.daysRemaining < 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg border shadow-sm p-5 cursor-pointer transition-all hover:shadow-md ${
        assignment.completed ? 'opacity-60' : ''
      }`}
      onClick={onClick}
    >
      {/* Priority Indicator Bar */}
      <div className={`h-1 ${getPriorityColor(assignment.priorityLevel)} rounded-full mb-4`} />
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {/* Course Badge */}
          <div 
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
            style={{ 
              backgroundColor: `${assignment.courseColor}15`,
              color: assignment.courseColor
            }}
          >
            {assignment.courseName}
          </div>
          
          {/* Assignment Title */}
          <h3 className={`font-semibold text-gray-900 mb-2 ${assignment.completed ? 'line-through' : ''}`}>
            {assignment.title}
          </h3>
        </div>
        
        {/* Complete Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-green-600 transition-colors"
        >
          {assignment.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>
      </div>
      
      {/* Assignment Details */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{format(assignment.dueDate, 'MMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <TrendingUp className="w-4 h-4 mr-2" />
          <span>{assignment.weight}% of grade</span>
        </div>
      </div>
      
      {/* Countdown and Priority */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center text-sm font-medium ${
          isOverdue ? 'text-red-600' : 
          assignment.daysRemaining <= 3 ? 'text-orange-600' : 
          'text-gray-700'
        }`}>
          {isOverdue && <AlertCircle className="w-4 h-4 mr-1" />}
          {!isOverdue && <Clock className="w-4 h-4 mr-1" />}
          <span>{formatDaysRemaining(assignment.daysRemaining)}</span>
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeColor(assignment.priorityLevel)}`}>
          {assignment.priorityLevel.charAt(0).toUpperCase() + assignment.priorityLevel.slice(1)} Priority
        </span>
      </div>
    </motion.div>
  );
}
