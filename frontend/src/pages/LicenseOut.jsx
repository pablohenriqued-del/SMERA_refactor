import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const LicenseOut = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const licenses = [
    {
      id: 1,
      projeto: 'Commercial Campaign',
      titulo: 'Brand Anthem',
      artistaSony: 'John Artist',
      solicitante: 'Nike Inc.',
      tipo: 'Publicidade',
      territorio: 'Global',
      prazo: '24 meses',
      valor: 'R$ 150.000',
      status: 'Aprovado'
    },
    {
      id: 2,
      projeto: 'Film Soundtrack',
      titulo: 'Main Theme',
      artistaSony: 'Orchestra Band',
      solicitante: 'Warner Bros',
      tipo: 'Cinema',
      territorio: 'Mundial',
      prazo: '36 meses',
      valor: 'R$ 300.000',
      status: 'Em Análise'
    },
    {
      id: 3,
      projeto: 'TV Series',
      titulo: 'Opening Song',
      artistaSony: 'Pop Star',
      solicitante: 'Netflix',
      tipo: 'Streaming',
      territorio: 'Américas',
      prazo: '12 meses',
      valor: 'R$ 80.000',
      status: 'Pendente'
    },
    {
      id: 4,
      projeto: 'Video Game OST',
      titulo: 'Battle Theme',
      artistaSony: 'Electronic Duo',
      solicitante: 'EA Games',
      tipo: 'Games',
      territorio: 'Global',
      prazo: '60 meses',
      valor: 'R$ 200.000',
      status: 'Aprovado'
    },
  ];

  const filteredLicenses = licenses.filter(license =>
    Object.values(license).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Aprovado':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Em Análise':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'Rejeitado':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-300 hover:bg-gray-800';
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
        <Button className="bg-sony-black hover:bg-sony-black/90 text-white hover:opacity-90 transition-opacity" data-testid="new-license-out-btn">
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por projeto, solicitante, artista..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="search-license-out-input"
              />
            </div>
            <Button variant="outline" data-testid="filter-out-btn">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" data-testid="export-out-btn">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg" data-testid="license-out-table-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {filteredLicenses.length} Solicitação(ões) encontrada(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-900">
                  <TableHead className="font-semibold">Projeto</TableHead>
                  <TableHead className="font-semibold">Título</TableHead>
                  <TableHead className="font-semibold">Artista Sony</TableHead>
                  <TableHead className="font-semibold">Solicitante</TableHead>
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="font-semibold">Território</TableHead>
                  <TableHead className="font-semibold">Prazo</TableHead>
                  <TableHead className="font-semibold">Valor</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLicenses.map((license) => (
                  <TableRow 
                    key={license.id} 
                    className="hover:bg-blue-50/30 transition-colors"
                    data-testid={`license-out-row-${license.id}`}
                  >
                    <TableCell className="font-medium">{license.projeto}</TableCell>
                    <TableCell>{license.titulo}</TableCell>
                    <TableCell>{license.artistaSony}</TableCell>
                    <TableCell>{license.solicitante}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-purple-200">
                        {license.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>{license.territorio}</TableCell>
                    <TableCell>{license.prazo}</TableCell>
                    <TableCell className="font-semibold text-green-600">{license.valor}</TableCell>
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
              Mostrando <span className="font-medium">{filteredLicenses.length}</span> de{' '}
              <span className="font-medium">{licenses.length}</span> resultados
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Anterior</Button>
              <Button variant="outline" size="sm" className="bg-sony-black hover:bg-sony-black/90 text-white text-white border-0">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">Próximo</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LicenseOut;