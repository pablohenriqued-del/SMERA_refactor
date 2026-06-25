import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Shield, Edit, Trash2, Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useCrud } from '../hooks/useCrud';
import { EntityFormDialog } from '../components/EntityFormDialog';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { useAuth } from '../context/AuthContext';

const PERFIS = ['Administrador', 'Gestor', 'Usuário'];

const getFields = (isEdit) => [
  { name: 'nome', label: 'Nome', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'cargo', label: 'Cargo' },
  { name: 'perfil', label: 'Perfil', type: 'select', options: PERFIS, default: 'Usuário' },
  { name: 'departamento', label: 'Departamento' },
  { name: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Inativo'], default: 'Ativo' },
  { name: 'password', label: isEdit ? 'Senha (deixe em branco para manter)' : 'Senha', type: 'password', fullWidth: true, placeholder: isEdit ? '••••••••' : 'Senha de acesso' },
];

const getPerfilBadgeClass = (perfil) => ({
  'Administrador': 'bg-sony-red/10 text-sony-red border-sony-red/20',
  'Gestor': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}[perfil] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20');

const getInitials = (nome) => (nome || 'U').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Acesso = () => {
  const { user: currentUser } = useAuth();
  const { items, loading, create, update, remove } = useCrud('/users', 'Usuário');
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(
    () => items.filter((u) => Object.values(u).some((v) => v?.toString().toLowerCase().includes(searchTerm.toLowerCase()))),
    [items, searchTerm]
  );

  const stats = [
    { title: 'Total de Usuários', value: items.length, icon: Users, gradient: 'from-sony-red to-red-600' },
    { title: 'Administradores', value: items.filter((u) => u.perfil === 'Administrador').length, icon: Shield, gradient: 'from-violet-500 to-violet-600' },
    { title: 'Usuários Ativos', value: items.filter((u) => u.status === 'Ativo').length, icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600' },
    { title: 'Inativos', value: items.filter((u) => u.status === 'Inativo').length, icon: XCircle, gradient: 'from-zinc-500 to-zinc-600' },
  ];

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (item) => { setEditing(item); setFormOpen(true); };
  const handleSubmit = async (data) => {
    const payload = { ...data };
    if (editing && !payload.password) delete payload.password;
    editing ? await update(editing.id, payload) : await create(payload);
  };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="acesso-page">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-lg text-white" data-testid="acesso-title">Controle de Acesso</h1>
          <p className="body-sm text-zinc-500">Gerencie usuários e permissões</p>
        </div>
        <Button className="btn-sony" data-testid="add-user-btn" onClick={openNew}><UserPlus className="h-4 w-4 mr-2" />Novo Usuário</Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-obsidian" data-testid={`acesso-stat-${index}`}><CardContent className="p-4">
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
            <Input placeholder="Buscar por nome, email, cargo..." className="input-obsidian pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} data-testid="search-users-input" />
          </div>
        </CardContent></Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="card-obsidian" data-testid="users-table-card">
          <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">{filtered.length} Usuário(s)</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-sm border border-white/10 overflow-hidden"><div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead>Usuário</TableHead><TableHead>Cargo</TableHead><TableHead>Perfil</TableHead>
                    <TableHead>Departamento</TableHead><TableHead>Último Acesso</TableHead><TableHead>Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 text-sony-red animate-spin mx-auto" /></TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-zinc-500">Nenhum usuário encontrado</TableCell></TableRow>
                  ) : filtered.map((u, index) => (
                    <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="table-row" data-testid={`user-row-${u.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-sm bg-sony-red flex items-center justify-center"><span className="font-heading font-bold text-xs text-white">{getInitials(u.nome)}</span></div>
                          <div><p className="font-medium text-white text-sm">{u.nome}</p><p className="text-xs text-zinc-500 flex items-center gap-1"><Mail className="h-3 w-3" />{u.email}</p></div>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm">{u.cargo}</TableCell>
                      <TableCell><Badge variant="outline" className={`${getPerfilBadgeClass(u.perfil)} text-xs`}><Shield className="h-3 w-3 mr-1" />{u.perfil}</Badge></TableCell>
                      <TableCell className="text-zinc-400 text-sm">{u.departamento}</TableCell>
                      <TableCell className="text-zinc-500 text-xs font-mono">{u.ultimoAcesso}</TableCell>
                      <TableCell><Badge className={u.status === 'Ativo' ? 'badge-success' : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'}>{u.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5" data-testid={`edit-user-${u.id}`} onClick={() => openEdit(u)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30" data-testid={`delete-user-${u.id}`} disabled={u.id === currentUser?.id} onClick={() => setDeleting(u)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div></div>
          </CardContent>
        </Card>
      </motion.div>

      <EntityFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} fields={getFields(!!editing)} initialData={editing} title={editing ? 'Editar Usuário' : 'Novo Usuário'} description="Preencha os dados do usuário" />
      <ConfirmDeleteDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={() => { remove(deleting.id); setDeleting(null); }} itemName={deleting?.nome} />
    </motion.div>
  );
};

export default Acesso;
