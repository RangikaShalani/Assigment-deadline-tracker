import { CheckCircle2, Inbox } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-assignments' | 'all-completed' | 'no-results';
}

export function EmptyState({ type }: EmptyStateProps) {
  const content = {
    'no-assignments': {
      icon: Inbox,
      title: 'No assignments yet',
      description: 'Your assignment list is empty. New assignments will appear here.'
    },
    'all-completed': {
      icon: CheckCircle2,
      title: 'All caught up!',
      description: 'Great job! You\'ve completed all your assignments.'
    },
    'no-results': {
      icon: Inbox,
      title: 'No assignments found',
      description: 'Try adjusting your filters to see more results.'
    }
  };

  const { icon: Icon, title, description } = content[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-gray-100 p-6 mb-4">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-sm">{description}</p>
    </div>
  );
}
