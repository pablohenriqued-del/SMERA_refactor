import React, { useState } from 'react';
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
  AlertTriangle
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

const RLM = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { title: 'Total de Direitos', value: '1.248', icon: Shield, color: 'from-purple-500 to-pink-600' },
    { title: 'Ativos', value: '1.102', icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
    { title: 'Em Renovação', value: '98', icon: Clock, color: 'from-yellow-500 to-orange-600' },
    { title: 'Próximos a Vencer', value: '48', icon: AlertTriangle, color: 'from-red-500 to-pink-600' },
  ];

  const direitos = [
    {
      id: 1,
      codigo: 'RLM-2025-001',
      obra: 'Summer Vibes',
      titular: 'Sony Music Publishing',
      tipo: 'Master',
      territorio: 'Global',
      vencimento: '15/06/2027',
      status: 'Ativo',
      valor: 'R$ 500.000'
    },
    {
      id: 2,
      codigo: 'RLM-2025-002',
      obra: 'Nocturne Dreams',
      titular: 'Warner Chappell',
      tipo: 'Publishing',
      territorio: 'Américas',
      vencimento: '20/03/2026',
      status: 'Ativo',
      valor: 'R$ 350.000'
    },
    {
      id: 3,
      codigo: 'RLM-2025-003',
      obra: 'Electric Pulse',
      titular: 'Universal Music',
      tipo: 'Sync',
      territorio: 'Europa',
      vencimento: '10/12/2025',
      status: 'Em Renovação',
      valor: 'R$ 280.000'
    },
    {
      id: 4,
      codigo: 'RLM-2025-004',
      obra: 'Urban Legends',
      titular: 'Sony Music',
      tipo: 'Master',
      territorio: 'Brasil',
      vencimento: '05/08/2025',
      status: 'Próximo a Vencer',
      valor: 'R$ 420.000'
    },
    {
      id: 5,
      codigo: 'RLM-2025-005',
      obra: 'Acoustic Sessions',
      titular: 'Independent Rights',
      tipo: 'Performance',
      territorio: 'Ásia',
      vencimento: '30/11/2028',
      status: 'Ativo',
      valor: 'R$ 180.000'
    },
  ];

  const filteredDireitos = direitos.filter(direito =>
    Object.values(direito).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Em Renovação':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Próximo a Vencer':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'Vencido':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
      default:
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
    }
  };

  return (
    <div className="space-y-6" data-testid="rlm-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="rlm-title">RLM - Rights Management</h1>
          <p className="text-gray-500 mt-1">Gestão de direitos e licenciamento musical</p>
        </div>
        <Button className="bg-sony-red hover:bg-sony-red/90 text-white hover:opacity-90 transition-opacity" data-testid="new-right-btn">
          <Plus className="h-4 w-4 mr-2" />
          Novo Direito
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg overflow-hidden" data-testid={`rlm-stat-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
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
                placeholder="Buscar por código, obra, titular..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="search-rights-input"
              />
            </div>
            <Button variant="outline" data-testid="filter-rights-btn">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg" data-testid="rights-table-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {filteredDireitos.length} Direito(s) encontrado(s)
          </CardTitle>
          <CardDescription>Gerencie os direitos musicais e licenciamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Obra</TableHead>
                  <TableHead className="font-semibold">Titular</TableHead>
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="font-semibold">Território</TableHead>
                  <TableHead className="font-semibold">Vencimento</TableHead>
                  <TableHead className="font-semibold">Valor</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDireitos.map((direito) => (
                  <TableRow 
                    key={direito.id} 
                    className="hover:bg-purple-50/30 transition-colors"
                    data-testid={`right-row-${direito.id}`}
                  >
                    <TableCell className="font-mono text-sm font-medium">{direito.codigo}</TableCell>
                    <TableCell className="font-medium">{direito.obra}</TableCell>
                    <TableCell>{direito.titular}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {direito.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>{direito.territorio}</TableCell>
                    <TableCell className="font-medium">{direito.vencimento}</TableCell>
                    <TableCell className="font-semibold text-green-600">{direito.valor}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(direito.status)}>
                        {direito.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          data-testid={`view-right-${direito.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-purple-600 hover:bg-purple-50"
                          data-testid={`edit-right-${direito.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-green-600 hover:bg-green-50"
                          data-testid={`contract-right-${direito.id}`}
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
            <p className="text-sm text-gray-500">
              Mostrando <span className="font-medium">{filteredDireitos.length}</span> de{' '}
              <span className="font-medium">{direitos.length}</span> resultados
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

export default RLM;