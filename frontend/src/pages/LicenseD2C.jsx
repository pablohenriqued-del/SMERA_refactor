import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Package, Loader2, Download } from 'lucide-react';
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

const STATUS = ['Pendente', 'Em Análise', 'Finalizado'];
const TIPOS = ['Vinil', 'CD', 'Box Set', 'Camiseta', 'Pôster', 'Combo', 'Fita K7', 'Caneca'];
const FORMATOS = ['Edição Limitada', 'Edição Standard', 'Edição Deluxe', 'Colecionador'];

const FIELDS = [
  { name: 'projeto', label: 'Projeto', required: true, fullWidth: true },
  { name: 'titulo', label: 'Título / Faixa', required: true },
  { name: 'artistaSony', label: 'Artista Sony', required: true },
  { name: 'cliente', label: 'Cliente / Loja' },
  { name: 'tipo', label: 'Produto', type: 'select', options: TIPOS, default: 'Vinil' },
  { name: 'formato', label: 'Formato', type: 'select', options: FORMATOS, default: 'Edição Limitada' },
  { name: 'quantidade', label: 'Quantidade', type: 'number' },
  { name: 'prazo', label: 'Prazo', placeholder: 'dd/mm/aaaa' },
  { name: 'status', label: 'Status', type: 'select', options: STATUS, default: 'Pendente' },
];

const EXPORT_COLS = [
  { key: 'projeto', label: 'Projeto' }, { key: 'titulo', label: 'Título' }, { key: 'artistaSony', label: 'Artista Sony' },
  { key: 'cliente', label: 'Cliente' }, { key: 'tipo', label: 'Produto' }, { key: 'formato', label: 'Formato' },
  { key: 'quantidade', label: 'Quantidade' }, { key: 'prazo', label: 'Prazo' }, { key: 'status', label: 'Status' },
];

const getStatusBadgeClass = (status) => ({ 'Finalizado': 'badge-success', 'Em Análise': 'badge-info', 'Pendente': 'badge-warning' }[status] || 'badge-info');
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const LicenseD2C = () => {
  const { items, loading, create, update, remove } = useCrud('/licenses-d2c', 'Licenciamento D2C');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('table');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(
    () => items.filter((l) => Object.values(l).some((v) => v?.toString().toLowerCase().includes(searchTerm.toLowerCase()))),
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
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="license-d2c-page">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-emerald-500/10 flex items-center justify-center"><Package className="h-5 w-5 text-emerald-400" /></div>
          <div>
            <h1 className="heading-lg text-white" data-testid="license-d2c-title">Licenciamento D2C</h1>
            <p className="body-sm text-zinc-500">Produtos físicos (Direct-to-Consumer)</p>
          </div>
        </div>
        <Button className="btn-sony" data-testid="new-license-d2c-btn" onClick={openNew}><Plus className="h-4 w-4 mr-2" />Novo Licenciamento</Button>
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
              <Input placeholder="Buscar por projeto, cliente, produto..." className="input-obsidian pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} data-testid="search-license-d2c-input" />
            </div>
            <ViewToggle view={view} onChange={setView} testid="license-d2c-view-toggle" />
            <Button variant="outline" className="btn-sony-outline" onClick={() => exportToCsv('license-d2c', EXPORT_COLS, filtered)} data-testid="export-btn"><Download className="h-4 w-4 mr-2" />Exportar</Button>
          </div>
        </CardContent></Card>
      </motion.div>

      {view === 'calendar' ? (
        <motion.div variants={itemVariants}>
          <ContractCalendar items={filtered} dateField="prazo" getPrimary={(i) => i.projeto} getSecondary={(i) => `${i.tipo} • ${i.cliente}`} getArtistTrack={(i) => ({ artist: i.artistaSony, track: i.titulo })} testid="license-d2c-calendar" />
        </motion.div>
      ) : (
      <motion.div variants={itemVariants}>
        <Card className="card-obsidian" data-testid="license-d2c-table-card"><CardContent className="p-4">
          <p className="font-heading font-semibold text-white uppercase tracking-wide text-sm mb-4">{filtered.length} Licenciamento(s)</p>
          <div className="rounded-sm border border-white/10 overflow-hidden"><div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="table-header border-white/5">
                  <TableHead className="font-heading">Projeto</TableHead><TableHead className="font-heading">Título</TableHead>
                  <TableHead className="font-heading">Artista Sony</TableHead><TableHead className="font-heading">Cliente</TableHead>
                  <TableHead className="font-heading">Produto</TableHead><TableHead className="font-heading">Formato</TableHead>
                  <TableHead className="font-heading">Qtd</TableHead><TableHead className="font-heading">Prazo</TableHead>
                  <TableHead className="font-heading">Status</TableHead><TableHead className="font-heading text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-12"><Loader2 className="h-6 w-6 text-sony-red animate-spin mx-auto" /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-12 text-zinc-500">Nenhum licenciamento encontrado</TableCell></TableRow>
                ) : pager.pageItems.map((lic, index) => (
                  <motion.tr key={lic.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="table-row" data-testid={`license-d2c-row-${lic.id}`}>
                    <TableCell className="font-medium text-white max-w-[220px] truncate">{lic.projeto}</TableCell>
                    <TableCell className="text-zinc-400">{lic.titulo}</TableCell>
                    <TableCell className="text-zinc-400">{lic.artistaSony}</TableCell>
                    <TableCell className="text-zinc-400">{lic.cliente}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">{lic.tipo}</Badge></TableCell>
                    <TableCell className="text-zinc-400 text-xs">{lic.formato}</TableCell>
                    <TableCell className="text-zinc-400 font-mono text-xs">{lic.quantidade}</TableCell>
                    <TableCell className="text-zinc-400 font-mono text-xs">{lic.prazo}</TableCell>
                    <TableCell><Badge className={`${getStatusBadgeClass(lic.status)} text-xs`}>{lic.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5" data-testid={`edit-license-d2c-${lic.id}`} onClick={() => openEdit(lic)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10" data-testid={`delete-license-d2c-${lic.id}`} onClick={() => setDeleting(lic)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div></div>
          <Pagination page={pager.page} totalPages={pager.totalPages} total={pager.total} from={pager.from} to={pager.to} onPage={pager.setPage} testid="license-d2c-pagination" />
        </CardContent></Card>
      </motion.div>
      )}

      <EntityFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} fields={FIELDS} initialData={editing} title={editing ? 'Editar Licenciamento D2C' : 'Novo Licenciamento D2C'} description="Produtos físicos (Direct-to-Consumer)" />
      <ConfirmDeleteDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={() => { remove(deleting.id); setDeleting(null); }} itemName={deleting?.projeto} />
    </motion.div>
  );
};

export default LicenseD2C;
