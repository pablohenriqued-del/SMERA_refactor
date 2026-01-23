import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Music, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Download,
  FileText,
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

const SonySony = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const projetos = [
    {
      id: 1,
      codigo: 'SONY-2025-001',
      projeto: 'Album Collaboration',
      artistaPrincipal: 'John Artist',
      artistaConvidado: 'Featured Star',
      selo: 'Columbia Records',
      tipo: 'Album Completo',
      lancamento: '15/12/2024',
      status: 'Finalizado'
    },
    {
      id: 2,
      codigo: 'SONY-2025-002',
      projeto: 'Crossover EP',
      artistaPrincipal: 'Pop Sensation',
      artistaConvidado: 'Urban Legend',
      selo: 'RCA Records',
      tipo: 'EP',
      lancamento: '20/11/2024',
      status: 'Em Análise'
    },
    {
      id: 3,
      codigo: 'SONY-2025-003',
      projeto: 'Remix Collection',
      artistaPrincipal: 'Electronic Duo',
      artistaConvidado: 'DJ Producer',
      selo: 'Epic Records',
      tipo: 'Single',
      lancamento: '10/12/2024',
      status: 'Pendente'
    },
    {
      id: 4,
      codigo: 'SONY-2025-004',
      projeto: 'Acoustic Sessions',
      artistaPrincipal: 'Singer Songwriter',
      artistaConvidado: 'Classical Artist',
      selo: 'Legacy Recordings',
      tipo: 'Live Album',
      lancamento: '25/01/2025',
      status: 'Pendente'
    },
    {
      id: 5,
      codigo: 'SONY-2025-005',
      projeto: 'Summer Hits',
      artistaPrincipal: 'Pop Group',
      artistaConvidado: 'Tropical Band',
      selo: 'Sony Music Latin',
      tipo: 'Compilation',
      lancamento: '01/12/2024',
      status: 'Finalizado'
    },
  ];

  const filteredProjetos = projetos.filter(projeto =>
    Object.values(projeto).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalLicenses = projetos.length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const licensesThisMonth = projetos.filter(projeto => {
    const [day, month, year] = projeto.lancamento.split('/');
    const licenseDate = new Date(year, month - 1, day);
    return licenseDate.getMonth() === currentMonth && licenseDate.getFullYear() === currentYear;
  }).length;

  const statusCount = {
    'Finalizado': projetos.filter(l => l.status === 'Finalizado').length,
    'Em Análise': projetos.filter(l => l.status === 'Em Análise').length,
    'Pendente': projetos.filter(l => l.status === 'Pendente').length,
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Finalizado': return 'badge-success';
      case 'Em Análise': return 'badge-info';
      case 'Pendente': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-testid="sony-sony-page"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-violet-500/10 flex items-center justify-center">
              <Music className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h1 className="heading-lg text-white" data-testid="sony-sony-title">Sony/Sony</h1>
              <p className="body-sm text-zinc-500">Colaborações entre artistas Sony Music</p>
            </div>
          </div>
        </div>
        <Button className="btn-sony" data-testid="new-sony-project-btn">
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </motion.div>

      {/* Statistics */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="card-obsidian">
          <CardContent className="p-4">
            <p className="overline">Total</p>
            <p className="font-heading font-bold text-3xl text-white mt-1">{totalLicenses}</p>
          </CardContent>
        </Card>
        <Card className="card-obsidian">
          <CardContent className="p-4">
            <p className="overline">Mês Corrente</p>
            <p className="font-heading font-bold text-3xl text-white mt-1">{licensesThisMonth}</p>
          </CardContent>
        </Card>
        <Card className="card-obsidian">
          <CardContent className="p-4">
            <p className="overline">Finalizado</p>
            <p className="font-heading font-bold text-3xl text-emerald-400 mt-1">{statusCount['Finalizado']}</p>
          </CardContent>
        </Card>
        <Card className="card-obsidian">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="overline text-[10px]">Em Análise</p>
                <p className="font-heading font-bold text-xl text-blue-400">{statusCount['Em Análise']}</p>
              </div>
              <div>
                <p className="overline text-[10px]">Pendente</p>
                <p className="font-heading font-bold text-xl text-amber-400">{statusCount['Pendente']}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card className="card-obsidian">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Buscar por projeto, artista, selo..."
                  className="input-obsidian pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="search-sony-projects-input"
                />
              </div>
              <Button variant="outline" className="btn-sony-outline" data-testid="filter-sony-btn">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" className="btn-sony-outline" data-testid="export-sony-btn">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card className="card-obsidian" data-testid="sony-projects-table-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-heading font-semibold text-white uppercase tracking-wide text-sm">
                {filteredProjetos.length} Projeto(s)
              </p>
            </div>
            <div className="rounded-sm border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header border-white/5">
                      <TableHead className="font-heading">Código</TableHead>
                      <TableHead className="font-heading">Projeto</TableHead>
                      <TableHead className="font-heading">Artista Principal</TableHead>
                      <TableHead className="font-heading">Convidado</TableHead>
                      <TableHead className="font-heading">Selo</TableHead>
                      <TableHead className="font-heading">Tipo</TableHead>
                      <TableHead className="font-heading">Lançamento</TableHead>
                      <TableHead className="font-heading">Status</TableHead>
                      <TableHead className="font-heading text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjetos.map((projeto, index) => (
                      <motion.tr 
                        key={projeto.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="table-row"
                        data-testid={`sony-project-row-${projeto.id}`}
                      >
                        <TableCell className="font-mono text-xs font-medium text-white">{projeto.codigo}</TableCell>
                        <TableCell className="font-medium text-white">{projeto.projeto}</TableCell>
                        <TableCell className="text-zinc-400">{projeto.artistaPrincipal}</TableCell>
                        <TableCell className="text-zinc-400">{projeto.artistaConvidado}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                            {projeto.selo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-xs">
                            {projeto.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-zinc-400 font-mono text-xs">{projeto.lancamento}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadgeClass(projeto.status)} text-xs`}>
                            {projeto.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5"
                              data-testid={`view-sony-project-${projeto.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5"
                              data-testid={`edit-sony-project-${projeto.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                              data-testid={`documents-sony-project-${projeto.id}`}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <p className="text-sm text-zinc-500">
                Mostrando <span className="text-white font-medium">{filteredProjetos.length}</span> de{' '}
                <span className="text-white font-medium">{projetos.length}</span>
              </p>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 bg-sony-red text-white rounded-sm">1</Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 text-zinc-500 hover:text-white">2</Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SonySony;
