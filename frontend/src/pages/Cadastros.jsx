import React, { useState } from 'react';
import { 
  Users, 
  Music, 
  Building2, 
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';

const Cadastros = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const artistas = [
    { id: 1, nome: 'EMCIDA', gravadora: 'Sony Music', genero: 'Hip Hop', pais: 'Brasil', status: 'Ativo', email: 'emcida@sony.com', telefone: '+55 11 99999-0001' },
    { id: 2, nome: 'THAIS', gravadora: 'Sony Music', genero: 'Pop', pais: 'Brasil', status: 'Ativo', email: 'thais@sony.com', telefone: '+55 11 99999-0002' },
    { id: 3, nome: 'luisa', gravadora: 'Sony Music', genero: 'MPB', pais: 'Brasil', status: 'Ativo', email: 'luisa@sony.com', telefone: '+55 11 99999-0003' },
    { id: 4, nome: 'ARTISTA', gravadora: 'Sony Music', genero: 'Rock', pais: 'Brasil', status: 'Inativo', email: 'artista@sony.com', telefone: '+55 11 99999-0004' },
  ];

  const gravadoras = [
    { id: 1, nome: 'Sony Music Entertainment', pais: 'Brasil', tipo: 'Major', contato: 'contato@sonymusic.com', telefone: '+55 11 3333-0001', status: 'Ativo' },
    { id: 2, nome: 'Universal Music', pais: 'Brasil', tipo: 'Major', contato: 'info@universal.com', telefone: '+55 11 3333-0002', status: 'Ativo' },
    { id: 3, nome: 'Warner Music', pais: 'EUA', tipo: 'Major', contato: 'contact@warner.com', telefone: '+1 555 0001', status: 'Ativo' },
    { id: 4, nome: 'Independent Records', pais: 'Brasil', tipo: 'Independente', contato: 'hello@independent.com', telefone: '+55 11 3333-0003', status: 'Ativo' },
  ];

  const empresas = [
    { id: 1, nome: 'Nike Inc.', segmento: 'Esportes', pais: 'EUA', contato: 'licensing@nike.com', telefone: '+1 555 1000', status: 'Ativo' },
    { id: 2, nome: 'Netflix', segmento: 'Entretenimento', pais: 'EUA', contato: 'music@netflix.com', telefone: '+1 555 2000', status: 'Ativo' },
    { id: 3, nome: 'Warner Bros', segmento: 'Cinema', pais: 'EUA', contato: 'music.licensing@wb.com', telefone: '+1 555 3000', status: 'Ativo' },
    { id: 4, nome: 'EA Games', segmento: 'Games', pais: 'EUA', contato: 'soundtrack@ea.com', telefone: '+1 555 4000', status: 'Ativo' },
  ];

  const stats = [
    { title: 'Total de Artistas', value: '248', icon: Music, color: 'gradient-sony-red' },
    { title: 'Gravadoras', value: '42', icon: Building2, color: 'gradient-sony-black-red' },
    { title: 'Empresas Parceiras', value: '86', icon: Building2, color: 'from-green-500 to-emerald-600' },
  ];

  return (
    <div className="space-y-6" data-testid="cadastros-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white" data-testid="cadastros-title">Cadastros</h1>
        <p className="text-gray-400 mt-1">Gerencie artistas, gravadoras e empresas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg overflow-hidden" data-testid={`stat-${index}`}>
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

      {/* Tabs */}
      <Tabs defaultValue="artistas" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="artistas" data-testid="tab-artistas">Artistas</TabsTrigger>
          <TabsTrigger value="gravadoras" data-testid="tab-gravadoras">Gravadoras</TabsTrigger>
          <TabsTrigger value="empresas" data-testid="tab-empresas">Empresas</TabsTrigger>
        </TabsList>

        {/* Artistas Tab */}
        <TabsContent value="artistas" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Artistas</CardTitle>
                  <CardDescription>Gerencie o cadastro de artistas</CardDescription>
                </div>
                <Button className="bg-sony-red hover:bg-sony-red/90 text-white" data-testid="add-artist-btn">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Artista
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar artistas..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    data-testid="search-artists-input"
                  />
                </div>
              </div>
              
              <div className="rounded-lg border border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-900">
                      <TableHead className="font-semibold">Nome</TableHead>
                      <TableHead className="font-semibold">Gravadora</TableHead>
                      <TableHead className="font-semibold">Gênero</TableHead>
                      <TableHead className="font-semibold">País</TableHead>
                      <TableHead className="font-semibold">Contato</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {artistas.map((artista) => (
                      <TableRow key={artista.id} className="hover:bg-red-50/30" data-testid={`artist-row-${artista.id}`}>
                        <TableCell className="font-medium">{artista.nome}</TableCell>
                        <TableCell>{artista.gravadora}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            {artista.genero}
                          </Badge>
                        </TableCell>
                        <TableCell>{artista.pais}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Mail className="h-3 w-3" />
                              {artista.email}
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="h-3 w-3" />
                              {artista.telefone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={artista.status === 'Ativo' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                            : 'bg-gray-100 text-gray-300 hover:bg-gray-100'
                          }>
                            {artista.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-600 hover:bg-red-50"
                              data-testid={`edit-artist-${artista.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-600 hover:bg-red-50"
                              data-testid={`delete-artist-${artista.id}`}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gravadoras Tab */}
        <TabsContent value="gravadoras" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gravadoras</CardTitle>
                  <CardDescription>Gerencie o cadastro de gravadoras</CardDescription>
                </div>
                <Button className="bg-sony-black hover:bg-sony-black/90 text-white" data-testid="add-label-btn">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Gravadora
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-900">
                      <TableHead className="font-semibold">Nome</TableHead>
                      <TableHead className="font-semibold">País</TableHead>
                      <TableHead className="font-semibold">Tipo</TableHead>
                      <TableHead className="font-semibold">Contato</TableHead>
                      <TableHead className="font-semibold">Telefone</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gravadoras.map((gravadora) => (
                      <TableRow key={gravadora.id} className="hover:bg-blue-50/30" data-testid={`label-row-${gravadora.id}`}>
                        <TableCell className="font-medium">{gravadora.nome}</TableCell>
                        <TableCell>{gravadora.pais}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {gravadora.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>{gravadora.contato}</TableCell>
                        <TableCell>{gravadora.telefone}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            {gravadora.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Empresas Tab */}
        <TabsContent value="empresas" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Empresas Parceiras</CardTitle>
                  <CardDescription>Gerencie o cadastro de empresas licenciadas</CardDescription>
                </div>
                <Button className="bg-sony-red hover:bg-sony-red/90 text-white" data-testid="add-company-btn">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Empresa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-900">
                      <TableHead className="font-semibold">Nome</TableHead>
                      <TableHead className="font-semibold">Segmento</TableHead>
                      <TableHead className="font-semibold">País</TableHead>
                      <TableHead className="font-semibold">Contato</TableHead>
                      <TableHead className="font-semibold">Telefone</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {empresas.map((empresa) => (
                      <TableRow key={empresa.id} className="hover:bg-pink-50/30" data-testid={`company-row-${empresa.id}`}>
                        <TableCell className="font-medium">{empresa.nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-pink-50 text-pink-700">
                            {empresa.segmento}
                          </Badge>
                        </TableCell>
                        <TableCell>{empresa.pais}</TableCell>
                        <TableCell>{empresa.contato}</TableCell>
                        <TableCell>{empresa.telefone}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            {empresa.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-pink-600 hover:bg-pink-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cadastros;