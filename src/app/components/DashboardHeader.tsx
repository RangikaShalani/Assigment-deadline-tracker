import { LayoutList, CalendarDays, SlidersHorizontal, Plus } from 'lucide-react';
import { ViewMode, SortBy, FilterBy } from '../types/assignment';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface DashboardHeaderProps {
  viewMode: ViewMode;
  sortBy: SortBy;
  filterBy: FilterBy;
  onViewModeChange: (mode: ViewMode) => void;
  onSortByChange: (sort: SortBy) => void;
  onFilterByChange: (filter: FilterBy) => void;
  onToggleFilters: () => void;
  onAddAssignment: () => void;
}

export function DashboardHeader({
  viewMode,
  sortBy,
  filterBy,
  onViewModeChange,
  onSortByChange,
  onFilterByChange,
  onToggleFilters,
  onAddAssignment
}: DashboardHeaderProps) {
  return (
    <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title and Stats */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignment Tracker</h1>
            <p className="text-sm text-gray-600 mt-1">Stay on top of your deadlines</p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Sort By - Only show in list view */}
            {viewMode === 'list' && (
              <Select value={sortBy} onValueChange={(value) => onSortByChange(value as SortBy)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Filter By Status */}
            <Select value={filterBy} onValueChange={(value) => onFilterByChange(value as FilterBy)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignments</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Filters Button */}
            <Button
              onClick={onToggleFilters}
              variant="outline"
              size="icon"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <LayoutList className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => onViewModeChange('calendar')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <CalendarDays className="w-4 h-4" />
                Calendar
              </button>
            </div>

            {/* Add Assignment Button */}
            <Button
              onClick={onAddAssignment}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Assignment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
