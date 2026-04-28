import { AssignmentWithPriority } from '../types/assignment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar, Clock, TrendingUp, BookOpen, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { formatDaysRemaining, getPriorityBadgeColor, getPriorityColor } from '../utils/assignmentUtils';
import { Button } from './ui/button';

interface AssignmentDetailsDialogProps {
  assignment: AssignmentWithPriority | null;
  open: boolean;
  onClose: () => void;
  onToggleComplete: () => void;
}

export function AssignmentDetailsDialog({ 
  assignment, 
  open, 
  onClose, 
  onToggleComplete 
}: AssignmentDetailsDialogProps) {
  if (!assignment) return null;
  
  const isOverdue = assignment.daysRemaining < 0;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{assignment.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Priority Indicator */}
          <div className={`h-2 ${getPriorityColor(assignment.priorityLevel)} rounded-full`} />
          
          {/* Course Badge */}
          <div 
            className="inline-block px-4 py-2 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: `${assignment.courseColor}15`,
              color: assignment.courseColor
            }}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            {assignment.courseName}
          </div>
          
          {/* Key Information Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Due Date</span>
              </div>
              <p className="font-medium text-gray-900">
                {format(assignment.dueDate, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>Time Remaining</span>
              </div>
              <p className={`font-medium ${
                isOverdue ? 'text-red-600' : 
                assignment.daysRemaining <= 3 ? 'text-orange-600' : 
                'text-gray-900'
              }`}>
                {isOverdue && <AlertCircle className="w-4 h-4 inline mr-1" />}
                {formatDaysRemaining(assignment.daysRemaining)}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>Assessment Weight</span>
              </div>
              <p className="font-medium text-gray-900">{assignment.weight}% of final grade</p>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-600 mb-2">Priority Level</div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getPriorityBadgeColor(assignment.priorityLevel)}`}>
                {assignment.priorityLevel.charAt(0).toUpperCase() + assignment.priorityLevel.slice(1)} Priority
              </span>
            </div>
          </div>
          
          {/* Description */}
          {assignment.description && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Description</h4>
              <p className="text-gray-600 leading-relaxed">{assignment.description}</p>
            </div>
          )}
          
          {/* Status Banner */}
          {assignment.completed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-green-800 font-medium">
                This assignment has been marked as completed
              </span>
            </div>
          )}
          
          {isOverdue && !assignment.completed && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-800 font-medium">
                This assignment is overdue
              </span>
            </div>
          )}
          
          {/* Action Button */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onToggleComplete}
              variant={assignment.completed ? "outline" : "default"}
              className="flex-1"
            >
              {assignment.completed ? (
                <>
                  <Circle className="w-4 h-4 mr-2" />
                  Mark as Incomplete
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as Complete
                </>
              )}
            </Button>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
