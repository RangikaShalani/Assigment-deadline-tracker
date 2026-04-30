import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { mockAssignments } from './data/mockAssignments';
import { Assignment, AssignmentWithPriority, ViewMode, SortBy, FilterBy } from './types/assignment';
import { enrichAssignments } from './utils/assignmentUtils';
import { DashboardHeader } from './components/DashboardHeader';
import { AssignmentList } from './components/AssignmentList';
import { EmptyState } from './components/EmptyState';
import { Toaster, toast } from 'sonner';

const StatsBar = lazy(() => import('./components/StatsBar').then((module) => ({ default: module.StatsBar })));
const PrioritySection = lazy(() => import('./components/PrioritySection').then((module) => ({ default: module.PrioritySection })));
const CalendarView = lazy(() => import('./components/CalendarView').then((module) => ({ default: module.CalendarView })));
const WorkloadChart = lazy(() => import('./components/WorkloadChart').then((module) => ({ default: module.WorkloadChart })));
const WeeklyBreakdown = lazy(() => import('./components/WeeklyBreakdown').then((module) => ({ default: module.WeeklyBreakdown })));
const FilterPanel = lazy(() => import('./components/FilterPanel').then((module) => ({ default: module.FilterPanel })));
const AssignmentDetailsDialog = lazy(() => import('./components/AssignmentDetailsDialog').then((module) => ({ default: module.AssignmentDetailsDialog })));
const AddAssignmentDialog = lazy(() => import('./components/AddAssignmentDialog').then((module) => ({ default: module.AddAssignmentDialog })));

const isFirebaseConfigured = [
  import.meta.env.VITE_FIREBASE_API_KEY,
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  import.meta.env.VITE_FIREBASE_PROJECT_ID,
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  import.meta.env.VITE_FIREBASE_APP_ID
].every(Boolean);

function SectionFallback() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-6 py-8 text-sm text-gray-500">
      Loading section...
    </div>
  );
}

function App() {
  // State management
  const [assignments, setAssignments] = useState<Assignment[]>(
    isFirebaseConfigured ? [] : mockAssignments
  );
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [databaseError, setDatabaseError] = useState<string | null>(
    isFirebaseConfigured
      ? null
      : 'Firebase is not configured yet. The app is currently using local mock assignments.'
  );
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('dueDate');
  const [filterBy, setFilterBy] = useState<FilterBy>('incomplete');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithPriority | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    let cancelled = false;
    let unsubscribe = () => {};

    void (async () => {
      try {
        const { subscribeToAssignments } = await import('./services/assignmentService');

        if (cancelled) {
          return;
        }

        unsubscribe = subscribeToAssignments(
          (nextAssignments) => {
            setAssignments(nextAssignments);
            setDatabaseError(null);
            setIsLoading(false);
          },
          (error) => {
            console.error(error);
            setDatabaseError('Could not sync assignments from Firebase. Check your config and Firestore rules.');
            setIsLoading(false);
            toast.error('Firebase sync failed', {
              description: error.message
            });
          }
        );
      } catch (error) {
        console.error(error);
        setDatabaseError('Could not initialize Firebase sync. Check your config and Firestore rules.');
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);
  
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
  const toggleComplete = async (id: string) => {
    const currentAssignment = assignments.find(a => a.id === id);
    if (!currentAssignment) {
      return;
    }

    const nextCompleted = !currentAssignment.completed;

    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === id
          ? { ...assignment, completed: nextCompleted }
          : assignment
      )
    );

    try {
      if (isFirebaseConfigured) {
        const { updateAssignmentCompletion } = await import('./services/assignmentService');
        await updateAssignmentCompletion(
          currentAssignment.firestoreId || currentAssignment.id,
          nextCompleted
        );
      }

      toast.success(
        currentAssignment.completed ? 'Assignment marked as incomplete' : 'Assignment completed!',
        {
          description: currentAssignment.title
        }
      );
    } catch (error) {
      console.error(error);
      setAssignments(prev =>
        prev.map(assignment =>
          assignment.id === id
            ? { ...assignment, completed: currentAssignment.completed }
            : assignment
        )
      );
      toast.error('Could not update assignment', {
        description: error instanceof Error ? error.message : 'Please try again.'
      });
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
  
  const handleToggleCompleteFromDialog = async () => {
    if (selectedAssignment) {
      await toggleComplete(selectedAssignment.id);
      // Update the selected assignment to reflect the change
      const updated = assignments.find(a => a.id === selectedAssignment.id);
      if (updated) {
        const enriched = enrichAssignments([{ ...updated, completed: !updated.completed }])[0];
        setSelectedAssignment(enriched);
      }
    }
  };

  const handleAddAssignment = async (newAssignment: Assignment) => {
    if (isFirebaseConfigured) {
      const { createAssignment } = await import('./services/assignmentService');
      await createAssignment(newAssignment);
    } else {
      setAssignments(prev => [...prev, newAssignment]);
    }

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
        onViewModeChange={setViewMode}
        onSortByChange={setSortBy}
        onFilterByChange={setFilterBy}
        onToggleFilters={() => setShowFilters(true)}
        onAddAssignment={() => setShowAddDialog(true)}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {databaseError && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {databaseError}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-lg border border-gray-200 bg-white px-6 py-10 text-center text-gray-600">
            Loading assignments from Firebase...
          </div>
        ) : hasNoAssignments ? (
          <EmptyState type="no-assignments" />
        ) : allCompleted ? (
          <EmptyState type="all-completed" />
        ) : (
          <>
            {/* Stats Bar */}
            <Suspense fallback={<SectionFallback />}>
              <StatsBar assignments={enrichedAssignments} />
            </Suspense>
            
            {/* Priority Section - Only show in list view and if incomplete filter */}
            {viewMode === 'list' && filterBy !== 'completed' && priorityAssignments.length > 0 && (
              <Suspense fallback={<SectionFallback />}>
                <PrioritySection
                  assignments={priorityAssignments}
                  onAssignmentClick={handleAssignmentClick}
                  onToggleComplete={toggleComplete}
                />
              </Suspense>
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
                <Suspense fallback={<SectionFallback />}>
                  <CalendarView
                    assignments={filteredAssignments}
                    onAssignmentClick={handleAssignmentClick}
                  />
                </Suspense>
              )}
            </div>
            
            {/* Data Visualization */}
            {filterBy !== 'completed' && (
              <Suspense fallback={<SectionFallback />}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  <WorkloadChart assignments={enrichedAssignments} />
                  <WeeklyBreakdown assignments={enrichedAssignments} />
                </div>
              </Suspense>
            )}
          </>
        )}
      </main>
      
      {/* Filter Panel */}
      <Suspense fallback={null}>
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
      </Suspense>
      
      {/* Assignment Details Dialog */}
      <Suspense fallback={null}>
        <AssignmentDetailsDialog
          assignment={selectedAssignment}
          open={selectedAssignment !== null}
          onClose={() => setSelectedAssignment(null)}
          onToggleComplete={handleToggleCompleteFromDialog}
        />
      </Suspense>

      {/* Add Assignment Dialog */}
      <Suspense fallback={null}>
        <AddAssignmentDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAddAssignment={handleAddAssignment}
          availableCourses={availableCourses}
        />
      </Suspense>

      {/* Toast Notifications */}
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
