import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const WEEKDAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const getStatusBadgeClass = (status) => ({
  'Finalizado': 'badge-success', 'Em Análise': 'badge-info', 'Pendente': 'badge-warning',
  'Ativo': 'badge-success', 'Em Renovação': 'badge-warning', 'Próximo a Vencer': 'badge-error',
}[status] || 'badge-info');

// parse "dd/mm/yyyy" -> {d, m, y} (m is 1-12) or null
const parseDate = (str) => {
  if (!str || typeof str !== 'string') return null;
  const parts = str.split('/');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map((n) => parseInt(n, 10));
  if (!d || !m || !y) return null;
  return { d, m, y };
};

const dayKey = (y, m, d) => `${y}-${m}-${d}`;

/**
 * Timeline/calendar visualization for contracts.
 * props: items[], dateField, getPrimary(item), getSecondary(item)
 */
export const ContractCalendar = ({ items, dateField, getPrimary, getSecondary, testid = 'contract-calendar' }) => {
  // group items by day key + collect available months
  const { byDay, months } = useMemo(() => {
    const map = {};
    const monthSet = new Map();
    items.forEach((item) => {
      const parsed = parseDate(item[dateField]);
      if (!parsed) return;
      const key = dayKey(parsed.y, parsed.m, parsed.d);
      (map[key] = map[key] || []).push(item);
      monthSet.set(`${parsed.y}-${parsed.m}`, { y: parsed.y, m: parsed.m });
    });
    const monthsArr = [...monthSet.values()].sort((a, b) => a.y - b.y || a.m - b.m);
    return { byDay: map, months: monthsArr };
  }, [items, dateField]);

  const [monthIdx, setMonthIdx] = useState(0);
  const [selectedKey, setSelectedKey] = useState(null);

  const current = months[monthIdx] || (months.length ? months[0] : { y: 2026, m: 6 });

  // pick first day-with-contracts in current month when month changes
  useEffect(() => {
    if (!months.length) return;
    const cur = months[monthIdx] || months[0];
    const daysWith = Object.keys(byDay)
      .map((k) => k.split('-').map(Number))
      .filter(([y, m]) => y === cur.y && m === cur.m)
      .sort((a, b) => a[2] - b[2]);
    setSelectedKey(daysWith.length ? dayKey(daysWith[0][0], daysWith[0][1], daysWith[0][2]) : null);
  }, [monthIdx, months, byDay]);

  if (!months.length) {
    return (
      <Card className="card-obsidian" data-testid={testid}>
        <CardContent className="py-16 text-center text-zinc-500">
          <CalendarDays className="h-10 w-10 mx-auto mb-3 text-zinc-700" />
          Nenhum contrato com data para exibir na timeline
        </CardContent>
      </Card>
    );
  }

  const firstWeekday = new Date(current.y, current.m - 1, 1).getDay();
  const daysInMonth = new Date(current.y, current.m, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthCount = Object.keys(byDay)
    .filter((k) => { const [y, m] = k.split('-').map(Number); return y === current.y && m === current.m; })
    .reduce((acc, k) => acc + byDay[k].length, 0);

  const selectedItems = selectedKey ? (byDay[selectedKey] || []) : [];
  const selectedDay = selectedKey ? Number(selectedKey.split('-')[2]) : null;

  return (
    <Card className="card-obsidian" data-testid={testid}>
      <CardContent className="p-4 lg:p-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-sony-red/10 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-sony-red" />
            </div>
            <div>
              <p className="font-heading font-medium text-white text-lg">{MONTHS_PT[current.m - 1]} {current.y}</p>
              <p className="text-xs text-zinc-500">{monthCount} contrato(s) neste mês</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMonthIdx((i) => Math.max(0, i - 1))}
              disabled={monthIdx === 0}
              className="h-9 w-9 flex items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              data-testid={`${testid}-prev-month`}
            ><ChevronLeft className="h-5 w-5" /></button>
            <button
              onClick={() => setMonthIdx((i) => Math.min(months.length - 1, i + 1))}
              disabled={monthIdx >= months.length - 1}
              className="h-9 w-9 flex items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              data-testid={`${testid}-next-month`}
            ><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {WEEKDAYS_PT.map((w) => (
                <div key={w} className="text-center text-[10px] font-heading font-semibold uppercase tracking-wider text-zinc-600 py-1">{w}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((d, i) => {
                if (d === null) return <div key={`b-${i}`} />;
                const key = dayKey(current.y, current.m, d);
                const dayItems = byDay[key] || [];
                const hasItems = dayItems.length > 0;
                const isSelected = key === selectedKey;
                return (
                  <button
                    key={key}
                    onClick={() => hasItems && setSelectedKey(key)}
                    disabled={!hasItems}
                    data-testid={`${testid}-day-${d}`}
                    className={`relative aspect-square rounded-md flex flex-col items-center justify-center text-sm transition-all duration-200
                      ${isSelected ? 'bg-sony-red text-white shadow-[0_0_18px_-4px_rgba(230,0,18,0.5)]'
                        : hasItems ? 'bg-sony-red/10 text-white border border-sony-red/30 hover:bg-sony-red/20 cursor-pointer'
                        : 'text-zinc-600 border border-transparent cursor-default'}`}
                  >
                    <span className={hasItems ? 'font-semibold' : ''}>{d}</span>
                    {hasItems && (
                      <span className={`mt-0.5 text-[9px] font-bold px-1.5 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-sony-red text-white'}`}>
                        {dayItems.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day detail */}
          <div className="lg:border-l lg:border-white/5 lg:pl-6">
            <p className="overline mb-3">
              {selectedDay ? `${String(selectedDay).padStart(2, '0')} de ${MONTHS_PT[current.m - 1]}` : 'Selecione uma data'}
            </p>
            <div className="space-y-2 max-h-[360px] overflow-y-auto scrollbar-thin pr-1" data-testid={`${testid}-day-list`}>
              {selectedItems.length === 0 ? (
                <p className="text-sm text-zinc-500 py-6 text-center">Nenhum contrato nesta data</p>
              ) : selectedItems.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="p-3 rounded-md border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors"
                  data-testid={`${testid}-event`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-white text-sm leading-tight">{getPrimary(item)}</p>
                    <Badge className={`${getStatusBadgeClass(item.status)} text-[10px] shrink-0`}>{item.status}</Badge>
                  </div>
                  {getSecondary && <p className="text-xs text-zinc-500">{getSecondary(item)}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
