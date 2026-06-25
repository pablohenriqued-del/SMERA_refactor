import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, FileInput, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useCrud } from '../hooks/useCrud';
import { EntityFormDialog } from '../components/EntityFormDialog';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';

const STATUS = ['Pendente', 'Em Análise', 'Finalizado'];
const FIELDS = [
  { name: 'projeto', label: 'Projeto', required: true },
  { name: 'titulo', label: 'Título', required: true },
  { name: 'artista', label: 'Artista Sony', required: true },
  { name: 'artistasConvidados', label: 'Artistas Convidados' },
  { name: 'proRata', label: 'Pro-Rata', type: 'select', options: ['Não', 'Sim'], default: 'Não' },
  { name: 'previsao', label: 'Previsão', placeholder: 'dd/mm/aaaa' },
  { name: 'formato', label: 'Formato' },
  { name: 'meios', label: 'Meios', type: 'select', options: ['Físico e Digital', 'Digital', 'Físico'], default: 'Físico e Digital' },
  { name: 'status', label: 'Status', type: 'select', options: STATUS, default: 'Pendente' },
];

const getStatusBadgeClass = (status) => ({ 'Finalizado': 'badge-success', 'Em Análise': 'badge-info', 'Pendente': 'badge-warning' }[status] || 'badge-info');
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const LicenseIn = () => {
  const { items, loading, create, update, remove } = useCrud('/licenses-in', 'Licença');
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(
    () => items.filter((l) => Object.values(l).some((v) => v?.toString().toLowerCase().includes(searchTerm.toLowerCase()))),
    [items, searchTerm]
  );

  const statusCount = {
    'Finalizado': items.filter((l) => l.status === 'Finalizado').length,
    'Em Análise': items.filter((l) => l.status === 'Em Análise').length,
    'Pendente': items.filter((l) => l.status === 'Pendente').length,
  };

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (item) => { setEditing(item); setFormOpen(true); };
  const handleSubmit = async (data) => { editing ? await update(editing.id, data) : await create(data); };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="license-in-page">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-sony-red/10 flex items-center justify-center"><FileInput className="h-5 w-5 text-sony-red" /></div>
          <div>
            <h1 className="heading-lg text-white" data-testid="license-in-title">License In</h1>
            <p className="body-sm text-zinc-500">Gerencie licenças de entrada</p>
          </div>
        </div>
        <Button className="btn-sony" data-testid="new-license-btn" onClick={openNew}><Plus className="h-4 w-4 mr-2" />Novo Pedido</Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="card-obsidian"><CardContent className="p-4"><p className="overline">Total</p><p className="font-heading font-bold text-3xl text-white mt-1" data-testid="stat-total">{items.length}</p></CardContent></Card>
        <Card className="card-obsidian"><CardContent className="p-4"><p className="overline">Finalizado</p><p className="font-heading font-bold text-3xl text-emerald-400 mt-1">{statusCount['Finalizado']}</p></CardContent></Card>
        <Card className="card-obsidian"><CardContent className="p-4"><p className="overline">Em Análise</p><p className="font-heading font-bold text-3xl text-blue-400 mt-1">{statusCount['Em Análise']}</p></CardContent></Card>
        <Card className="card-obsidian"><CardContent className="p-4"><p className="overline">Pendente</p><p className="font-heading font-bold text-3xl text-amber-400 mt-1">{statusCount['Pendente']}</p></CardContent></Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="card-obsidian"><CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input placeholder="Buscar por projeto, artista, título..." className="input-obsidian pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} data-testid="search-licenses-input" />
          </div>
        </CardContent></Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="card-obsidian" data-testid="licenses-table-card"><CardContent className="p-4">
          <p className="font-heading font-semibold text-white uppercase tracking-wide text-sm mb-4">{filtered.length} Licença(s)</p>
          <div className="rounded-sm border border-white/10 overflow-hidden"><div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="table-header border-white/5">
                  <TableHead className="font-heading">Projeto</TableHead><TableHead className="font-heading">Título</TableHead>
                  <TableHead className="font-heading">Artista Sony</TableHead><TableHead className="font-heading">Convidados</TableHead>
                  <TableHead className="font-heading">Pro-Rata</TableHead><TableHead className="font-heading">Previsão</TableHead>
                  <TableHead className="font-heading">Meios</TableHead><TableHead className="font-heading">Status</TableHead>
                  <TableHead className="font-heading text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-12"><Loader2 className="h-6 w-6 text-sony-red animate-spin mx-auto" /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-12 text-zinc-500">Nenhuma licença encontrada</TableCell></TableRow>
                ) : filtered.map((license, index) => (
                  <motion.tr key={license.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="table-row" data-testid={`license-row-${license.id}`}>
                    <TableCell className="font-medium text-white">{license.projeto}</TableCell>
                    <TableCell className="text-zinc-400">{license.titulo}</TableCell>
                    <TableCell className="text-zinc-400">{license.artista}</TableCell>
                    <TableCell className="text-zinc-400">{license.artistasConvidados}</TableCell>
                    <TableCell className="text-zinc-400">{license.proRata}</TableCell>
                    <TableCell className="text-zinc-400 font-mono text-xs">{license.previsao}</TableCell>
                    <TableCell className="text-zinc-400 text-xs">{license.meios}</TableCell>
                    <TableCell><Badge className={`${getStatusBadgeClass(license.status)} text-xs`}>{license.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5" data-testid={`edit-license-${license.id}`} onClick={() => openEdit(license)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10" data-testid={`delete-license-${license.id}`} onClick={() => setDeleting(license)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div></div>
        </CardContent></Card>
      </motion.div>

      <EntityFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} fields={FIELDS} initialData={editing} title={editing ? 'Editar Licença' : 'Novo Pedido'} description="Preencha os dados da licença de entrada" />
      <ConfirmDeleteDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={() => { remove(deleting.id); setDeleting(null); }} itemName={deleting?.projeto} />
    </motion.div>
  );
};

export default LicenseIn;
