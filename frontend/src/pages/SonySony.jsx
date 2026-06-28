import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Music, Plus, Search, Edit, Trash2, Loader2, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useCrud } from '../hooks/useCrud';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/Pagination';
import { exportToCsv } from '../lib/exportCsv';
import { EntityFormDialog } from '../components/EntityFormDialog';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { ViewToggle } from '../components/ViewToggle';
import { ContractCalendar } from '../components/ContractCalendar';

const EXPORT_COLS = [
  { key: 'codigo', label: 'Código' }, { key: 'projeto', label: 'Projeto' }, { key: 'artistaPrincipal', label: 'Artista Principal' },
  { key: 'artistaConvidado', label: 'Convidado' }, { key: 'selo', label: 'Selo' }, { key: 'tipo', label: 'Tipo' },
  { key: 'lancamento', label: 'Lançamento' }, { key: 'status', label: 'Status' },
];

const STATUS = ['Pendente', 'Em Análise', 'Finalizado'];
const FIELDS = [
  { name: 'codigo', label: 'Código', required: true, placeholder: 'SONY-2025-XXX' },
  { name: 'projeto', label: 'Projeto', required: true },
  { name: 'artistaPrincipal', label: 'Artista Principal', required: true },
  { name: 'artistaConvidado', label: 'Artista Convidado' },
  { name: 'selo', label: 'Selo' },
  { name: 'tipo', label: 'Tipo', type: 'select', options: ['Single', 'EP', 'Album Completo', 'Live Album', 'Compilation'], default: 'Single' },
  { name: 'lancamento', label: 'Lançamento', placeholder: 'dd/mm/aaaa' },
  { name: 'status', label: 'Status', type: 'select', options: STATUS, default: 'Pendente' },
];

