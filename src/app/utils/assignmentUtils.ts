import { Assignment, AssignmentWithPriority, PriorityLevel } from '../types/assignment';

export function calculateDaysRemaining(dueDate: Date): number {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function calculatePriorityScore(daysRemaining: number, weight: number): number {
  // Priority score: lower is more urgent
  // Weight urgency higher (inversely proportional to days)
  // Weight assessment weight directly
  const urgencyScore = daysRemaining <= 0 ? 1000 : (1 / Math.max(daysRemaining, 1)) * 100;
  const weightScore = weight;
  
  return urgencyScore + (weightScore * 2);
}

export function getPriorityLevel(priorityScore: number, daysRemaining: number): PriorityLevel {
  // High priority: due within 3 days OR high score
  if (daysRemaining <= 0) return 'high';
  if (daysRemaining <= 3 || priorityScore > 70) return 'high';
  if (daysRemaining <= 7 || priorityScore > 40) return 'medium';
  return 'low';
}

export function enrichAssignments(assignments: Assignment[]): AssignmentWithPriority[] {
  return assignments.map(assignment => {
    const daysRemaining = calculateDaysRemaining(assignment.dueDate);
    const priorityScore = calculatePriorityScore(daysRemaining, assignment.weight);
    const priorityLevel = getPriorityLevel(priorityScore, daysRemaining);
    
    return {
      ...assignment,
      daysRemaining,
      priorityScore,
      priorityLevel
    };
  });
}

export function formatDaysRemaining(days: number): string {
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

export function getPriorityColor(level: PriorityLevel): string {
  switch (level) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-orange-500';
    case 'low':
      return 'bg-green-500';
  }
}

export function getPriorityBadgeColor(level: PriorityLevel): string {
  switch (level) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
  }
}
