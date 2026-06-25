import React from 'react';
import { Table2, CalendarDays } from 'lucide-react';

/**
 * Segmented control to switch between 'table' and 'calendar' views.
 */
export const ViewToggle = ({ view, onChange, testid = 'view-toggle' }) => {
  const options = [
    { value: 'table', label: 'Tabela', icon: Table2 },
    { value: 'calendar', label: 'Timeline', icon: CalendarDays },
  ];
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-md bg-[#16161A] border border-white/5" data-testid={testid}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = view === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            data-testid={`${testid}-${opt.value}`}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200
              ${active ? 'bg-sony-red text-white shadow-[0_0_14px_-4px_rgba(230,0,18,0.5)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
