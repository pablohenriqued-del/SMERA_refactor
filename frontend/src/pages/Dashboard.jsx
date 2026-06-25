import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileInput, FileOutput, Clock, CheckCircle, Calendar, DollarSign,
  Music, ArrowUpRight, Activity, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';
import api, { apiErrorMessage } from '../lib/api';

const COLORS = { 'Finalizado': '#10b981', 'Em Análise': '#3b82f6', 'Pendente': '#f59e0b' };

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Finalizado': return 'badge-success';
    case 'Em Análise': return 'badge-info';
    case 'Pendente': return 'badge-warning';
    default: return 'badge-info';
  }
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark px-4 py-3 rounded-sm">
        <p className="font-heading font-bold text-white uppercase tracking-wide text-sm">{payload[0].name}</p>
        <p className="text-zinc-400 text-sm mt-1">{payload[0].value} licenças</p>
      </div>
    );
  }
  return null;
};

const StatusChart = ({ title, icon: Icon, iconBg, iconColor, data, testid }) => (
  <Card className="card-obsidian" data-testid={testid}>
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-sm ${iconBg} flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div>
          <CardTitle className="font-heading font-bold text-white uppercase tracking-wide text-sm">{title}</CardTitle>
          <p className="text-xs text-zinc-500">Por Status</p>
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" strokeWidth={0}>
            {data.map((entry, i) => <Cell key={i} fill={COLORS[entry.name]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
              <span className="text-sm text-zinc-400">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setData(data))
      .catch((err) => toast.error(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]" data-testid="dashboard-loading">
        <Loader2 className="h-8 w-8 text-sony-red animate-spin" />
      </div>
    );
  }

  const { stats: s, licenseInData, licenseOutData, sonySonyData, recentActivity } = data;
  const stats = [
    { title: 'Licenças Ativas', value: s.licencasAtivas, icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600' },
    { title: 'Pendentes', value: s.pendentes, icon: Clock, gradient: 'from-amber-500 to-amber-600' },
    { title: 'License In', value: s.licenseIn, icon: FileInput, gradient: 'from-sony-red to-red-600' },
    { title: 'License Out', value: s.licenseOut, icon: FileOutput, gradient: 'from-blue-500 to-blue-600' },
    { title: 'Sony/Sony', value: s.sonySony, icon: Music, gradient: 'from-violet-500 to-violet-600' },
  ];

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="dashboard-page">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="heading-lg text-white" data-testid="dashboard-title">Dashboard</h1>
          <p className="body-md text-zinc-500 mt-1">Visão geral do sistema de licenciamento</p>
        </div>
        <Button variant="outline" className="btn-sony-outline text-sm py-2">
          <Calendar className="h-4 w-4 mr-2" />Dezembro 2025
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="card-obsidian-interactive overflow-hidden cursor-pointer" data-testid={`stat-card-${index}`} onClick={() => setSelectedStat({ ...stat, index })}>
                <CardContent className="p-4 lg:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-sm bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className="overline mb-1">{stat.title}</p>
                  <p className="font-heading font-bold text-2xl lg:text-3xl text-white">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatusChart title="License In" icon={FileInput} iconBg="bg-sony-red/10" iconColor="text-sony-red" data={licenseInData} testid="license-in-chart" />
        <StatusChart title="License Out" icon={FileOutput} iconBg="bg-blue-500/10" iconColor="text-blue-400" data={licenseOutData} testid="license-out-chart" />
        <StatusChart title="Sony/Sony" icon={Music} iconBg="bg-violet-500/10" iconColor="text-violet-400" data={sonySonyData} testid="sony-sony-chart" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="card-obsidian" data-testid="recent-activity-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center">
                <Activity className="h-4 w-4 text-zinc-400" />
              </div>
              <div>
                <CardTitle className="font-heading font-bold text-white uppercase tracking-wide text-sm">Atividade Recente</CardTitle>
                <p className="text-xs text-zinc-500">Últimas atualizações</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-sm border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all cursor-pointer group"
                  data-testid={`activity-item-${index}`}
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-sony-red/10">
                      <FileInput className="h-5 w-5 text-sony-red" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm group-hover:text-sony-red transition-colors">{activity.project}</h4>
                      <p className="text-xs text-zinc-500">{activity.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusBadgeClass(activity.status)} text-xs px-2 py-0.5`}>{activity.status}</Badge>
                    <span className="text-xs text-zinc-600 hidden sm:block">{activity.date}</span>
                  </div>
                </motion.div>
              ))}
              {recentActivity.length === 0 && <p className="text-sm text-zinc-500 py-6 text-center">Nenhuma atividade recente</p>}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stat Detail Modal */}
      <Dialog open={selectedStat !== null} onOpenChange={() => setSelectedStat(null)}>
        <DialogContent className="glass-dark border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedStat && (
                <>
                  <div className={`w-12 h-12 rounded-sm bg-gradient-to-br ${selectedStat.gradient} flex items-center justify-center`}>
                    {React.createElement(selectedStat.icon, { className: 'h-6 w-6 text-white' })}
                  </div>
                  <span className="font-heading font-bold text-xl uppercase tracking-wide">{selectedStat.title}</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-zinc-500">Análise detalhada</DialogDescription>
          </DialogHeader>
          {selectedStat && (
            <div className="space-y-4 mt-4">
              <div className="card-obsidian p-4">
                <p className="overline mb-1">Total Atual</p>
                <p className="font-heading font-bold text-3xl text-white">{selectedStat.value}</p>
              </div>
              <div className="card-obsidian p-4">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span className="font-heading font-semibold text-sm uppercase tracking-wide text-white">Valor Estimado</span>
                </div>
                <p className="font-heading font-bold text-2xl text-emerald-400">R$ {(Number(selectedStat.value) * 1250).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Activity Detail Modal */}
      <Dialog open={selectedActivity !== null} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="glass-dark border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold text-xl uppercase tracking-wide">{selectedActivity?.project}</DialogTitle>
            <DialogDescription className="text-zinc-500">Detalhes do licenciamento</DialogDescription>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="card-obsidian p-4"><p className="overline mb-1">Artista</p><p className="font-medium text-white">{selectedActivity.artist}</p></div>
                <div className="card-obsidian p-4"><p className="overline mb-1">Status</p><Badge className={`${getStatusBadgeClass(selectedActivity.status)} mt-1`}>{selectedActivity.status}</Badge></div>
              </div>
              <div className="card-obsidian p-4 space-y-3">
                <div className="flex justify-between"><span className="text-zinc-500 text-sm">Tipo</span><span className="text-white text-sm">{selectedActivity.type}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500 text-sm">Data</span><span className="text-white text-sm">{selectedActivity.date}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Dashboard;
