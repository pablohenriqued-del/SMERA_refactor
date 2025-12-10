import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  Edit, 
  Trash2,
  Mail,
  Lock,
  CheckCircle,
  XCircle
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
import { Avatar, AvatarFallback } from '../components/ui/avatar';

const Acesso = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { title: 'Total de Usuários', value: '86', icon: Users, color: 'gradient-sony-red' },
    { title: 'Administradores', value: '12', icon: Shield, color: 'gradient-sony-black-red' },
    { title: 'Usuários Ativos', value: '78', icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
    { title: 'Inativos', value: '8', icon: XCircle, color: 'from-gray-400 to-gray-600' },
  ];

  const usuarios = [
    {
      id: 1,
      nome: 'Pablo Duartel',
      email: 'pablo.duartel@sonymusic.com',
      cargo: 'Gerente de Licenciamento',
      perfil: 'Administrador',
      departamento: 'Sony Music Entertainment',
      ultimoAcesso: '12/11/2025 14:30',
      status: 'Ativo'
    },
    {
      id: 2,
      nome: 'Maria Silva',
      email: 'maria.silva@sonymusic.com',
      cargo: 'Analista de Direitos',
      perfil: 'Gestor',
      departamento: 'RLM',
      ultimoAcesso: '12/11/2025 10:15',
      status: 'Ativo'
    },
    {
      id: 3,
      nome: 'João Santos',
      email: 'joao.santos@sonymusic.com',
      cargo: 'Coordenador',
      perfil: 'Gestor',
      departamento: 'License In',
      ultimoAcesso: '11/11/2025 16:45',
      status: 'Ativo'
    },
    {
      id: 4,
      nome: 'Ana Costa',
      email: 'ana.costa@sonymusic.com',
      cargo: 'Assistente',
      perfil: 'Usuário',
      departamento: 'License Out',
      ultimoAcesso: '10/11/2025 09:20',
      status: 'Ativo'
    },
    {
      id: 5,
      nome: 'Carlos Oliveira',
      email: 'carlos.oliveira@sonymusic.com',
      cargo: 'Consultor',
      perfil: 'Usuário',
      departamento: 'Cadastros',
      ultimoAcesso: '05/11/2025 14:00',
      status: 'Inativo'
    },
  ];

  const filteredUsuarios = usuarios.filter(usuario =>
    Object.values(usuario).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getPerfilColor = (perfil) => {
    switch (perfil) {
      case 'Administrador':
        return 'bg-red-100 text-red-700 border-purple-200';
      case 'Gestor':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Usuário':
        return 'bg-gray-100 text-gray-300 border-gray-700';
      default:
        return 'bg-gray-100 text-gray-300 border-gray-700';
    }
  };

  const getInitials = (nome) => {
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6" data-testid="acesso-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" data-testid="acesso-title">Controle de Acesso</h1>
          <p className="text-gray-400 mt-1">Gerencie usuários e permissões do sistema</p>
        </div>
        <Button className="bg-sony-red hover:bg-sony-red/90 text-white hover:opacity-90 transition-opacity" data-testid="add-user-btn">
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg overflow-hidden" data-testid={`acesso-stat-${index}`}>
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, email, cargo ou departamento..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-users-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-lg" data-testid="users-table-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {filteredUsuarios.length} Usuário(s) encontrado(s)
          </CardTitle>
          <CardDescription>Gerencie os usuários e suas permissões de acesso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-900">
                  <TableHead className="font-semibold">Usuário</TableHead>
                  <TableHead className="font-semibold">Cargo</TableHead>
                  <TableHead className="font-semibold">Perfil</TableHead>
                  <TableHead className="font-semibold">Departamento</TableHead>
                  <TableHead className="font-semibold">Último Acesso</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.map((usuario) => (
                  <TableRow 
                    key={usuario.id} 
                    className="hover:bg-red-50/30 transition-colors"
                    data-testid={`user-row-${usuario.id}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-sony-red hover:bg-sony-red/90 text-white text-white text-sm font-semibold">
                            {getInitials(usuario.nome)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{usuario.nome}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Mail className="h-3 w-3" />
                            {usuario.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{usuario.cargo}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPerfilColor(usuario.perfil)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {usuario.perfil}
                      </Badge>
                    </TableCell>
                    <TableCell>{usuario.departamento}</TableCell>
                    <TableCell className="text-sm text-gray-600">{usuario.ultimoAcesso}</TableCell>
                    <TableCell>
                      <Badge className={usuario.status === 'Ativo' 
                        ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                        : 'bg-gray-100 text-gray-300 hover:bg-gray-800'
                      }>
                        {usuario.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          data-testid={`permissions-user-${usuario.id}`}
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                          data-testid={`edit-user-${usuario.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                          data-testid={`delete-user-${usuario.id}`}
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
              Mostrando <span className="font-medium">{filteredUsuarios.length}</span> de{' '}
              <span className="font-medium">{usuarios.length}</span> resultados
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Anterior</Button>
              <Button variant="outline" size="sm" className="bg-sony-red hover:bg-sony-red/90 text-white text-white border-0">1</Button>
              <Button variant="outline" size="sm">Próximo</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Acesso;