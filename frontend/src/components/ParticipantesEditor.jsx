import React from 'react';
import { Plus, Trash2, SplitSquareHorizontal, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Visual editor for track participants with royalty allocation.
 * Sum of participant royalties cannot exceed the track total (royaltyTotal).
 * props: participantes[], royaltyTotal (number), onChange(newArr)
 */
export const ParticipantesEditor = ({ participantes = [], royaltyTotal = 0, onChange }) => {
  const total = Number(royaltyTotal) || 0;
  const allocated = round2(participantes.reduce((s, p) => s + (Number(p.royalty) || 0), 0));
  const remaining = round2(total - allocated);
  const over = remaining < -1e-9;
  const complete = Math.abs(remaining) < 1e-9 && total > 0;
  const pct = total > 0 ? Math.min(100, (allocated / total) * 100) : 0;

  const add = () => { if (participantes.length < 20) onChange([...participantes, { nome: '', royalty: 0 }]); };
  const upd = (i, patch) => onChange(participantes.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const del = (i) => onChange(participantes.filter((_, idx) => idx !== i));

  const distribute = () => {
    const n = participantes.length;
    if (n === 0 || total <= 0) return;
    const base = round2(total / n);
    const arr = participantes.map((p, idx) => ({
      ...p,
      royalty: idx === n - 1 ? round2(total - base * (n - 1)) : base,
    }));
    onChange(arr);
  };

  return (
    <div data-testid="participantes-editor">
      {/* Allocation summary */}
      <div className="card-obsidian p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <Label className="overline">Alocação de Royalties da Faixa</Label>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-zinc-400">Total: <strong className="text-white">{total}%</strong></span>
            <span className="text-zinc-400">Alocado: <strong className="text-blue-400">{allocated}%</strong></span>
            {over ? (
              <span className="text-red-400 font-medium flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" />Excedeu {Math.abs(remaining)}%</span>
            ) : complete ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />Completo</span>
            ) : (
              <span className="text-amber-400 font-medium">Faltam {remaining}%</span>
            )}
          </div>
        </div>
        <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${over ? 'bg-red-500' : complete ? 'bg-emerald-500' : 'bg-sony-red'}`}
            style={{ width: `${over ? 100 : pct}%` }}
          />
        </div>
        {over && <p className="text-xs text-red-400 mt-2">A soma dos participantes não pode ultrapassar o total da faixa ({total}%).</p>}
      </div>

      <div className="flex items-center justify-between mb-2">
        <Label className="overline">Participantes ({participantes.length}/20)</Label>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" className="btn-sony-outline !py-1 !px-3 text-xs" onClick={distribute} disabled={participantes.length === 0 || total <= 0} data-testid="distribute-btn">
            <SplitSquareHorizontal className="h-3 w-3 mr-1" />Distribuir igualmente
          </Button>
          <Button type="button" variant="outline" size="sm" className="btn-sony-outline !py-1 !px-3 text-xs" onClick={add} disabled={participantes.length >= 20} data-testid="add-participante-btn">
            <Plus className="h-3 w-3 mr-1" />Adicionar
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {participantes.map((p, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input className="input-obsidian flex-1" placeholder="Nome do participante" value={p.nome} onChange={(e) => upd(i, { nome: e.target.value })} data-testid={`participante-nome-${i}`} />
            <div className="relative w-32">
              <Input type="number" className={`input-obsidian pr-7 ${over ? '!border-red-500/50' : ''}`} placeholder="0" value={p.royalty} onChange={(e) => upd(i, { royalty: Number(e.target.value) })} data-testid={`participante-royalty-${i}`} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">%</span>
            </div>
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-red-400" onClick={() => del(i)} data-testid={`del-participante-${i}`}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        {participantes.length === 0 && <p className="text-xs text-zinc-600">Nenhum participante adicionado.</p>}
      </div>
    </div>
  );
};

export const isAllocationValid = (participantes = [], royaltyTotal = 0) => {
  const total = Number(royaltyTotal) || 0;
  const allocated = participantes.reduce((s, p) => s + (Number(p.royalty) || 0), 0);
  return allocated <= total + 1e-9;
};
