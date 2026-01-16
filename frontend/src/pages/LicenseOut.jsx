import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  CheckSquare
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

const LicenseOut = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const licenses = [
    {
      id: 1,
      projeto: 'Novo Licenciamento - CAROLINA APARECIDA RIBEIRO',
      titulo: 'Pedido a Padre Cícero',
      artistaSony: 'Ary Lobo',
      solicitante: 'Carolina Aparecida Ribeiro',
      tipo: 'Remix',
      prazo: '15/12/2024',
      status: 'Em Análise'
    },
    {
      id: 2,
      projeto: 'Novo Licenciamento - Vitor Hugo Souza Silva',
      titulo: 'Breca Não',
      artistaSony: 'MC Luuky',
      solicitante: 'Vitor Hugo Souza Silva',
      tipo: 'Participação Especial',
      prazo: '20/12/2024',
      status: 'Em Análise'
    },
    {
      id: 3,
      projeto: 'Novo Licenciamento - Leila Ouchi de Oliveira',
      titulo: 'Academia Privada',
      artistaSony: 'MC Luuky',
      solicitante: 'Leila Ouchi de Oliveira',
      tipo: 'Participação Especial',
      prazo: '10/11/2024',
      status: 'Em Análise'
    },
    {
      id: 4,
      projeto: 'Licenciamento Netflix - Série Original',
      titulo: 'Funk Pesado',
      artistaSony: 'Pedro Sampaio',
      solicitante: 'Netflix Brasil',
      tipo: 'Streaming',
      prazo: '05/12/2024',
      status: 'Finalizado'
    },
    {
      id: 5,
      projeto: 'Publicidade Coca-Cola',
      titulo: 'JETSKI',
      artistaSony: 'Pedro Sampaio',
      solicitante: 'Coca-Cola Brasil',
      tipo: 'Publicidade',
      prazo: '25/11/2024',
      status: 'Finalizado'
    },
    {
      id: 6,
      projeto: 'Game Mobile - Soundtrack',
      titulo: 'Rubi',
      artistaSony: 'Pabllo Vittar',
      solicitante: 'Gameloft',
      tipo: 'Games',
      prazo: '30/01/2025',
      status: 'Pendente'
    },
  ];

  const filteredLicenses = licenses.filter(license =>
    Object.values(license).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calcular estatísticas
  const totalLicenses = licenses.length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const licensesThisMonth = licenses.filter(license => {
    const [day, month, year] = license.prazo.split('/');
    const licenseDate = new Date(year, month - 1, day);
    return licenseDate.getMonth() === currentMonth && licenseDate.getFullYear() === currentYear;
  }).length;

  const statusCount = {
    'Finalizado': licenses.filter(l => l.status === 'Finalizado').length,
    'Em Análise': licenses.filter(l => l.status === 'Em Análise').length,
    'Pendente': licenses.filter(l => l.status === 'Pendente').length,
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
    <div className="space-y-6" data-testid="license-out-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" data-testid="license-out-title">License Out</h1>
          <p className="text-gray-400 mt-1">Gerencie licenças de saída</p>
        </div>
        <Button className="bg-sony-black hover:bg-sony-black/90 text-white transition-opacity" data-testid="new-license-out-btn">
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
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
                placeholder="Buscar por projeto, solicitante, artista..."
                className="pl-10 bg-gray-900 border-gray-700 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="search-license-out-input"
              />
            </div>
            <Button variant="outline" className="border-gray-700 text-gray-300" data-testid="filter-out-btn">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-300" data-testid="export-out-btn">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg bg-gray-950" data-testid="license-out-table-card">
        <CardContent className="pt-6">
          <div className="mb-4">
            <p className="text-lg font-semibold text-white">
              {filteredLicenses.length} Solicitação(ões) encontrada(s)
            </p>
          </div>
          <div className="rounded-lg border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-900 border-gray-800">
                  <TableHead className="font-semibold text-gray-300">Projeto</TableHead>
                  <TableHead className="font-semibold text-gray-300">Título</TableHead>
                  <TableHead className="font-semibold text-gray-300">Artista Sony</TableHead>
                  <TableHead className="font-semibold text-gray-300">Solicitante</TableHead>
                  <TableHead className="font-semibold text-gray-300">Tipo</TableHead>
                  <TableHead className="font-semibold text-gray-300">Prazo</TableHead>
                  <TableHead className="font-semibold text-gray-300">Status</TableHead>
                  <TableHead className="font-semibold text-center text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLicenses.map((license) => (
                  <TableRow 
                    key={license.id} 
                    className="hover:bg-blue-50/30 transition-colors border-gray-800"
                    data-testid={`license-out-row-${license.id}`}
                  >
                    <TableCell className="font-medium text-white">{license.projeto}</TableCell>
                    <TableCell className="text-gray-300">{license.titulo}</TableCell>
                    <TableCell className="text-gray-300">{license.artistaSony}</TableCell>
                    <TableCell className="text-gray-300">{license.solicitante}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-300 border-red-700">
                        {license.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{license.prazo}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(license.status)}>
                        {license.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          data-testid={`view-license-out-${license.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`edit-license-out-${license.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`delete-license-out-${license.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
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
              Mostrando <span className="font-medium text-white">{filteredLicenses.length}</span> de{' '}
              <span className="font-medium text-white">{licenses.length}</span> resultados
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">Anterior</Button>
              <Button variant="outline" size="sm" className="bg-sony-black text-white border-0 hover:bg-sony-black/90">1</Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">2</Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">Próximo</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LicenseOut;
