import React, { useState } from 'react';
import { 
  Music, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Download,
  FileText
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

  // Calcular estatísticas
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Finalizado':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Em Análise':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-300 hover:bg-gray-100';
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
        <Button className="bg-sony-red hover:bg-sony-red/90 text-white transition-opacity" data-testid="new-sony-project-btn">
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Statistics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gray-950">
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Total de Licenças</p>
            <p className="text-3xl font-bold text-white mt-1">{totalLicenses}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gray-950">
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Mês Corrente</p>
            <p className="text-3xl font-bold text-white mt-1">{licensesThisMonth}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gray-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Finalizado</p>
                <p className="text-2xl font-bold text-green-500 mt-1">{statusCount['Finalizado']}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gray-950">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-400">Em Análise</p>
                <p className="text-xl font-bold text-blue-500">{statusCount['Em Análise']}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Pendente</p>
                <p className="text-xl font-bold text-yellow-500">{statusCount['Pendente']}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-gray-950">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por projeto, artista, selo..."
                className="pl-10 bg-gray-900 border-gray-700 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="search-sony-projects-input"
              />
            </div>
            <Button variant="outline" className="border-gray-700 text-gray-300" data-testid="filter-sony-btn">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-300" data-testid="export-sony-btn">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="border-0 shadow-lg bg-gray-950" data-testid="sony-projects-table-card">
        <CardContent className="pt-6">
          <div className="mb-4">
            <p className="text-lg font-semibold text-white">
              {filteredProjetos.length} Projeto(s) encontrado(s)
            </p>
          </div>
          <div className="rounded-lg border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-900 border-gray-800">
                  <TableHead className="font-semibold text-gray-300">Código</TableHead>
                  <TableHead className="font-semibold text-gray-300">Projeto</TableHead>
                  <TableHead className="font-semibold text-gray-300">Artista Principal</TableHead>
                  <TableHead className="font-semibold text-gray-300">Artista Convidado</TableHead>
                  <TableHead className="font-semibold text-gray-300">Selo</TableHead>
                  <TableHead className="font-semibold text-gray-300">Tipo</TableHead>
                  <TableHead className="font-semibold text-gray-300">Lançamento</TableHead>
                  <TableHead className="font-semibold text-gray-300">Status</TableHead>
                  <TableHead className="font-semibold text-center text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjetos.map((projeto) => (
                  <TableRow 
                    key={projeto.id} 
                    className="hover:bg-red-50/30 transition-colors border-gray-800"
                    data-testid={`sony-project-row-${projeto.id}`}
                  >
                    <TableCell className="font-mono text-sm font-medium text-white">{projeto.codigo}</TableCell>
                    <TableCell className="font-medium text-white">{projeto.projeto}</TableCell>
                    <TableCell className="text-gray-300">{projeto.artistaPrincipal}</TableCell>
                    <TableCell className="text-gray-300">{projeto.artistaConvidado}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-300 border-blue-700">
                        {projeto.selo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-300 border-red-700">
                        {projeto.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-gray-300">{projeto.lancamento}</TableCell>
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
              Mostrando <span className="font-medium text-white">{filteredProjetos.length}</span> de{' '}
              <span className="font-medium text-white">{projetos.length}</span> resultados
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">Anterior</Button>
              <Button variant="outline" size="sm" className="bg-sony-red text-white border-0 hover:bg-sony-red/90">1</Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">2</Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">Próximo</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SonySony;
