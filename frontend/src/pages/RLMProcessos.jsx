import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Workflow, Plus, Search, Eye, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useCrud } from '../hooks/useCrud';
import { EntityFormDialog } from '../components/EntityFormDialog';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { RlmTabs } from '../components/RlmTabs';
import { WaitingBadge } from '../components/WaitingBadge';
import api from '../lib/api';

export const stageBadgeClass = (key) => {
  if (key === 'pronto_royalties') return 'badge-success';
  if (key && key.startsWith('validacao')) return 'badge-info';
  return 'badge-warning';
};

const FIELDS = [
  { name: 'projeto', label: 'Projeto', required: true, fullWidth: true },
  { name: 'titulo', label: 'Título / Faixa' },
  { name: 'artistaPrincipal', label: 'Artista Principal' },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const RLMProcessos = () => {
  const navigate = useNavigate();
  const { items, loading, create, remove } = useCrud('/rlm-processes', 'Processo');
  const [stages, setStages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.get('/rlm/stages').then(({ data }) => setStages(data)).catch(() => {});
  }, []);

  const stageMap = useMemo(() => Object.fromEntries(stages.map((s) => [s.key, s])), [stages]);

  const filtered = useMemo(
    () => items.filter((p) => [p.projeto, p.titulo, p.artistaPrincipal].some((v) => (v || '').toLowerCase().includes(searchTerm.toLowerCase()))),
    [items, searchTerm]
  );

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="rlm-processos-page">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-sony-red/10 flex items-center justify-center"><Workflow className="h-5 w-5 text-sony-red" /></div>
          <div>
            <h1 className="heading-lg text-white" data-testid="rlm-processos-title">RLM · Fase 1</h1>
            <p className="body-sm text-zinc-500">Workflow de processos até a liberação do Cadastro de Royalties</p>
          </div>
        </div>
        <Button className="btn-sony" data-testid="new-process-btn" onClick={() => setFormOpen(true)}><Plus className="h-4 w-4 mr-2" />Novo Processo</Button>
      </motion.div>

      <motion.div variants={itemVariants}><RlmTabs /></motion.div>

      <motion.div variants={itemVariants}>
        <Card className="card-obsidian"><CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input placeholder="Buscar por projeto, título, artista..." className="input-obsidian pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} data-testid="search-processes-input" />
          </div>
        </CardContent></Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="card-obsidian" data-testid="processes-table-card"><CardContent className="p-4">
          <p className="font-heading font-semibold text-white uppercase tracking-wide text-sm mb-4">{filtered.length} Processo(s)</p>
          <div className="rounded-sm border border-white/10 overflow-hidden"><div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="table-header border-white/5">
                  <TableHead className="font-heading">Projeto</TableHead>
                  <TableHead className="font-heading">Título</TableHead>
                  <TableHead className="font-heading">Artista</TableHead>
                  <TableHead className="font-heading">Etapa Atual</TableHead>
                  <TableHead className="font-heading">Responsável</TableHead>
                  <TableHead className="font-heading">Atualizado</TableHead>
                  <TableHead className="font-heading text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 text-sony-red animate-spin mx-auto" /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-12 text-zinc-500">Nenhum processo encontrado</TableCell></TableRow>
                ) : filtered.map((p, index) => {
                  const meta = stageMap[p.status] || {};
                  return (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="table-row" data-testid={`process-row-${p.id}`}>
                      <TableCell className="font-medium text-white">{p.projeto}</TableCell>
                      <TableCell className="text-zinc-400">{p.titulo}</TableCell>
                      <TableCell className="text-zinc-400">{p.artistaPrincipal}</TableCell>
                      <TableCell><div className="flex items-center gap-2 flex-wrap"><Badge className={`${stageBadgeClass(p.status)} text-xs`}>{meta.order ? `${meta.order}. ` : ''}{meta.label || p.status}</Badge><WaitingBadge item={p} /></div></TableCell>
                      <TableCell className="text-zinc-400 text-xs">{meta.role || '—'}</TableCell>
                      <TableCell className="text-zinc-500 text-xs font-mono">{p.updatedAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5" onClick={() => navigate(`/rlm/processos/${p.id}`)} data-testid={`open-process-${p.id}`}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeleting(p)} data-testid={`delete-process-${p.id}`}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div></div>
        </CardContent></Card>
      </motion.div>

      <EntityFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={async (d) => { const p = await create(d); if (p?.id) navigate(`/rlm/processos/${p.id}`); }} fields={FIELDS} initialData={null} title="Novo Processo RLM" description="Inicie um novo processo da Fase 1" />
      <ConfirmDeleteDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={() => { remove(deleting.id); setDeleting(null); }} itemName={deleting?.projeto} />
    </motion.div>
  );
};

export default RLMProcessos;
