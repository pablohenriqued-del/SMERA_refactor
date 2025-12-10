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
  MapPin
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
  ];

  const recentActivity = [
    { id: 1, project: 'JETSKI', artist: 'Pedro Sampaio', status: 'Pendente', date: '18/12/2025', type: 'License In' },
    { id: 2, project: 'Batidão Tropical 2', artist: 'Pabllo Vittar', status: 'Finalizado', date: '15/12/2025', type: 'License In' },
    { id: 3, project: 'Noite Perfeita', artist: 'Anitta', status: 'Em Análise', date: '15/01/2026', type: 'License In' },
    { id: 4, project: 'Sertanejo Top', artist: 'Marília Mendonça', status: 'Finalizado', date: '10/03/2026', type: 'License In' },
    { id: 5, project: 'Funk Remix', artist: 'MC Hariel', status: 'Pendente', date: '20/02/2026', type: 'License In' },
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
        <h1 className="text-3xl font-bold text-white" data-testid="dashboard-title">Dashboard</h1>
        <p className="text-gray-400 mt-1">Visão geral do sistema de licenciamento</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-800 hover:border-purple-200 hover:bg-red-50/30 transition-all duration-200"
                  data-testid={`activity-item-${activity.id}`}
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
            <CardDescription>Distribuição por região</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {territories.map((territory, index) => (
                <div key={index} className="space-y-2" data-testid={`territory-item-${index}`}>
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
                  <p className="text-2xl font-bold text-white">187</p>
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