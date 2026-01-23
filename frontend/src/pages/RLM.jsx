import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const RLM = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { title: 'Total de Direitos', value: '1.248', icon: Shield, gradient: 'from-sony-red to-red-600' },
    { title: 'Ativos', value: '1.102', icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600' },
    { title: 'Em Renovação', value: '98', icon: Clock, gradient: 'from-amber-500 to-amber-600' },
    { title: 'Próximos a Vencer', value: '48', icon: AlertTriangle, gradient: 'from-red-500 to-red-600' },
  ];

  const direitos = [
    { id: 1, codigo: 'RLM-2025-001', obra: 'Summer Vibes', titular: 'Sony Music Publishing', tipo: 'Master', territorio: 'Global', vencimento: '15/06/2027', status: 'Ativo', valor: 'R$ 500.000' },
    { id: 2, codigo: 'RLM-2025-002', obra: 'Nocturne Dreams', titular: 'Warner Chappell', tipo: 'Publishing', territorio: 'Américas', vencimento: '20/03/2026', status: 'Ativo', valor: 'R$ 350.000' },
    { id: 3, codigo: 'RLM-2025-003', obra: 'Electric Pulse', titular: 'Universal Music', tipo: 'Sync', territorio: 'Europa', vencimento: '10/12/2025', status: 'Em Renovação', valor: 'R$ 280.000' },
    { id: 4, codigo: 'RLM-2025-004', obra: 'Urban Legends', titular: 'Sony Music', tipo: 'Master', territorio: 'Brasil', vencimento: '05/08/2025', status: 'Próximo a Vencer', valor: 'R$ 420.000' },
    { id: 5, codigo: 'RLM-2025-005', obra: 'Acoustic Sessions', titular: 'Independent Rights', tipo: 'Performance', territorio: 'Ásia', vencimento: '30/11/2028', status: 'Ativo', valor: 'R$ 180.000' },
  ];

  const filteredDireitos = direitos.filter(direito =>
    Object.values(direito).some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Ativo': return 'badge-success';
      case 'Em Renovação': return 'badge-warning';
      case 'Próximo a Vencer': return 'badge-error';
      default: return 'badge-info';
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="rlm-page">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-sony-red/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-sony-red" />
          </div>
          <div>
            <h1 className="heading-lg text-white" data-testid="rlm-title">RLM</h1>
            <p className="body-sm text-zinc-500">Gestão de direitos e licenciamento</p>
          </div>
        </div>
        <Button className="btn-sony" data-testid="new-right-btn">
          <Plus className="h-4 w-4 mr-2" />
          Novo Direito
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-obsidian" data-testid={`rlm-stat-${index}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="overline">{stat.title}</p>
                    <p className="font-heading font-bold text-2xl text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-sm bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="card-obsidian">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input placeholder="Buscar por código, obra, titular..." className="input-obsidian pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} data-testid="search-rights-input" />
              </div>
              <Button variant="outline" className="btn-sony-outline" data-testid="filter-rights-btn">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="card-obsidian" data-testid="rights-table-card">
          <CardContent className="p-4">
            <p className="font-heading font-semibold text-white uppercase tracking-wide text-sm mb-4">{filteredDireitos.length} Direito(s)</p>
            <div className="rounded-sm border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header border-white/5">
                      <TableHead className="font-heading">Código</TableHead>
                      <TableHead className="font-heading">Obra</TableHead>
                      <TableHead className="font-heading">Titular</TableHead>
                      <TableHead className="font-heading">Tipo</TableHead>
                      <TableHead className="font-heading">Território</TableHead>
                      <TableHead className="font-heading">Vencimento</TableHead>
                      <TableHead className="font-heading">Valor</TableHead>
                      <TableHead className="font-heading">Status</TableHead>
                      <TableHead className="font-heading text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDireitos.map((direito, index) => (
                      <motion.tr key={direito.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="table-row" data-testid={`right-row-${direito.id}`}>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5" onClick={() => window.location.href = `/rlm/${direito.id}`} data-testid={`view-right-${direito.id}`}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5" data-testid={`edit-right-${direito.id}`}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10" data-testid={`contract-right-${direito.id}`}><FileText className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <p className="text-sm text-zinc-500">Mostrando <span className="text-white font-medium">{filteredDireitos.length}</span> de <span className="text-white font-medium">{direitos.length}</span></p>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 bg-sony-red text-white rounded-sm">1</Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 text-zinc-500 hover:text-white">2</Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default RLM;
