export type PriorityLevel = 'high' | 'medium' | 'low';

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  courseColor: string;
  title: string;
  dueDate: Date;
  weight: number; // percentage
  completed: boolean;
  description?: string;
}

export interface AssignmentWithPriority extends Assignment {
  daysRemaining: number;
  priorityScore: number;
  priorityLevel: PriorityLevel;
}

export type ViewMode = 'list' | 'calendar';
export type SortBy = 'dueDate' | 'course' | 'priority';
export type FilterBy = 'all' | 'incomplete' | 'completed';

