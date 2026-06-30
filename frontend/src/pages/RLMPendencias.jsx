import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Loader2, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import api, { apiErrorMessage } from '../lib/api';
import { RlmTabs } from '../components/RlmTabs';
import { WaitingBadge } from '../components/WaitingBadge';
import { stageBadgeClass } from './RLMProcessos';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const RLMPendencias = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rlm/pendencies')
      .then(({ data }) => setData(data))
      .catch((err) => toast.error(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 text-sony-red animate-spin" /></div>;
  }

  const summary = [
    { label: 'Total de Processos', value: data.totalProcessos, icon: Clock, color: 'text-white' },
    { label: 'Pendentes', value: data.pendentes, icon: AlertTriangle, color: 'text-amber-400' },
    { label: 'Prontos para Royalties', value: data.prontos, icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="rlm-pendencias-page">
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-amber-500/10 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-amber-400" /></div>
        <div>
          <h1 className="heading-lg text-white" data-testid="rlm-pendencias-title">RLM · Pendências</h1>
          <p className="body-sm text-zinc-500">Acompanhe em qual etapa cada processo está parado</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}><RlmTabs /></motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="card-obsidian"><CardContent className="p-4 flex items-center justify-between">
              <div><p className="overline">{s.label}</p><p className={`font-heading font-bold text-3xl mt-1 ${s.color}`}>{s.value}</p></div>
              <Icon className={`h-6 w-6 ${s.color}`} />
            </CardContent></Card>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        {data.groups.map((g) => (
          <Card key={g.stage} className="card-obsidian" data-testid={`pendency-group-${g.stage}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <Badge className={`${stageBadgeClass(g.stage)} text-xs`}>{g.order}. {g.label}</Badge>
                <span className="text-xs text-zinc-500">{g.role}</span>
              </div>
              <span className="font-heading font-bold text-lg text-white">{g.count}</span>
            </CardHeader>
            <CardContent>
              {g.count === 0 ? (
                <p className="text-sm text-zinc-600">Sem pendências nesta etapa.</p>
              ) : (
                <div className="space-y-2">
                  {g.items.map((it) => (
                    <button key={it.id} onClick={() => navigate(`/rlm/processos/${it.id}`)} className="w-full flex items-center justify-between p-3 rounded-md border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all text-left group" data-testid={`pendency-item-${it.id}`}>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-sony-red transition-colors">{it.projeto}</p>
                        <p className="text-xs text-zinc-500">{it.titulo} {it.artistaPrincipal ? `• ${it.artistaPrincipal}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <WaitingBadge item={it} />
                        <span className="text-xs text-zinc-600 font-mono hidden sm:block">{it.updatedAt}</span>
                        <ChevronRight className="h-4 w-4 text-zinc-600" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default RLMPendencias;
