import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'approved' | 'in-review' | 'draft' | 'rejected';

const statusStyles: Record<StatusType, { bg: string; text: string }> = {
    approved: { bg: 'bg-green-100', text: 'text-green-800' },
    'in-review': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    draft: { bg: 'bg-gray-100', text: 'text-gray-800' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800' },
};

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
    // Convert status to key format
    const statusKey = status.toLowerCase().replace(/\s+/g, '-') as StatusType;
    const style = statusStyles[statusKey] || { bg: 'bg-gray-100', text: 'text-gray-800' };

    return (
        <span
            className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                style.bg,
                style.text,
                className
            )}
        >
      {status}
    </span>
    );
};

export default StatusBadge;