import { AssignmentWithPriority, SortBy } from '../types/assignment';
import { AssignmentCard } from './AssignmentCard';
import { EmptyState } from './EmptyState';

interface AssignmentListProps {
  assignments: AssignmentWithPriority[];
  sortBy: SortBy;
  onAssignmentClick: (assignment: AssignmentWithPriority) => void;
  onToggleComplete: (id: string) => void;
}

export function AssignmentList({ assignments, sortBy, onAssignmentClick, onToggleComplete }: AssignmentListProps) {
  if (assignments.length === 0) {
    return <EmptyState type="no-results" />;
  }

  // Group assignments based on sortBy
  const groupedAssignments: Record<string, AssignmentWithPriority[]> = {};
  
  assignments.forEach(assignment => {
    let key: string;
    
    switch (sortBy) {
      case 'course':
        key = assignment.courseName;
        break;
      case 'priority':
        key = assignment.priorityLevel.charAt(0).toUpperCase() + assignment.priorityLevel.slice(1);
        break;
      case 'dueDate':
      default:
        {
          // Group by week
          const daysRemaining = assignment.daysRemaining;
          if (daysRemaining < 0) key = 'Overdue';
          else if (daysRemaining <= 7) key = 'This Week';
          else if (daysRemaining <= 14) key = 'Next Week';
          else key = 'Later';
        }
        break;
    }
    
    if (!groupedAssignments[key]) {
      groupedAssignments[key] = [];
    }
    groupedAssignments[key].push(assignment);
  });

  // Sort groups
  const sortedGroups = Object.keys(groupedAssignments).sort((a, b) => {
    if (sortBy === 'priority') {
      const order = ['High', 'Medium', 'Low'];
      return order.indexOf(a) - order.indexOf(b);
    }
    if (sortBy === 'dueDate') {
      const order = ['Overdue', 'This Week', 'Next Week', 'Later'];
      return order.indexOf(a) - order.indexOf(b);
    }
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-8">
      {sortedGroups.map(groupName => (
        <div key={groupName}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
            {groupName}
            <span className="ml-2 text-sm font-normal text-gray-600">
              ({groupedAssignments[groupName].length})
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedAssignments[groupName].map(assignment => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onClick={() => onAssignmentClick(assignment)}
                onToggleComplete={() => onToggleComplete(assignment.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
