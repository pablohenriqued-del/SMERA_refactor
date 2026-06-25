import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Music, Building2, Plus, Search, Edit, Trash2, Mail, Phone, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { useCrud } from '../hooks/useCrud';
import { EntityFormDialog } from '../components/EntityFormDialog';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';

const STATUS = ['Ativo', 'Inativo'];

const ARTIST_FIELDS = [
  { name: 'nome', label: 'Nome', required: true },
  { name: 'gravadora', label: 'Gravadora' },
  { name: 'genero', label: 'Gênero' },
  { name: 'pais', label: 'País' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'telefone', label: 'Telefone' },
  { name: 'status', label: 'Status', type: 'select', options: STATUS, default: 'Ativo' },
];
const LABEL_FIELDS = [
  { name: 'nome', label: 'Nome', required: true },
  { name: 'pais', label: 'País' },
  { name: 'tipo', label: 'Tipo', type: 'select', options: ['Major', 'Independente'], default: 'Major' },
  { name: 'contato', label: 'Contato', type: 'email' },
  { name: 'telefone', label: 'Telefone' },
  { name: 'status', label: 'Status', type: 'select', options: STATUS, default: 'Ativo' },
];
const COMPANY_FIELDS = [
  { name: 'nome', label: 'Nome', required: true },
  { name: 'segmento', label: 'Segmento' },
  { name: 'pais', label: 'País' },
  { name: 'contato', label: 'Contato', type: 'email' },
  { name: 'telefone', label: 'Telefone' },
  { name: 'status', label: 'Status', type: 'select', options: STATUS, default: 'Ativo' },
];

