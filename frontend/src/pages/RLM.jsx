import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Search, Eye, Edit, Trash2, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useCrud } from '../hooks/useCrud';
import { EntityFormDialog } from '../components/EntityFormDialog';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { RlmTabs } from '../components/RlmTabs';

const STATUS = ['Ativo', 'Em Renovação', 'Próximo a Vencer'];
const FIELDS = [
  { name: 'codigo', label: 'Código', required: true, placeholder: 'RLM-2025-XXX' },
  { name: 'obra', label: 'Obra', required: true },
  { name: 'titular', label: 'Titular', required: true },
  { name: 'tipo', label: 'Tipo', type: 'select', options: ['Master', 'Publishing', 'Sync', 'Performance'], default: 'Master' },
  { name: 'territorio', label: 'Território' },
  { name: 'vencimento', label: 'Vencimento', placeholder: 'dd/mm/aaaa' },
  { name: 'valor', label: 'Valor', placeholder: 'R$ 0' },
  { name: 'status', label: 'Status', type: 'select', options: STATUS, default: 'Ativo' },
];

const getStatusBadgeClass = (status) => ({ 'Ativo': 'badge-success', 'Em Renovação': 'badge-warning', 'Próximo a Vencer': 'badge-error' }[status] || 'badge-info');
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const RLM = () => {
  const navigate = useNavigate();
  const { items, loading, create, update, remove } = useCrud('/rlm-rights', 'Direito');
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(
    () => items.filter((d) => Object.values(d).some((v) => v?.toString().toLowerCase().includes(searchTerm.toLowerCase()))),
    [items, searchTerm]
  );

  const stats = [
    { title: 'Total de Direitos', value: items.length, icon: Shield, gradient: 'from-sony-red to-red-600' },
    { title: 'Ativos', value: items.filter((d) => d.status === 'Ativo').length, icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600' },
    { title: 'Em Renovação', value: items.filter((d) => d.status === 'Em Renovação').length, icon: Clock, gradient: 'from-amber-500 to-amber-600' },
    { title: 'Próximos a Vencer', value: items.filter((d) => d.status === 'Próximo a Vencer').length, icon: AlertTriangle, gradient: 'from-red-500 to-red-600' },
  ];

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (item) => { setEditing(item); setFormOpen(true); };
  const handleSubmit = async (data) => { editing ? await update(editing.id, data) : await create(data); };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="rlm-page">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-sony-red/10 flex items-center justify-center"><Shield className="h-5 w-5 text-sony-red" /></div>
          <div>
            <h1 className="heading-lg text-white" data-testid="rlm-title">RLM · Fase 2</h1>
            <p className="body-sm text-zinc-500">Cadastro de Royalties / Direitos</p>
          </div>
        </div>
        <Button className="btn-sony" data-testid="new-right-btn" onClick={openNew}><Plus className="h-4 w-4 mr-2" />Novo Direito</Button>
      </motion.div>

      <motion.div variants={itemVariants}><RlmTabs /></motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-obsidian" data-testid={`rlm-stat-${index}`}><CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div><p className="overline">{stat.title}</p><p className="font-heading font-bold text-2xl text-white mt-1">{stat.value}</p></div>
                <div className={`w-10 h-10 rounded-sm bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}><Icon className="h-5 w-5 text-white" /></div>
              </div>
            </CardContent></Card>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="card-obsidian"><CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input placeholder="Buscar por código, obra, titular..." className="input-obsidian pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} data-testid="search-rights-input" />
          </div>
        </CardContent></Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="card-obsidian" data-testid="rights-table-card"><CardContent className="p-4">
          <p className="font-heading font-semibold text-white uppercase tracking-wide text-sm mb-4">{filtered.length} Direito(s)</p>
          <div className="rounded-sm border border-white/10 overflow-hidden"><div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="table-header border-white/5">
                  <TableHead className="font-heading">Código</TableHead><TableHead className="font-heading">Obra</TableHead>
                  <TableHead className="font-heading">Titular</TableHead><TableHead className="font-heading">Tipo</TableHead>
                  <TableHead className="font-heading">Território</TableHead><TableHead className="font-heading">Vencimento</TableHead>
                  <TableHead className="font-heading">Valor</TableHead><TableHead className="font-heading">Status</TableHead>
                  <TableHead className="font-heading text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-12"><Loader2 className="h-6 w-6 text-sony-red animate-spin mx-auto" /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-12 text-zinc-500">Nenhum direito encontrado</TableCell></TableRow>
                ) : filtered.map((direito, index) => (
                  <motion.tr key={direito.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="table-row" data-testid={`right-row-${direito.id}`}>
                    <TableCell className="font-mono text-xs font-medium text-white">{direito.codigo}</TableCell>
                    <TableCell className="font-medium text-white">{direito.obra}</TableCell>
                    <TableCell className="text-zinc-400">{direito.titular}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-xs">{direito.tipo}</Badge></TableCell>
                    <TableCell className="text-zinc-400">{direito.territorio}</TableCell>
                    <TableCell className="text-zinc-400 font-mono text-xs">{direito.vencimento}</TableCell>
                    <TableCell className="font-medium text-emerald-400">{direito.valor}</TableCell>
                    <TableCell><Badge className={`${getStatusBadgeClass(direito.status)} text-xs`}>{direito.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5" onClick={() => navigate(`/rlm/${direito.id}`)} data-testid={`view-right-${direito.id}`}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5" data-testid={`edit-right-${direito.id}`} onClick={() => openEdit(direito)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10" data-testid={`delete-right-${direito.id}`} onClick={() => setDeleting(direito)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div></div>
        </CardContent></Card>
      </motion.div>

      <EntityFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} fields={FIELDS} initialData={editing} title={editing ? 'Editar Direito' : 'Novo Direito'} description="Preencha os dados do direito de licenciamento" />
      <ConfirmDeleteDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={() => { remove(deleting.id); setDeleting(null); }} itemName={deleting?.obra} />
    </motion.div>
  );
};

export default RLM;
