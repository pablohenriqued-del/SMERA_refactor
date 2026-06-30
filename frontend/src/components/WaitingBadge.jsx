import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

const THRESHOLD_DAYS = 3; // amber alert after this many days without return

export function waitingInfo(item) {
  if (!item || item.status !== 'aguardando_escritorio') return null;
  if ((item.escritorioSubmissionCount || 0) > 0) return null; // already returned
  if (!item.escritorioSentAt) return null;
  const sent = new Date(item.escritorioSentAt);
  if (isNaN(sent.getTime())) return null;
  const days = Math.max(0, Math.floor((Date.now() - sent.getTime()) / 86400000));
  return { days, overdue: days >= THRESHOLD_DAYS };
}

export const WaitingBadge = ({ item, className = '' }) => {
  const info = waitingInfo(item);
  if (!info) return null;
  const label = info.days === 0 ? 'Enviado hoje' : info.overdue
    ? `Aguardando retorno há ${info.days}d`
    : `Enviado há ${info.days}d`;
  const Icon = info.overdue ? AlertTriangle : Clock;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${className} ${
        info.overdue ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-white/5 text-zinc-400 border-white/10'
      }`}
      data-testid="waiting-badge"
    >
      <Icon className="h-3 w-3" />{label}
    </span>
  );
};
