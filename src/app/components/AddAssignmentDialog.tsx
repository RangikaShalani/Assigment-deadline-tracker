import { useState } from 'react';
import { X } from 'lucide-react';
import { Assignment } from '../types/assignment';

interface AddAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onAddAssignment: (assignment: Assignment) => void;
  availableCourses: { id: string; name: string; color: string }[];
}

export function AddAssignmentDialog({
  open,
  onClose,
  onAddAssignment,
  availableCourses
}: AddAssignmentDialogProps) {
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    courseColor: '',
    title: '',
    dueDate: '',
    weight: '',
    description: '',
    isNewCourse: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const handleCourseChange = (courseId: string) => {
    if (courseId === 'new') {
      setFormData(prev => ({
        ...prev,
        courseId: '',
        courseName: '',
        courseColor: '#3b82f6',
        isNewCourse: true
      }));
    } else {
      const course = availableCourses.find(c => c.id === courseId);
      if (course) {
        setFormData(prev => ({
          ...prev,
          courseId: course.id,
          courseName: course.name,
          courseColor: course.color,
          isNewCourse: false
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.isNewCourse) {
      if (!formData.courseName.trim()) {
        newErrors.courseName = 'Course name is required';
      }
    } else if (!formData.courseId) {
      newErrors.courseId = 'Please select a course';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Assignment title is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    const weight = parseFloat(formData.weight);
    if (!formData.weight || isNaN(weight) || weight < 0 || weight > 100) {
      newErrors.weight = 'Weight must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newAssignment: Assignment = {
      id: `assignment-${Date.now()}`,
      courseId: formData.isNewCourse
        ? `course-${formData.courseName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
        : formData.courseId,
      courseName: formData.isNewCourse ? formData.courseName : formData.courseName,
      courseColor: formData.courseColor,
      title: formData.title,
      dueDate: new Date(formData.dueDate),
      weight: parseFloat(formData.weight),
      completed: false,
      description: formData.description || undefined
    };

    onAddAssignment(newAssignment);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      courseId: '',
      courseName: '',
      courseColor: '',
      title: '',
      dueDate: '',
      weight: '',
      description: '',
      isNewCourse: false
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Add New Assignment</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.isNewCourse ? 'new' : formData.courseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a course...</option>
              {availableCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
              <option value="new">+ Add New Course</option>
            </select>
            {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>}
          </div>

          {/* New Course Fields */}
          {formData.isNewCourse && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                  placeholder="e.g., Computer Science 101"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.courseName && <p className="text-red-500 text-sm mt-1">{errors.courseName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.courseColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, courseColor: e.target.value }))}
                    className="h-10 w-20 cursor-pointer rounded border border-gray-300"
                  />
                  <span className="text-sm text-gray-600">{formData.courseColor}</span>
                </div>
              </div>
            </div>
          )}

          {/* Assignment Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Final Project Submission"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Due Date and Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="e.g., 25"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add any notes or details about this assignment..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
