import { AssignmentWithPriority } from '../types/assignment';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface WeeklyBreakdownProps {
  assignments: AssignmentWithPriority[];
}

export function WeeklyBreakdown({ assignments }: WeeklyBreakdownProps) {
  // Create weekly breakdown
  const weeklyData = [
    { week: 'Overdue', high: 0, medium: 0, low: 0 },
    { week: 'This Week', high: 0, medium: 0, low: 0 },
    { week: 'Next Week', high: 0, medium: 0, low: 0 },
    { week: 'Later', high: 0, medium: 0, low: 0 }
  ];
  
  assignments.forEach(assignment => {
    if (!assignment.completed) {
      let weekIndex: number;
      if (assignment.daysRemaining < 0) weekIndex = 0;
      else if (assignment.daysRemaining <= 7) weekIndex = 1;
      else if (assignment.daysRemaining <= 14) weekIndex = 2;
      else weekIndex = 3;
      
      if (assignment.priorityLevel === 'high') weeklyData[weekIndex].high++;
      else if (assignment.priorityLevel === 'medium') weeklyData[weekIndex].medium++;
      else weeklyData[weekIndex].low++;
    }
  });
  
  const hasData = weeklyData.some(week => week.high > 0 || week.medium > 0 || week.low > 0);
  
  if (!hasData) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-gray-700" />
        <h3 className="font-semibold text-gray-900">Weekly Deadline Breakdown</h3>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} />
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
          <Bar dataKey="high" name="High Priority" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
          <Bar dataKey="medium" name="Medium Priority" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
          <Bar dataKey="low" name="Low Priority" stackId="a" fill="#10B981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
