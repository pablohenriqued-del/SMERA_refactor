import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

export const Pagination = ({ page, totalPages, total, from, to, onPage, testid = 'pagination' }) => {
  if (total === 0) return null;
  // build a compact window of page numbers
  const pages = [];
  const start = Math.max(1, Math.min(page - 1, totalPages - 2));
  const end = Math.min(totalPages, start + 2);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5" data-testid={testid}>
      <p className="text-sm text-zinc-500">
        Mostrando <span className="text-white font-medium">{from}</span>–<span className="text-white font-medium">{to}</span> de{' '}
        <span className="text-white font-medium">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white disabled:opacity-30" disabled={page <= 1} onClick={() => onPage(page - 1)} data-testid={`${testid}-prev`}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((p) => (
          <Button key={p} variant="ghost" size="sm" onClick={() => onPage(p)}
            className={`h-8 w-8 rounded-sm ${p === page ? 'bg-sony-red text-white' : 'text-zinc-500 hover:text-white'}`}
            data-testid={`${testid}-page-${p}`}>
            {p}
          </Button>
        ))}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white disabled:opacity-30" disabled={page >= totalPages} onClick={() => onPage(page + 1)} data-testid={`${testid}-next`}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
