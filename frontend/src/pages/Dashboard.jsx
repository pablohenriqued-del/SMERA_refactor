import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  FileInput, 
  FileOutput, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Users,
  X,
  Calendar,
  DollarSign,
  MapPin,
  Music
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Dashboard = () => {
  const [selectedStat, setSelectedStat] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedTerritory, setSelectedTerritory] = useState(null);

  const stats = [
    {
      title: 'Licenças Ativas',
      value: '248',
      change: '+12%',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Pendentes',
      value: '18',
      change: '-5%',
      trend: 'down',
      icon: Clock,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      title: 'License In',
      value: '142',
      change: '+8%',
      trend: 'up',
      icon: FileInput,
      color: 'gradient-sony-red-black'
    },
    {
      title: 'License Out',
      value: '106',
      change: '+4%',
      trend: 'up',
      icon: FileOutput,
      color: 'gradient-sony-black-red'
    },
    {
      title: 'Sony/Sony',
      value: '87',
      change: '+15%',
      trend: 'up',
      icon: Music,
      color: 'gradient-sony-red'
    },
  ];

  const recentActivity = [
    { id: 1, project: 'JETSKI', artist: 'Pedro Sampaio', status: 'Pendente', date: '18/12/2025', type: 'License In' },
    { id: 2, project: 'Batidão Tropical 2', artist: 'Pabllo Vittar', status: 'Finalizado', date: '15/12/2025', type: 'License In' },
    { id: 3, project: 'Noite Perfeita', artist: 'Anitta', status: 'Em Análise', date: '15/01/2026', type: 'License In' },
    { id: 4, project: 'Sertanejo Top', artist: 'Marília Mendonça', status: 'Finalizado', date: '10/03/2026', type: 'License In' },
    { id: 5, project: 'Funk Remix', artist: 'MC Hariel', status: 'Pendente', date: '20/02/2026', type: 'License In' },
  ];

  const territories = [
    { name: 'Brasil', count: 94, percentage: 38 },
    { name: 'México', count: 52, percentage: 21 },
    { name: 'Argentina', count: 38, percentage: 15 },
    { name: 'Colômbia', count: 24, percentage: 10 },
    { name: 'Chile', count: 18, percentage: 7 },
    { name: 'US Latin', count: 15, percentage: 6 },
    { name: 'Espanha', count: 4, percentage: 2 },
    { name: 'Portugal', count: 3, percentage: 1 },
  ];

  // Dados para os gráficos de pizza
  const licenseInData = [
    { name: 'Finalizado', value: 85, percentage: 60 },
    { name: 'Pendente', value: 42, percentage: 30 },
    { name: 'Em Análise', value: 15, percentage: 10 },
  ];

  const licenseOutData = [
    { name: 'Aprovado', value: 64, percentage: 60 },
    { name: 'Em Análise', value: 32, percentage: 30 },
    { name: 'Pendente', value: 10, percentage: 10 },
  ];

  const sonySonyData = [
    { name: 'Em Produção', value: 44, percentage: 50 },
    { name: 'Aprovação Final', value: 26, percentage: 30 },
    { name: 'Planejamento', value: 17, percentage: 20 },
  ];

  const COLORS = {
    'Finalizado': '#22c55e',
    'Pendente': '#eab308',
    'Em Análise': '#3b82f6',
    'Aprovado': '#22c55e',
    'Em Produção': '#22c55e',
    'Aprovação Final': '#f59e0b',
    'Planejamento': '#3b82f6',
  };

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white" data-testid="dashboard-title">Dashboard</h1>
        <p className="text-gray-400 mt-1">Visão geral do sistema de licenciamento</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card 
              key={index} 
              className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
              data-testid={`stat-card-${index}`}
              onClick={() => setSelectedStat({...stat, index})}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                    <div className="flex items-center gap-1">
                      <TrendIcon className={`h-4 w-4 ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-400">vs mês anterior</span>
                    </div>
                  </div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos de Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* License In Chart */}
        <Card className="border-0 shadow-lg bg-gray-950" data-testid="license-in-chart">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <FileInput className="h-5 w-5 text-red-500" />
              License In
            </CardTitle>
            <CardDescription>Distribuição por Status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={licenseInData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {licenseInData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {licenseInData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[item.name] }}
                    />
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">{item.value}</span>
                    <span className="text-xs text-gray-500">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* License Out Chart */}
        <Card className="border-0 shadow-lg bg-gray-950" data-testid="license-out-chart">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <FileOutput className="h-5 w-5 text-red-500" />
              License Out
            </CardTitle>
            <CardDescription>Distribuição por Status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={licenseOutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {licenseOutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {licenseOutData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[item.name] }}
                    />
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">{item.value}</span>
                    <span className="text-xs text-gray-500">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sony/Sony Chart */}
        <Card className="border-0 shadow-lg bg-gray-950" data-testid="sony-sony-chart">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Music className="h-5 w-5 text-red-500" />
              Sony/Sony
            </CardTitle>
            <CardDescription>Distribuição por Status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sonySonyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sonySonyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {sonySonyData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[item.name] }}
                    />
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">{item.value}</span>
                    <span className="text-xs text-gray-500">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-0 shadow-lg" data-testid="recent-activity-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Atividade Recente</CardTitle>
            <CardDescription>Últimas atualizações de licenciamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-800 hover:border-purple-200 hover:bg-red-50/30 transition-all duration-200 cursor-pointer"
                  data-testid={`activity-item-${activity.id}`}
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-sony-red flex items-center justify-center">
                      {activity.type === 'License In' ? (
                        <FileInput className="h-6 w-6 text-white" />
                      ) : (
                        <FileOutput className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{activity.project}</h4>
                      <p className="text-sm text-gray-400">{activity.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={activity.status === 'Finalizado' ? 'default' : 'secondary'}
                      className={activity.status === 'Finalizado' 
                        ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                      }
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-sm text-gray-400">{activity.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Territories Distribution */}
        <Card className="border-0 shadow-lg" data-testid="territories-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Territórios</CardTitle>
            <CardDescription>América Latina, Espanha, Portugal e US Latin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {territories.map((territory, index) => (
                <div 
                  key={index} 
                  className="space-y-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-all" 
                  data-testid={`territory-item-${index}`}
                  onClick={() => setSelectedTerritory(territory)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">{territory.name}</span>
                    <span className="text-sm font-bold text-white">{territory.count}</span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full gradient-sony-red rounded-full transition-all duration-500"
                      style={{ width: `${territory.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{territory.percentage}% do total</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg gradient-sony-red flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Total de Licenças</p>
                  <p className="text-2xl font-bold text-white">248</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Estatísticas */}
      <Dialog open={selectedStat !== null} onOpenChange={() => setSelectedStat(null)}>
        <DialogContent className="bg-gray-950 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              {selectedStat && (
                <>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedStat.color} flex items-center justify-center`}>
                    {React.createElement(selectedStat.icon, { className: "h-6 w-6 text-white" })}
                  </div>
                  {selectedStat.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Detalhes e análise completa
            </DialogDescription>
          </DialogHeader>
          {selectedStat && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Total Atual</p>
                  <p className="text-3xl font-bold text-white">{selectedStat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {React.createElement(selectedStat.trend === 'up' ? TrendingUp : TrendingDown, {
                      className: `h-4 w-4 ${selectedStat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`
                    })}
                    <span className={`text-sm font-medium ${selectedStat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {selectedStat.change}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Mês Anterior</p>
                  <p className="text-3xl font-bold text-white">
                    {selectedStat.index === 0 ? '221' : selectedStat.index === 1 ? '19' : selectedStat.index === 2 ? '131' : '102'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Novembro 2024</p>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                  Últimos 6 Meses
                </h4>
                <div className="space-y-2">
                  {['Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro'].map((month, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{month}</span>
                      <span className="text-sm font-medium text-white">
                        {Math.floor(parseInt(selectedStat.value) * (0.85 + Math.random() * 0.15))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Valor Estimado
                </h4>
                <p className="text-2xl font-bold text-green-500">
                  R$ {(parseInt(selectedStat.value) * 1250).toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-400">Receita estimada total</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Atividade */}
      <Dialog open={selectedActivity !== null} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="bg-gray-950 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {selectedActivity?.project}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Detalhes da atividade de licenciamento
            </DialogDescription>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Artista</p>
                  <p className="text-lg font-semibold text-white">{selectedActivity.artist}</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Status</p>
                  <Badge className={
                    selectedActivity.status === 'Finalizado' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                      : selectedActivity.status === 'Pendente'
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                  }>
                    {selectedActivity.status}
                  </Badge>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Tipo de Licença</span>
                  <span className="text-sm font-medium text-white">{selectedActivity.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Data de Solicitação</span>
                  <span className="text-sm font-medium text-white">{selectedActivity.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Território</span>
                  <span className="text-sm font-medium text-white">Brasil e Mundo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Formato</span>
                  <span className="text-sm font-medium text-white">Participação Especial</span>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-white mb-3">Informações Adicionais</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-400">
                    <strong className="text-white">Gravadora:</strong> Sony Music Entertainment
                  </p>
                  <p className="text-gray-400">
                    <strong className="text-white">Produtor:</strong> {['Carlos Silva', 'Ana Santos', 'João Oliveira', 'Maria Costa'][Math.floor(Math.random() * 4)]}
                  </p>
                  <p className="text-gray-400">
                    <strong className="text-white">Selo:</strong> {['Columbia Records', 'RCA Records', 'Epic Records'][Math.floor(Math.random() * 3)]}
                  </p>
                  <p className="text-gray-400">
                    <strong className="text-white">Código do Projeto:</strong> {`PRJ-${Math.floor(Math.random() * 9000) + 1000}`}
                  </p>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Valor Estimado
                </h4>
                <p className="text-2xl font-bold text-green-500">
                  R$ {(Math.floor(Math.random() * 150000) + 50000).toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-400 mt-1">Receita estimada do projeto</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Território */}
      <Dialog open={selectedTerritory !== null} onOpenChange={() => setSelectedTerritory(null)}>
        <DialogContent className="bg-gray-950 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <MapPin className="h-6 w-6 text-red-500" />
              {selectedTerritory?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Análise detalhada por território
            </DialogDescription>
          </DialogHeader>
          {selectedTerritory && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Total de Licenças</p>
                  <p className="text-3xl font-bold text-white">{selectedTerritory.count}</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Percentual</p>
                  <p className="text-3xl font-bold text-white">{selectedTerritory.percentage}%</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Ativas</p>
                  <p className="text-3xl font-bold text-green-500">{Math.floor(selectedTerritory.count * 0.85)}</p>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-white mb-3">Distribuição por Tipo</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">License In</span>
                      <span className="text-sm font-medium text-white">{Math.floor(selectedTerritory.count * 0.6)}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full gradient-sony-red" style={{ width: '60%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">License Out</span>
                      <span className="text-sm font-medium text-white">{Math.floor(selectedTerritory.count * 0.4)}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: '40%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-white mb-3">Top 5 Artistas nesta Região</h4>
                <div className="space-y-2">
                  {['Pabllo Vittar', 'Pedro Sampaio', 'Anitta', 'MC Hariel', 'Ludmilla'].slice(0, 5).map((artist, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                      <span className="text-sm text-gray-300">{artist}</span>
                      <span className="text-sm font-medium text-white">{Math.floor(Math.random() * 20) + 5} licenças</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Receita Total - {selectedTerritory.name}
                </h4>
                <p className="text-2xl font-bold text-green-500">
                  R$ {(selectedTerritory.count * 45000).toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-400 mt-1">Receita acumulada nos últimos 12 meses</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;