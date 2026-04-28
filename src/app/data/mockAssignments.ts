import { Assignment } from '../types/assignment';

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    courseId: 'cs101',
    courseName: 'Computer Science 101',
    courseColor: '#3B82F6',
    title: 'Algorithm Analysis Project',
    dueDate: new Date('2026-03-30'),
    weight: 25,
    completed: false,
    description: 'Analyze time complexity of various sorting algorithms'
  },
  {
    id: '2',
    courseId: 'math201',
    courseName: 'Calculus II',
    courseColor: '#10B981',
    title: 'Integration Problem Set',
    dueDate: new Date('2026-03-29'),
    weight: 15,
    completed: false,
    description: 'Complete problems 1-20 from Chapter 8'
  },
  {
    id: '3',
    courseId: 'eng102',
    courseName: 'English Literature',
    courseColor: '#F59E0B',
    title: 'Essay: Modernist Poetry',
    dueDate: new Date('2026-04-05'),
    weight: 30,
    completed: false,
    description: '2000-word essay analyzing T.S. Eliot\'s work'
  },
  {
    id: '4',
    courseId: 'cs101',
    courseName: 'Computer Science 101',
    courseColor: '#3B82F6',
    title: 'Weekly Quiz 8',
    dueDate: new Date('2026-03-31'),
    weight: 5,
    completed: false,
    description: 'Online quiz covering recursion and dynamic programming'
  },
  {
    id: '5',
    courseId: 'phys201',
    courseName: 'Physics: Mechanics',
    courseColor: '#8B5CF6',
    title: 'Lab Report #5',
    dueDate: new Date('2026-04-02'),
    weight: 10,
    completed: false,
    description: 'Analysis of projectile motion experiment'
  },
  {
    id: '6',
    courseId: 'hist150',
    courseName: 'World History',
    courseColor: '#EF4444',
    title: 'Midterm Research Paper',
    dueDate: new Date('2026-03-29'),
    weight: 35,
    completed: false,
    description: 'Research paper on the Industrial Revolution'
  },
  {
    id: '7',
    courseId: 'math201',
    courseName: 'Calculus II',
    courseColor: '#10B981',
    title: 'Midterm Exam',
    dueDate: new Date('2026-04-08'),
    weight: 40,
    completed: false,
    description: 'Comprehensive exam covering chapters 6-10'
  },
  {
    id: '8',
    courseId: 'eng102',
    courseName: 'English Literature',
    courseColor: '#F59E0B',
    title: 'Reading Response #7',
    dueDate: new Date('2026-04-01'),
    weight: 5,
    completed: false,
    description: 'Response to Virginia Woolf\'s "Mrs. Dalloway"'
  },
  {
    id: '9',
    courseId: 'cs101',
    courseName: 'Computer Science 101',
    courseColor: '#3B82F6',
    title: 'Group Project Presentation',
    dueDate: new Date('2026-04-10'),
    weight: 20,
    completed: false,
    description: 'Present web application project to class'
  },
  {
    id: '10',
    courseId: 'phys201',
    courseName: 'Physics: Mechanics',
    courseColor: '#8B5CF6',
    title: 'Problem Set 9',
    dueDate: new Date('2026-04-03'),
    weight: 8,
    completed: false,
    description: 'Energy and momentum problems'
  },
  {
    id: '11',
    courseId: 'hist150',
    courseName: 'World History',
    courseColor: '#EF4444',
    title: 'Chapter 12 Quiz',
    dueDate: new Date('2026-04-01'),
    weight: 5,
    completed: false,
    description: 'Multiple choice quiz on WWI'
  },
  {
    id: '12',
    courseId: 'math201',
    courseName: 'Calculus II',
    courseColor: '#10B981',
    title: 'Homework Assignment 15',
    dueDate: new Date('2026-04-04'),
    weight: 10,
    completed: false,
    description: 'Series and sequences problems'
  }
];
