import { X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';

interface FilterPanelProps {
  show: boolean;
  selectedCourses: string[];
  availableCourses: { id: string; name: string; color: string }[];
  selectedPriorities: string[];
  onCourseToggle: (courseId: string) => void;
  onPriorityToggle: (priority: string) => void;
  onClose: () => void;
  onClearAll: () => void;
}

export function FilterPanel({
  show,
  selectedCourses,
  availableCourses,
  selectedPriorities,
  onCourseToggle,
  onPriorityToggle,
  onClose,
  onClearAll
}: FilterPanelProps) {
  const priorities = [
    { id: 'high', label: 'High Priority', color: '#EF4444' },
    { id: 'medium', label: 'Medium Priority', color: '#F59E0B' },
    { id: 'low', label: 'Low Priority', color: '#10B981' }
  ];
  
  const hasActiveFilters = selectedCourses.length > 0 || selectedPriorities.length > 0;
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-700" />
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close filters"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Filters Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Course Filters */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Courses</h3>
                  <div className="space-y-3">
                    {availableCourses.map(course => (
                      <label
                        key={course.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <Checkbox
                          checked={selectedCourses.includes(course.id)}
                          onCheckedChange={() => onCourseToggle(course.id)}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: course.color }}
                          />
                          <span className="text-sm text-gray-700">{course.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Priority Filters */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Priority Level</h3>
                  <div className="space-y-3">
                    {priorities.map(priority => (
                      <label
                        key={priority.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <Checkbox
                          checked={selectedPriorities.includes(priority.id)}
                          onCheckedChange={() => onPriorityToggle(priority.id)}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: priority.color }}
                          />
                          <span className="text-sm text-gray-700">{priority.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t bg-gray-50">
                {hasActiveFilters && (
                  <Button
                    onClick={onClearAll}
                    variant="outline"
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                )}
                {!hasActiveFilters && (
                  <p className="text-sm text-gray-600 text-center">
                    No filters applied
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
