import React from 'react';
import { Plus, Trash2, SplitSquareHorizontal, AlertTriangle, CheckCircle2, Mic2 } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { BankSelect } from './BankSelect';
import { validateDoc, formatCpfCnpj } from '../lib/validators';

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Editor de participantes com alocação de royalties da faixa.
 * O artista principal detém o total; cada participante subtrai do total.
 * Todos os participantes exigem dados bancários.
 * props: participantes[], royaltyTotal, onChange(newArr), artistName
 */
export const ParticipantesEditor = ({ participantes = [], royaltyTotal = 0, onChange, artistName = 'Artista Principal' }) => {
  const total = Number(royaltyTotal) || 0;
  const allocated = round2(participantes.reduce((s, p) => s + (Number(p.royalty) || 0), 0));
  const artistShare = round2(total - allocated);
  const over = artistShare < -1e-9;
  const complete = Math.abs(artistShare) < 1e-9 && total > 0;
  const pct = total > 0 ? Math.min(100, (allocated / total) * 100) : 0;

  const add = () => { if (participantes.length < 20) onChange([...participantes, { nome: '', royalty: 0, cpfCnpj: '', banco: '', agencia: '', conta: '' }]); };
  const upd = (i, patch) => onChange(participantes.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const del = (i) => onChange(participantes.filter((_, idx) => idx !== i));

  const distribute = () => {
    const n = participantes.length;
    if (n === 0 || total <= 0) return;
    const base = round2(total / (n + 1)); // +1 para reservar parte ao artista principal
    onChange(participantes.map((p) => ({ ...p, royalty: base })));
  };

  return (
    <div data-testid="participantes-editor">
      {/* Resumo de alocação */}
      <div className="card-obsidian p-4 mb-3 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Label className="overline">Alocação de Royalties da Faixa</Label>
          <span className="text-xs text-zinc-400">Total da faixa: <strong className="text-white">{total}%</strong></span>
        </div>
        {/* Artista principal detém o restante */}
        <div className="flex items-center justify-between p-3 rounded-md bg-sony-red/10 border border-sony-red/30">
          <span className="flex items-center gap-2 text-sm text-white font-medium"><Mic2 className="h-4 w-4 text-sony-red" />{artistName || 'Artista Principal'} <span className="text-zinc-400 font-normal">(principal)</span></span>
          <span className={`text-sm font-bold ${over ? 'text-red-400' : 'text-white'}`}>{artistShare}%</span>
        </div>
        <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden">
          <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${over ? 'bg-red-500' : complete ? 'bg-emerald-500' : 'bg-sony-red'}`} style={{ width: `${over ? 100 : pct}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Participantes: <strong className="text-blue-400">{allocated}%</strong></span>
          {over ? (
            <span className="text-red-400 font-medium flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" />Excedeu em {Math.abs(artistShare)}%</span>
          ) : complete ? (
            <span className="text-emerald-400 font-medium flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />Totalmente alocado</span>
          ) : (
            <span className="text-zinc-300">Restante do artista: <strong className="text-white">{artistShare}%</strong></span>
          )}
        </div>
        {over && <p className="text-xs text-red-400">A soma dos participantes não pode ultrapassar o total da faixa ({total}%).</p>}
      </div>

      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
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

      <div className="space-y-3">
        {participantes.map((p, i) => {
          const docRes = validateDoc(p.cpfCnpj);
          const docBad = p.cpfCnpj && !docRes.valid;
          return (
            <div key={i} className="rounded-md border border-white/10 bg-white/[0.02] p-3" data-testid={`participante-card-${i}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-heading uppercase tracking-wider text-zinc-500">Participante {i + 1}</span>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-red-400" onClick={() => del(i)} data-testid={`del-participante-${i}`}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="sm:col-span-2 lg:col-span-1">
                  <Label className="overline block mb-1">Nome</Label>
                  <Input className="input-obsidian" placeholder="Nome do participante" value={p.nome} onChange={(e) => upd(i, { nome: e.target.value })} data-testid={`participante-nome-${i}`} />
                </div>
                <div>
                  <Label className="overline block mb-1">Royalty (%)</Label>
                  <Input type="number" className="input-obsidian" placeholder="0" value={p.royalty} onChange={(e) => upd(i, { royalty: Number(e.target.value) })} data-testid={`participante-royalty-${i}`} />
                </div>
                <div>
                  <Label className="overline block mb-1">CPF / CNPJ</Label>
                  <Input className={`input-obsidian ${docBad ? '!border-red-500' : (docRes.valid && p.cpfCnpj) ? '!border-emerald-500' : ''}`} placeholder="CPF ou CNPJ" value={p.cpfCnpj || ''} onChange={(e) => upd(i, { cpfCnpj: formatCpfCnpj(e.target.value) })} data-testid={`participante-doc-${i}`} />
                </div>
                <div>
                  <Label className="overline block mb-1">Banco</Label>
                  <BankSelect value={p.banco} onChange={(v) => upd(i, { banco: v })} testid={`participante-banco-${i}`} />
                </div>
                <div>
                  <Label className="overline block mb-1">Agência</Label>
                  <Input className="input-obsidian" placeholder="Agência" value={p.agencia || ''} onChange={(e) => upd(i, { agencia: e.target.value })} data-testid={`participante-agencia-${i}`} />
                </div>
                <div>
                  <Label className="overline block mb-1">Conta</Label>
                  <Input className="input-obsidian" placeholder="Conta" value={p.conta || ''} onChange={(e) => upd(i, { conta: e.target.value })} data-testid={`participante-conta-${i}`} />
                </div>
              </div>
            </div>
          );
        })}
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
