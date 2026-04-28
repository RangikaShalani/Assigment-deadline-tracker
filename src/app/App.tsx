import { useState, useMemo } from 'react';
import { mockAssignments } from './data/mockAssignments';
import { Assignment, AssignmentWithPriority, ViewMode, SortBy, FilterBy } from './types/assignment';
import { enrichAssignments } from './utils/assignmentUtils';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsBar } from './components/StatsBar';
import { PrioritySection } from './components/PrioritySection';
import { AssignmentList } from './components/AssignmentList';
import { CalendarView } from './components/CalendarView';
import { WorkloadChart } from './components/WorkloadChart';
import { WeeklyBreakdown } from './components/WeeklyBreakdown';
import { FilterPanel } from './components/FilterPanel';
import { AssignmentDetailsDialog } from './components/AssignmentDetailsDialog';
import { AddAssignmentDialog } from './components/AddAssignmentDialog';
import { EmptyState } from './components/EmptyState';
import { Toaster, toast } from 'sonner';

function App() {
  // State management
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('dueDate');
  const [filterBy, setFilterBy] = useState<FilterBy>('incomplete');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithPriority | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Get available courses
  const availableCourses = useMemo(() => {
    const coursesMap = new Map<string, { id: string; name: string; color: string }>();
    assignments.forEach(assignment => {
      if (!coursesMap.has(assignment.courseId)) {
        coursesMap.set(assignment.courseId, {
          id: assignment.courseId,
          name: assignment.courseName,
          color: assignment.courseColor
        });
      }
    });
    return Array.from(coursesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [assignments]);
  
  // Enrich assignments with calculated fields
  const enrichedAssignments = useMemo(() => {
    return enrichAssignments(assignments);
  }, [assignments]);
  
  // Filter and sort assignments
  const filteredAssignments = useMemo(() => {
    let filtered = enrichedAssignments;
    
    // Filter by completion status
    if (filterBy === 'incomplete') {
      filtered = filtered.filter(a => !a.completed);
    } else if (filterBy === 'completed') {
      filtered = filtered.filter(a => a.completed);
    }
    
    // Filter by course
    if (selectedCourses.length > 0) {
      filtered = filtered.filter(a => selectedCourses.includes(a.courseId));
    }
    
    // Filter by priority
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(a => selectedPriorities.includes(a.priorityLevel));
    }
    
    // Sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'course':
          return a.courseName.localeCompare(b.courseName);
        case 'priority':
          return b.priorityScore - a.priorityScore;
        case 'dueDate':
        default:
          return a.dueDate.getTime() - b.dueDate.getTime();
      }
    });
  }, [enrichedAssignments, filterBy, selectedCourses, selectedPriorities, sortBy]);
  
  // Get priority assignments (top 3 high priority incomplete)
  const priorityAssignments = useMemo(() => {
    return enrichedAssignments
      .filter(a => !a.completed && a.priorityLevel === 'high')
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 3);
  }, [enrichedAssignments]);
  
  // Handlers
  const toggleComplete = (id: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === id 
          ? { ...assignment, completed: !assignment.completed }
          : assignment
      )
    );
    
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
      toast.success(
        assignment.completed ? 'Assignment marked as incomplete' : 'Assignment completed!',
        {
          description: assignment.title
        }
      );
    }
  };
  
  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };
  
  const handlePriorityToggle = (priority: string) => {
    setSelectedPriorities(prev => 
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };
  
  const clearAllFilters = () => {
    setSelectedCourses([]);
    setSelectedPriorities([]);
  };
  
  const handleAssignmentClick = (assignment: AssignmentWithPriority) => {
    setSelectedAssignment(assignment);
  };
  
  const handleToggleCompleteFromDialog = () => {
    if (selectedAssignment) {
      toggleComplete(selectedAssignment.id);
      // Update the selected assignment to reflect the change
      const updated = assignments.find(a => a.id === selectedAssignment.id);
      if (updated) {
        const enriched = enrichAssignments([{ ...updated, completed: !updated.completed }])[0];
        setSelectedAssignment(enriched);
      }
    }
  };

  const handleAddAssignment = (newAssignment: Assignment) => {
    setAssignments(prev => [...prev, newAssignment]);
    toast.success('Assignment added successfully!', {
      description: newAssignment.title
    });
  };
  
  // Check if all assignments are completed
  const allCompleted = enrichedAssignments.length > 0 && enrichedAssignments.every(a => a.completed);
  const hasNoAssignments = assignments.length === 0;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        viewMode={viewMode}
        sortBy={sortBy}
        filterBy={filterBy}
        selectedCourses={selectedCourses}
        availableCourses={availableCourses}
        onViewModeChange={setViewMode}
        onSortByChange={setSortBy}
        onFilterByChange={setFilterBy}
        onCourseFilterChange={setSelectedCourses}
        onToggleFilters={() => setShowFilters(true)}
        onAddAssignment={() => setShowAddDialog(true)}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {hasNoAssignments ? (
          <EmptyState type="no-assignments" />
        ) : allCompleted ? (
          <EmptyState type="all-completed" />
        ) : (
          <>
            {/* Stats Bar */}
            <StatsBar assignments={enrichedAssignments} />
            
            {/* Priority Section - Only show in list view and if incomplete filter */}
            {viewMode === 'list' && filterBy !== 'completed' && priorityAssignments.length > 0 && (
              <PrioritySection
                assignments={priorityAssignments}
                onAssignmentClick={handleAssignmentClick}
                onToggleComplete={toggleComplete}
              />
            )}
            
            {/* Main Content */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {viewMode === 'list' ? 'All Assignments' : 'Calendar View'}
              </h2>
              
              {viewMode === 'list' ? (
                <AssignmentList
                  assignments={filteredAssignments}
                  sortBy={sortBy}
                  onAssignmentClick={handleAssignmentClick}
                  onToggleComplete={toggleComplete}
                />
              ) : (
                <CalendarView
                  assignments={filteredAssignments}
                  onAssignmentClick={handleAssignmentClick}
                />
              )}
            </div>
            
            {/* Data Visualization */}
            {filterBy !== 'completed' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <WorkloadChart assignments={enrichedAssignments} />
                <WeeklyBreakdown assignments={enrichedAssignments} />
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Filter Panel */}
      <FilterPanel
        show={showFilters}
        selectedCourses={selectedCourses}
        availableCourses={availableCourses}
        selectedPriorities={selectedPriorities}
        onCourseToggle={handleCourseToggle}
        onPriorityToggle={handlePriorityToggle}
        onClose={() => setShowFilters(false)}
        onClearAll={clearAllFilters}
      />
      
      {/* Assignment Details Dialog */}
      <AssignmentDetailsDialog
        assignment={selectedAssignment}
        open={selectedAssignment !== null}
        onClose={() => setSelectedAssignment(null)}
        onToggleComplete={handleToggleCompleteFromDialog}
      />

      {/* Add Assignment Dialog */}
      <AddAssignmentDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddAssignment={handleAddAssignment}
        availableCourses={availableCourses}
      />

      {/* Toast Notifications */}
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