const statusBadge = (status) => (status === 'Ativo' ? 'badge-success' : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20');

const CrudSection = ({ endpoint, resourceName, title, addLabel, fields, columns, testidPrefix }) => {
  const { items, loading, create, update, remove } = useCrud(endpoint, resourceName);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(
    () => items.filter((i) => Object.values(i).some((v) => v?.toString().toLowerCase().includes(searchTerm.toLowerCase()))),
    [items, searchTerm]
  );

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (item) => { setEditing(item); setFormOpen(true); };
  const handleSubmit = async (data) => { editing ? await update(editing.id, data) : await create(data); };

  return (
    <Card className="card-obsidian">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading text-white uppercase tracking-wide text-sm">{title}</CardTitle>
        <Button className="btn-sony text-xs" data-testid={`add-${testidPrefix}-btn`} onClick={openNew}><Plus className="h-4 w-4 mr-2" />{addLabel}</Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input placeholder={`Buscar ${title.toLowerCase()}...`} className="input-obsidian pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} data-testid={`search-${testidPrefix}-input`} />
        </div>
        <div className="rounded-sm border border-white/10 overflow-hidden"><div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                {columns.map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-12"><Loader2 className="h-6 w-6 text-sony-red animate-spin mx-auto" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-12 text-zinc-500">Nenhum registro encontrado</TableCell></TableRow>
              ) : filtered.map((item) => (
                <TableRow key={item.id} className="table-row" data-testid={`${testidPrefix}-row-${item.id}`}>
                  {columns.map((c) => <TableCell key={c.key}>{c.render ? c.render(item) : <span className="text-zinc-400">{item[c.key]}</span>}</TableCell>)}
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5" data-testid={`edit-${testidPrefix}-${item.id}`} onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10" data-testid={`delete-${testidPrefix}-${item.id}`} onClick={() => setDeleting(item)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div></div>
      </CardContent>

      <EntityFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} fields={fields} initialData={editing} title={editing ? `Editar ${resourceName}` : addLabel} />
      <ConfirmDeleteDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={() => { remove(deleting.id); setDeleting(null); }} itemName={deleting?.nome} />
    </Card>
  );
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Cadastros = () => {
  const artistColumns = [
    { key: 'nome', label: 'Nome', render: (a) => <span className="font-medium text-white">{a.nome}</span> },
    { key: 'gravadora', label: 'Gravadora' },
    { key: 'genero', label: 'Gênero', render: (a) => <Badge variant="outline" className="bg-sony-red/10 text-sony-red border-sony-red/20 text-xs">{a.genero}</Badge> },
    { key: 'pais', label: 'País' },
    { key: 'contato', label: 'Contato', render: (a) => <div className="flex flex-col gap-1 text-xs text-zinc-500"><span className="flex items-center gap-1"><Mail className="h-3 w-3" />{a.email}</span><span className="flex items-center gap-1"><Phone className="h-3 w-3" />{a.telefone}</span></div> },
    { key: 'status', label: 'Status', render: (a) => <Badge className={`${statusBadge(a.status)} text-xs`}>{a.status}</Badge> },
  ];
  const labelColumns = [
    { key: 'nome', label: 'Nome', render: (g) => <span className="font-medium text-white">{g.nome}</span> },
    { key: 'pais', label: 'País' },
    { key: 'tipo', label: 'Tipo', render: (g) => <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">{g.tipo}</Badge> },
    { key: 'contato', label: 'Contato', render: (g) => <span className="text-zinc-400 text-xs">{g.contato}</span> },
    { key: 'telefone', label: 'Telefone', render: (g) => <span className="text-zinc-400 text-xs">{g.telefone}</span> },
    { key: 'status', label: 'Status', render: (g) => <Badge className={`${statusBadge(g.status)} text-xs`}>{g.status}</Badge> },
  ];
  const companyColumns = [
    { key: 'nome', label: 'Nome', render: (e) => <span className="font-medium text-white">{e.nome}</span> },
    { key: 'segmento', label: 'Segmento', render: (e) => <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">{e.segmento}</Badge> },
    { key: 'pais', label: 'País' },
    { key: 'contato', label: 'Contato', render: (e) => <span className="text-zinc-400 text-xs">{e.contato}</span> },
    { key: 'telefone', label: 'Telefone', render: (e) => <span className="text-zinc-400 text-xs">{e.telefone}</span> },
    { key: 'status', label: 'Status', render: (e) => <Badge className={`${statusBadge(e.status)} text-xs`}>{e.status}</Badge> },
  ];

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="cadastros-page">
      <motion.div variants={itemVariants}>
        <h1 className="heading-lg text-white" data-testid="cadastros-title">Cadastros</h1>
        <p className="body-sm text-zinc-500">Gerencie artistas, gravadoras e empresas</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="artistas" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-sony-paper border border-white/10 p-1">
            <TabsTrigger value="artistas" className="data-[state=active]:bg-sony-red rounded-sm" data-testid="tab-artistas">Artistas</TabsTrigger>
            <TabsTrigger value="gravadoras" className="data-[state=active]:bg-sony-red rounded-sm" data-testid="tab-gravadoras">Gravadoras</TabsTrigger>
            <TabsTrigger value="empresas" className="data-[state=active]:bg-sony-red rounded-sm" data-testid="tab-empresas">Empresas</TabsTrigger>
          </TabsList>

          <TabsContent value="artistas">
            <CrudSection endpoint="/artists" resourceName="Artista" title="Artistas" addLabel="Novo Artista" fields={ARTIST_FIELDS} columns={artistColumns} testidPrefix="artist" />
          </TabsContent>
          <TabsContent value="gravadoras">
            <CrudSection endpoint="/labels" resourceName="Gravadora" title="Gravadoras" addLabel="Nova Gravadora" fields={LABEL_FIELDS} columns={labelColumns} testidPrefix="label" />
          </TabsContent>
          <TabsContent value="empresas">
            <CrudSection endpoint="/companies" resourceName="Empresa" title="Empresas Parceiras" addLabel="Nova Empresa" fields={COMPANY_FIELDS} columns={companyColumns} testidPrefix="company" />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default Cadastros;
