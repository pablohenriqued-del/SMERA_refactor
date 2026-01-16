import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  FileText,
  MoreHorizontal
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

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

  // Calcular estatísticas
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Finalizado':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Em Análise':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-300 hover:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6" data-testid="license-in-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" data-testid="license-in-title">License In</h1>
          <p className="text-gray-400 mt-1">Gerencie licenças de entrada</p>
        </div>
        <Button className="bg-sony-red hover:bg-sony-red/90 text-white transition-opacity" data-testid="new-license-btn">
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por projeto, artista, título..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="search-licenses-input"
              />
            </div>
            <Button variant="outline" data-testid="filter-btn">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" data-testid="export-btn">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg" data-testid="licenses-table-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {filteredLicenses.length} Licença(s) encontrada(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-900">
                  <TableHead className="font-semibold">Projeto</TableHead>
                  <TableHead className="font-semibold">Título da Faixa</TableHead>
                  <TableHead className="font-semibold">Artista Sony</TableHead>
                  <TableHead className="font-semibold">Artistas Convidados</TableHead>
                  <TableHead className="font-semibold">Pro-Rata</TableHead>
                  <TableHead className="font-semibold">Previsão Lançamento</TableHead>
                  <TableHead className="font-semibold">Formato</TableHead>
                  <TableHead className="font-semibold">Territórios</TableHead>
                  <TableHead className="font-semibold">Meios</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLicenses.map((license) => (
                  <TableRow 
                    key={license.id} 
                    className="hover:bg-red-50/30 transition-colors"
                    data-testid={`license-row-${license.id}`}
                  >
                    <TableCell className="font-medium">{license.projeto}</TableCell>
                    <TableCell>{license.titulo}</TableCell>
                    <TableCell>{license.artista}</TableCell>
                    <TableCell>{license.artistasConvidados}</TableCell>
                    <TableCell>{license.proRata}</TableCell>
                    <TableCell>{license.previsao}</TableCell>
                    <TableCell>
                      <span className="text-sm">{license.formato}</span>
                    </TableCell>
                    <TableCell>{license.territorios}</TableCell>
                    <TableCell>{license.meios}</TableCell>
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
                          data-testid={`view-license-${license.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`edit-license-${license.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`delete-license-${license.id}`}
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
              <Button variant="outline" size="sm" className="bg-sony-red text-white border-0 hover:bg-sony-red/90">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Próximo</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LicenseIn;