import React from 'react';
import { NavLink } from 'react-router-dom';
import { Workflow, AlertTriangle, FileSpreadsheet } from 'lucide-react';

const tabs = [
  { to: '/rlm/processos', label: 'Fase 1 · Processos', icon: Workflow, testid: 'rlm-tab-processos' },
  { to: '/rlm/pendencias', label: 'Pendências', icon: AlertTriangle, testid: 'rlm-tab-pendencias' },
  { to: '/rlm', label: 'Fase 2 · Royalties', icon: FileSpreadsheet, testid: 'rlm-tab-royalties', end: true },
];

export const RlmTabs = () => (
  <div className="inline-flex items-center gap-1 p-1 rounded-md bg-[#16161A] border border-white/5 flex-wrap" data-testid="rlm-tabs">
    {tabs.map((t) => {
      const Icon = t.icon;
      return (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          data-testid={t.testid}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200
            ${isActive ? 'bg-sony-red text-white shadow-[0_0_14px_-4px_rgba(230,0,18,0.5)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`
          }
        >
          <Icon className="h-3.5 w-3.5" />
          {t.label}
        </NavLink>
      );
    })}
  </div>
);
