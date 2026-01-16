import React, { useState } from 'react';
import { 
  Music, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Download,
  TrendingUp,
  FileText,
  Users,
  DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
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

  const stats = [
    { title: 'Projetos Internos', value: '142', icon: Music, color: 'gradient-sony-red' },
    { title: 'Artistas Sony', value: '86', icon: Users, color: 'gradient-sony-black-red' },
    { title: 'Valor Total', value: 'R$ 2.4M', icon: DollarSign, color: 'from-green-500 to-emerald-600' },
    { title: 'Este Mês', value: '+18', icon: TrendingUp, color: 'from-orange-500 to-pink-600' },
  ];

  const projetos = [
    {
      id: 1,
      codigo: 'SONY-2025-001',
      projeto: 'Album Collaboration',
      artistaPrincipal: 'John Artist',
      artistaConvidado: 'Featured Star',
      selo: 'Columbia Records',
      tipo: 'Album Completo',
      lancamento: '15/03/2025',
      territorios: 'Global',
      status: 'Finalizado',
      valor: 'R$ 450.000'
    },
    {
      id: 2,
      codigo: 'SONY-2025-002',
      projeto: 'Crossover EP',
      artistaPrincipal: 'Pop Sensation',
      artistaConvidado: 'Urban Legend',
      selo: 'RCA Records',
      tipo: 'EP',
      lancamento: '20/04/2025',
      territorios: 'Américas',
      status: 'Em Análise',
      valor: 'R$ 280.000'
    },
    {
      id: 3,
      codigo: 'SONY-2025-003',
      projeto: 'Remix Collection',
      artistaPrincipal: 'Electronic Duo',
      artistaConvidado: 'DJ Producer',
      selo: 'Epic Records',
      tipo: 'Single',
      lancamento: '10/05/2025',
      territorios: 'Europa',
      status: 'Pendente',
      valor: 'R$ 180.000'
    },
    {
      id: 4,
      codigo: 'SONY-2025-004',
      projeto: 'Acoustic Sessions',
      artistaPrincipal: 'Singer Songwriter',
      artistaConvidado: 'Classical Artist',
      selo: 'Legacy Recordings',
      tipo: 'Live Album',
      lancamento: '25/06/2025',
      territorios: 'Brasil e Portugal',
      status: 'Pendenteção',
      valor: 'R$ 320.000'
    },
    {
      id: 5,
      codigo: 'SONY-2025-005',
      projeto: 'Summer Hits',
      artistaPrincipal: 'Pop Group',
      artistaConvidado: 'Tropical Band',
      selo: 'Sony Music Latin',
      tipo: 'Compilation',
      lancamento: '01/07/2025',
      territorios: 'América Latina',
      status: 'Pendente',
      valor: 'R$ 520.000'
    },
  ];

  const filteredProjetos = projetos.filter(projeto =>
    Object.values(projeto).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'Pendenteção':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Pendente':
        return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
      case 'Em Análise':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'Finalizado':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Lançado':
        return 'bg-cyan-100 text-cyan-700 hover:bg-cyan-100';
      default:
        return 'bg-gray-100 text-gray-300 hover:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6" data-testid="sony-sony-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" data-testid="sony-sony-title">Sony/Sony</h1>
          <p className="text-gray-400 mt-1">Projetos e colaborações entre artistas Sony Music</p>
        </div>
        <Button className="bg-sony-red hover:bg-sony-red/90 text-white hover:opacity-90 transition-opacity" data-testid="new-sony-project-btn">
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg overflow-hidden" data-testid={`sony-stat-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                  </div>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por projeto, artista, selo..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="search-sony-projects-input"
              />
            </div>
            <Button variant="outline" data-testid="filter-sony-btn">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" data-testid="export-sony-btn">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="border-0 shadow-lg" data-testid="sony-projects-table-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {filteredProjetos.length} Projeto(s) encontrado(s)
          </CardTitle>
          <CardDescription>Colaborações e projetos internos Sony Music</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-900">
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Projeto</TableHead>
                  <TableHead className="font-semibold">Artista Principal</TableHead>
                  <TableHead className="font-semibold">Artista Convidado</TableHead>
                  <TableHead className="font-semibold">Selo</TableHead>
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="font-semibold">Lançamento</TableHead>
                  <TableHead className="font-semibold">Territórios</TableHead>
                  <TableHead className="font-semibold">Valor</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjetos.map((projeto) => (
                  <TableRow 
                    key={projeto.id} 
                    className="hover:bg-red-50/30 transition-colors"
                    data-testid={`sony-project-row-${projeto.id}`}
                  >
                    <TableCell className="font-mono text-sm font-medium">{projeto.codigo}</TableCell>
                    <TableCell className="font-medium">{projeto.projeto}</TableCell>
                    <TableCell>{projeto.artistaPrincipal}</TableCell>
                    <TableCell>{projeto.artistaConvidado}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {projeto.selo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-purple-200">
                        {projeto.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{projeto.lancamento}</TableCell>
                    <TableCell>{projeto.territorios}</TableCell>
                    <TableCell className="font-semibold text-green-600">{projeto.valor}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(projeto.status)}>
                        {projeto.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          data-testid={`view-sony-project-${projeto.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                          data-testid={`edit-sony-project-${projeto.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-green-600 hover:bg-green-50"
                          data-testid={`documents-sony-project-${projeto.id}`}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-400">
              Mostrando <span className="font-medium">{filteredProjetos.length}</span> de{' '}
              <span className="font-medium">{projetos.length}</span> resultados
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Anterior</Button>
              <Button variant="outline" size="sm" className="bg-sony-red hover:bg-sony-red/90 text-white text-white border-0">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">Próximo</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SonySony;