import { AssignmentWithPriority } from '../types/assignment';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen } from 'lucide-react';

interface WorkloadChartProps {
  assignments: AssignmentWithPriority[];
}

export function WorkloadChart({ assignments }: WorkloadChartProps) {
  // Group by course and calculate workload
  const courseData: Record<string, { courseName: string; courseColor: string; count: number; totalWeight: number }> = {};
  
  assignments.forEach(assignment => {
    if (!assignment.completed) {
      if (!courseData[assignment.courseId]) {
        courseData[assignment.courseId] = {
          courseName: assignment.courseName,
          courseColor: assignment.courseColor,
          count: 0,
          totalWeight: 0
        };
      }
      courseData[assignment.courseId].count++;
      courseData[assignment.courseId].totalWeight += assignment.weight;
    }
  });
  
  const chartData = Object.values(courseData).map(course => ({
    name: course.courseName,
    assignments: course.count,
    weight: course.totalWeight,
    color: course.courseColor
  }));
  
  if (chartData.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-gray-700" />
        <h3 className="font-semibold text-gray-900">Workload Distribution by Course</h3>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Legend />
          <Bar dataKey="assignments" name="Number of Assignments" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
