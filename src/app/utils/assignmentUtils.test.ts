import {
  calculateDaysRemaining,
  calculatePriorityScore,
  enrichAssignments,
  formatDaysRemaining,
  getPriorityBadgeColor,
  getPriorityColor,
  getPriorityLevel
} from './assignmentUtils';
import { Assignment } from '../types/assignment';

describe('assignmentUtils', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-29T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calculates remaining days from the current date', () => {
    expect(calculateDaysRemaining(new Date('2026-05-02T00:00:00.000Z'))).toBe(3);
  });

  it('returns a very high urgency score for overdue assignments', () => {
    expect(calculatePriorityScore(-1, 20)).toBe(1040);
  });

  it('maps priority levels based on score and remaining days', () => {
    expect(getPriorityLevel(80, 10)).toBe('high');
    expect(getPriorityLevel(45, 6)).toBe('medium');
    expect(getPriorityLevel(10, 10)).toBe('low');
  });

  it('enriches assignments with computed priority fields', () => {
    const assignments: Assignment[] = [
      {
        id: 'a1',
        courseId: 'cs101',
        courseName: 'Computer Science 101',
        courseColor: '#3B82F6',
        title: 'Final Project',
        dueDate: new Date('2026-05-01T00:00:00.000Z'),
        weight: 30,
        completed: false,
        description: 'Build the final app'
      }
    ];

    const [enrichedAssignment] = enrichAssignments(assignments);

    expect(enrichedAssignment.daysRemaining).toBe(2);
    expect(enrichedAssignment.priorityScore).toBe(110);
    expect(enrichedAssignment.priorityLevel).toBe('high');
  });

  it('formats remaining day labels for the UI', () => {
    expect(formatDaysRemaining(-1)).toBe('Overdue');
    expect(formatDaysRemaining(0)).toBe('Due today');
    expect(formatDaysRemaining(1)).toBe('1 day left');
    expect(formatDaysRemaining(5)).toBe('5 days left');
  });

  it('returns the correct style classes for each priority level', () => {
    expect(getPriorityColor('high')).toBe('bg-red-500');
    expect(getPriorityColor('medium')).toBe('bg-orange-500');
    expect(getPriorityColor('low')).toBe('bg-green-500');

    expect(getPriorityBadgeColor('high')).toBe('bg-red-100 text-red-800 border-red-200');
    expect(getPriorityBadgeColor('medium')).toBe('bg-orange-100 text-orange-800 border-orange-200');
    expect(getPriorityBadgeColor('low')).toBe('bg-green-100 text-green-800 border-green-200');
  });
});
