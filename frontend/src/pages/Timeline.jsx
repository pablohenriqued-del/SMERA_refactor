import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, FileInput, FileOutput, Music, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { toast } from 'sonner';
import api, { apiErrorMessage } from '../lib/api';
import { ContractCalendar } from '../components/ContractCalendar';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const TYPE_OPTIONS = ['Todos', 'License In', 'License Out', 'Sony/Sony'];
const STATUS_OPTIONS = ['Todos', 'Finalizado', 'Em Análise', 'Pendente'];

const FilterChips = ({ label, options, value, onChange, testid }) => (
  <div className="flex flex-wrap items-center gap-2" data-testid={testid}>
    <span className="overline mr-1">{label}</span>
    {options.map((opt) => {
      const active = value === opt;
      return (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          data-testid={`${testid}-${opt.replace(/[^a-zA-Z]/g, '').toLowerCase()}`}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
            ${active ? 'bg-sony-red text-white border-sony-red' : 'text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'}`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

const TYPE_META = {
  'License In': { icon: FileInput, color: 'text-sony-red', bg: 'bg-sony-red/10' },
  'License Out': { icon: FileOutput, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  'Sony/Sony': { icon: Music, color: 'text-violet-400', bg: 'bg-violet-500/10' },
};

const now = new Date();
const CURRENT_MONTH = { y: now.getFullYear(), m: now.getMonth() + 1 };

const Timeline = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState({ in: [], out: [], sony: [] });
  const [loading, setLoading] = useState(true);
  const [tipoFilter, setTipoFilter] = useState(TYPE_OPTIONS.includes(searchParams.get('tipo')) ? searchParams.get('tipo') : 'Todos');
  const [statusFilter, setStatusFilter] = useState(STATUS_OPTIONS.includes(searchParams.get('status')) ? searchParams.get('status') : 'Todos');

  useEffect(() => {
    Promise.all([
      api.get('/licenses-in'),
      api.get('/licenses-out'),
      api.get('/sony-sony'),
    ])
      .then(([li, lo, ss]) => setData({ in: li.data, out: lo.data, sony: ss.data }))
      .catch((err) => toast.error(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  // unify the 3 contract types into a single normalized list
  const allItems = useMemo(() => {
    const norm = [];
    data.in.forEach((i) => norm.push({ id: `in-${i.id}`, date: i.previsao, tipo: 'License In', artist: i.artista, track: i.titulo, projeto: i.projeto, status: i.status }));
    data.out.forEach((i) => norm.push({ id: `out-${i.id}`, date: i.prazo, tipo: 'License Out', artist: i.artistaSony, track: i.titulo, projeto: i.projeto, status: i.status }));
    data.sony.forEach((i) => norm.push({ id: `sony-${i.id}`, date: i.lancamento, tipo: 'Sony/Sony', artist: i.artistaPrincipal, track: i.projeto, projeto: i.projeto, status: i.status }));
    return norm;
  }, [data]);

  const items = useMemo(() => allItems.filter((i) =>
    (tipoFilter === 'Todos' || i.tipo === tipoFilter) &&
    (statusFilter === 'Todos' || i.status === statusFilter)
  ), [allItems, tipoFilter, statusFilter]);

  const counts = [
    { label: 'License In', value: data.in.length, ...TYPE_META['License In'] },
    { label: 'License Out', value: data.out.length, ...TYPE_META['License Out'] },
    { label: 'Sony/Sony', value: data.sony.length, ...TYPE_META['Sony/Sony'] },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]" data-testid="timeline-loading"><Loader2 className="h-8 w-8 text-sony-red animate-spin" /></div>;
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="timeline-page">
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-sony-red/10 flex items-center justify-center"><CalendarDays className="h-5 w-5 text-sony-red" /></div>
        <div>
          <h1 className="heading-lg text-white" data-testid="timeline-title">Timeline de Lançamentos</h1>
          <p className="body-sm text-zinc-500">Visão unificada dos contratos License In, License Out e Sony/Sony</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {counts.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="card-obsidian" data-testid={`timeline-count-${c.label}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="overline">{c.label}</p>
                  <p className="font-heading font-bold text-2xl text-white mt-1">{c.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-md ${c.bg} flex items-center justify-center`}><Icon className={`h-5 w-5 ${c.color}`} /></div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="card-obsidian"><CardContent className="p-4 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
          <FilterChips label="Tipo" options={TYPE_OPTIONS} value={tipoFilter} onChange={setTipoFilter} testid="timeline-filter-tipo" />
          <FilterChips label="Status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} testid="timeline-filter-status" />
        </CardContent></Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <ContractCalendar
          items={items}
          dateField="date"
          initialMonth={CURRENT_MONTH}
          getPrimary={(i) => i.projeto}
          getSecondary={(i) => `${i.tipo} • ${i.artist}`}
          getArtistTrack={(i) => ({ artist: i.artist, track: i.track })}
          testid="timeline-calendar"
        />
      </motion.div>
    </motion.div>
  );
};

export default Timeline;
