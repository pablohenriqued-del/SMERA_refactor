import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  FileInput,
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

const LicenseIn = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const licenses = [
    {
      id: 1,
      projeto: 'Batidão Tropical 2',
      titulo: 'Rubi',
      artista: 'Pabllo Vittar',
      artistasConvidados: 'Will Love',
      proRata: 'Não',
      previsao: '15/11/2024',
      formato: 'Participação Especial',
      meios: 'Físico e Digital',
      status: 'Finalizado'
    },
    {
      id: 2,
      projeto: 'AFTER',
      titulo: 'Culpa do Cupido',
      artista: 'Pabllo Vittar',
      artistasConvidados: 'EPX',
      proRata: 'Não',
      previsao: '20/11/2024',
      formato: 'Participação Especial',
      meios: 'Físico e Digital',
      status: 'Finalizado'
    },
    {
      id: 3,
      projeto: 'JETSKI',
      titulo: 'JETSKI',
      artista: 'Pedro Sampaio',
      artistasConvidados: 'MC Meno K',
      proRata: 'Não',
      previsao: '18/12/2025',
      formato: 'Participação Especial',
      meios: 'Físico e Digital',
      status: 'Pendente'
    },
    {
      id: 4,
      projeto: 'Noite Perfeita',
      titulo: 'Romance Proibido',
      artista: 'Anitta',
      artistasConvidados: 'Ludmilla',
      proRata: 'Sim',
      previsao: '15/01/2026',
      formato: 'Participação Especial',
      meios: 'Físico e Digital',
      status: 'Em Análise'
    },
    {
      id: 5,
      projeto: 'Funk Remix',
      titulo: 'Beat Pesado',
      artista: 'MC Hariel',
      artistasConvidados: 'Kevin O Chris',
      proRata: 'Não',
      previsao: '20/12/2024',
      formato: 'Participação Especial',
      meios: 'Digital',
      status: 'Pendente'
    },
    {
      id: 6,
      projeto: 'Sertanejo Top',
      titulo: 'Coração Partido',
      artista: 'Marília Mendonça',
      artistasConvidados: 'Henrique & Juliano',
      proRata: 'Sim',
      previsao: '10/12/2024',
      formato: 'Participação Especial',
      meios: 'Físico e Digital',
      status: 'Finalizado'
    },
  ];

  const filteredLicenses = licenses.filter(license =>
    Object.values(license).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalLicenses = licenses.length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const licensesThisMonth = licenses.filter(license => {
    const [day, month, year] = license.previsao.split('/');
    const licenseDate = new Date(year, month - 1, day);
    return licenseDate.getMonth() === currentMonth && licenseDate.getFullYear() === currentYear;
  }).length;

  const statusCount = {
    'Finalizado': licenses.filter(l => l.status === 'Finalizado').length,
    'Em Análise': licenses.filter(l => l.status === 'Em Análise').length,
    'Pendente': licenses.filter(l => l.status === 'Pendente').length,
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
      data-testid="license-in-page"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-sony-red/10 flex items-center justify-center">
              <FileInput className="h-5 w-5 text-sony-red" />
            </div>
            <div>
              <h1 className="heading-lg text-white" data-testid="license-in-title">License In</h1>
              <p className="body-sm text-zinc-500">Gerencie licenças de entrada</p>
            </div>
          </div>
        </div>
        <Button className="btn-sony" data-testid="new-license-btn">
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
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
                  placeholder="Buscar por projeto, artista, título..."
                  className="input-obsidian pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="search-licenses-input"
                />
              </div>
              <Button variant="outline" className="btn-sony-outline" data-testid="filter-btn">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" className="btn-sony-outline" data-testid="export-btn">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card className="card-obsidian" data-testid="licenses-table-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-heading font-semibold text-white uppercase tracking-wide text-sm">
                {filteredLicenses.length} Licença(s)
              </p>
            </div>
            <div className="rounded-sm border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header border-white/5">
                      <TableHead className="font-heading">Projeto</TableHead>
                      <TableHead className="font-heading">Título</TableHead>
                      <TableHead className="font-heading">Artista Sony</TableHead>
                      <TableHead className="font-heading">Convidados</TableHead>
                      <TableHead className="font-heading">Pro-Rata</TableHead>
                      <TableHead className="font-heading">Previsão</TableHead>
                      <TableHead className="font-heading">Formato</TableHead>
                      <TableHead className="font-heading">Meios</TableHead>
                      <TableHead className="font-heading">Status</TableHead>
                      <TableHead className="font-heading text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLicenses.map((license, index) => (
                      <motion.tr 
                        key={license.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="table-row"
                        data-testid={`license-row-${license.id}`}
                      >
                        <TableCell className="font-medium text-white">{license.projeto}</TableCell>
                        <TableCell className="text-zinc-400">{license.titulo}</TableCell>
                        <TableCell className="text-zinc-400">{license.artista}</TableCell>
                        <TableCell className="text-zinc-400">{license.artistasConvidados}</TableCell>
                        <TableCell className="text-zinc-400">{license.proRata}</TableCell>
                        <TableCell className="text-zinc-400 font-mono text-xs">{license.previsao}</TableCell>
                        <TableCell className="text-zinc-400 text-xs">{license.formato}</TableCell>
                        <TableCell className="text-zinc-400 text-xs">{license.meios}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadgeClass(license.status)} text-xs`}>
                            {license.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5"
                              data-testid={`view-license-${license.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5"
                              data-testid={`edit-license-${license.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                              data-testid={`delete-license-${license.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
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
                Mostrando <span className="text-white font-medium">{filteredLicenses.length}</span> de{' '}
                <span className="text-white font-medium">{licenses.length}</span>
              </p>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 bg-sony-red text-white rounded-sm">1</Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 text-zinc-500 hover:text-white">2</Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 text-zinc-500 hover:text-white">3</Button>
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

export default LicenseIn;
