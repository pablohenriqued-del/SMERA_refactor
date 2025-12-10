import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  FileInput, 
  FileOutput, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const Dashboard = () => {
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
  ];

  const recentActivity = [
    { id: 1, project: 'NOVO PROJETO', artist: 'ARTISTA', status: 'Pendente', date: '12/11/2025', type: 'License In' },
    { id: 2, project: 'Album Release', artist: 'EMCIDA', status: 'Finalizado', date: '12/11/2025', type: 'License Out' },
    { id: 3, project: 'TITULO PROVISORIO', artist: 'EMCIDA', status: 'Pendente', date: '11/08/2025', type: 'License In' },
    { id: 4, project: 'Single Launch', artist: 'THAIS', status: 'Finalizado', date: '11/08/2025', type: 'License Out' },
    { id: 5, project: 'Tour Rights', artist: 'luisa', status: 'Pendente', date: '10/11/2025', type: 'License In' },
  ];

  const territories = [
    { name: 'Brasil e Mundo', count: 84, percentage: 45 },
    { name: 'América Latina', count: 52, percentage: 28 },
    { name: 'Europa', count: 38, percentage: 20 },
    { name: 'Ásia', count: 13, percentage: 7 },
  ];

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900" data-testid="dashboard-title">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do sistema de licenciamento</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid={`stat-card-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    <div className="flex items-center gap-1">
                      <TrendIcon className={`h-4 w-4 ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500">vs mês anterior</span>
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
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-200"
                  data-testid={`activity-item-${activity.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      {activity.type === 'License In' ? (
                        <FileInput className="h-6 w-6 text-white" />
                      ) : (
                        <FileOutput className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{activity.project}</h4>
                      <p className="text-sm text-gray-500">{activity.artist}</p>
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
                    <span className="text-sm text-gray-500">{activity.date}</span>
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
            <CardDescription>Distribuição por região</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {territories.map((territory, index) => (
                <div key={index} className="space-y-2" data-testid={`territory-item-${index}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{territory.name}</span>
                    <span className="text-sm font-bold text-gray-900">{territory.count}</span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full gradient-purple-pink rounded-full transition-all duration-500"
                      style={{ width: `${territory.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{territory.percentage}% do total</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg gradient-purple-pink flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Total de Licenças</p>
                  <p className="text-2xl font-bold text-gray-900">187</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;