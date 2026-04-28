import { AssignmentWithPriority } from '../types/assignment';
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsBarProps {
  assignments: AssignmentWithPriority[];
}

export function StatsBar({ assignments }: StatsBarProps) {
  const incomplete = assignments.filter(a => !a.completed);
  const completed = assignments.filter(a => a.completed);
  const overdue = incomplete.filter(a => a.daysRemaining < 0);
  const highPriority = incomplete.filter(a => a.priorityLevel === 'high');
  const dueThisWeek = incomplete.filter(a => a.daysRemaining >= 0 && a.daysRemaining <= 7);
  
  const stats = [
    {
      label: 'Total Assignments',
      value: assignments.length,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Incomplete',
      value: incomplete.length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'High Priority',
      value: highPriority.length,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Due This Week',
      value: dueThisWeek.length,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Completed',
      value: completed.length,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];
  
  if (overdue.length > 0) {
    stats.splice(2, 0, {
      label: 'Overdue',
      value: overdue.length,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    });
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg border shadow-sm p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
