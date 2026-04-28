import { AlertCircle, Flame } from 'lucide-react';
import { AssignmentWithPriority } from '../types/assignment';
import { AssignmentCard } from './AssignmentCard';

interface PrioritySectionProps {
  assignments: AssignmentWithPriority[];
  onAssignmentClick: (assignment: AssignmentWithPriority) => void;
  onToggleComplete: (id: string) => void;
}

export function PrioritySection({ assignments, onAssignmentClick, onToggleComplete }: PrioritySectionProps) {
  if (assignments.length === 0) return null;
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
          <Flame className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">Priority Deadlines</h2>
          <p className="text-sm text-gray-600">Most urgent and high-weight tasks</p>
        </div>
      </div>
      
      {assignments.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            <span className="font-medium">Action required:</span> You have {assignments.length} high-priority {assignments.length === 1 ? 'assignment' : 'assignments'} that need immediate attention.
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map(assignment => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onClick={() => onAssignmentClick(assignment)}
            onToggleComplete={() => onToggleComplete(assignment.id)}
          />
        ))}
      </div>
    </div>
  );
}
