import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800/80 my-4">
      <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-brand-400" />
      </div>
      <h3 className="font-display font-extrabold text-lg text-white tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-brand-500/20 transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