const getStatusBadgeClass = (status) => ({ 'Finalizado': 'badge-success', 'Em Análise': 'badge-info', 'Pendente': 'badge-warning' }[status] || 'badge-info');
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const SonySony = () => {
  const { items, loading, create, update, remove } = useCrud('/sony-sony', 'Projeto');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('table');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(
    () => items.filter((p) => Object.values(p).some((v) => v?.toString().toLowerCase().includes(searchTerm.toLowerCase()))),
    [items, searchTerm]
  );
  const pager = usePagination(filtered, 8);
  const statusCount = {
    'Finalizado': items.filter((l) => l.status === 'Finalizado').length,
    'Em Análise': items.filter((l) => l.status === 'Em Análise').length,
    'Pendente': items.filter((l) => l.status === 'Pendente').length,
  };

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (item) => { setEditing(item); setFormOpen(true); };
  const handleSubmit = async (data) => { editing ? await update(editing.id, data) : await create(data); };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="sony-sony-page">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-violet-500/10 flex items-center justify-center"><Music className="h-5 w-5 text-violet-400" /></div>
          <div>
            <h1 className="heading-lg text-white" data-testid="sony-sony-title">Sony/Sony</h1>
            <p className="body-sm text-zinc-500">Colaborações entre artistas Sony Music</p>
          </div>
        </div>
        <Button className="btn-sony" data-testid="new-sony-project-btn" onClick={openNew}><Plus className="h-4 w-4 mr-2" />Novo Projeto</Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="card-obsidian"><CardContent className="p-4"><p className="overline">Total</p><p className="font-heading font-bold text-3xl text-white mt-1" data-testid="stat-total">{items.length}</p></CardContent></Card>
        <Card className="card-obsidian"><CardContent className="p-4"><p className="overline">Finalizado</p><p className="font-heading font-bold text-3xl text-emerald-400 mt-1">{statusCount['Finalizado']}</p></CardContent></Card>
        <Card className="card-obsidian"><CardContent className="p-4"><p className="overline">Em Análise</p><p className="font-heading font-bold text-3xl text-blue-400 mt-1">{statusCount['Em Análise']}</p></CardContent></Card>
        <Card className="card-obsidian"><CardContent className="p-4"><p className="overline">Pendente</p><p className="font-heading font-bold text-3xl text-amber-400 mt-1">{statusCount['Pendente']}</p></CardContent></Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="card-obsidian"><CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input placeholder="Buscar por projeto, artista, selo..." className="input-obsidian pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} data-testid="search-sony-projects-input" />
            </div>
            <ViewToggle view={view} onChange={setView} testid="sony-sony-view-toggle" />
            <Button variant="outline" className="btn-sony-outline" onClick={() => exportToCsv('sony-sony', EXPORT_COLS, filtered)} data-testid="export-btn"><Download className="h-4 w-4 mr-2" />Exportar</Button>
          </div>
        </CardContent></Card>
      </motion.div>

      {view === 'calendar' ? (
        <motion.div variants={itemVariants}>
          <ContractCalendar items={filtered} dateField="lancamento" getPrimary={(i) => i.projeto} getSecondary={(i) => `${i.artistaPrincipal} • ${i.codigo}`} getArtistTrack={(i) => ({ artist: i.artistaPrincipal, track: i.projeto })} testid="sony-sony-calendar" />
        </motion.div>
      ) : (
      <motion.div variants={itemVariants}>
        <Card className="card-obsidian" data-testid="sony-projects-table-card"><CardContent className="p-4">
          <p className="font-heading font-semibold text-white uppercase tracking-wide text-sm mb-4">{filtered.length} Projeto(s)</p>
          <div className="rounded-sm border border-white/10 overflow-hidden"><div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="table-header border-white/5">
                  <TableHead className="font-heading">Código</TableHead><TableHead className="font-heading">Projeto</TableHead>
                  <TableHead className="font-heading">Artista Principal</TableHead><TableHead className="font-heading">Convidado</TableHead>
                  <TableHead className="font-heading">Selo</TableHead><TableHead className="font-heading">Tipo</TableHead>
                  <TableHead className="font-heading">Lançamento</TableHead><TableHead className="font-heading">Status</TableHead>
                  <TableHead className="font-heading text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-12"><Loader2 className="h-6 w-6 text-sony-red animate-spin mx-auto" /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-12 text-zinc-500">Nenhum projeto encontrado</TableCell></TableRow>
                ) : pager.pageItems.map((projeto, index) => (
                  <motion.tr key={projeto.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="table-row" data-testid={`sony-project-row-${projeto.id}`}>
                    <TableCell className="font-mono text-xs font-medium text-white">{projeto.codigo}</TableCell>
                    <TableCell className="font-medium text-white">{projeto.projeto}</TableCell>
                    <TableCell className="text-zinc-400">{projeto.artistaPrincipal}</TableCell>
                    <TableCell className="text-zinc-400">{projeto.artistaConvidado}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">{projeto.selo}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-xs">{projeto.tipo}</Badge></TableCell>
                    <TableCell className="text-zinc-400 font-mono text-xs">{projeto.lancamento}</TableCell>
                    <TableCell><Badge className={`${getStatusBadgeClass(projeto.status)} text-xs`}>{projeto.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5" data-testid={`edit-sony-project-${projeto.id}`} onClick={() => openEdit(projeto)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10" data-testid={`delete-sony-project-${projeto.id}`} onClick={() => setDeleting(projeto)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div></div>
          <Pagination page={pager.page} totalPages={pager.totalPages} total={pager.total} from={pager.from} to={pager.to} onPage={pager.setPage} testid="sony-sony-pagination" />
        </CardContent></Card>
      </motion.div>
      )}

      <EntityFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} fields={FIELDS} initialData={editing} title={editing ? 'Editar Projeto' : 'Novo Projeto'} description="Preencha os dados da colaboração Sony/Sony" />
      <ConfirmDeleteDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={() => { remove(deleting.id); setDeleting(null); }} itemName={deleting?.projeto} />
    </motion.div>
  );
};

export default SonySony;
