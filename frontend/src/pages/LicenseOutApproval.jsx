import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Clock, User, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import api, { apiErrorMessage } from '../lib/api';

const diretoria = [
  { id: 1, nome: 'Andre Vilella', cargo: 'Diretor de A&R' },
  { id: 2, nome: 'Carlos Santos', cargo: 'Diretor Comercial' },
  { id: 3, nome: 'Maria Costa', cargo: 'Diretora Jurídica' },
];
const equipeArtista = [
  { id: 1, nome: 'Paula Manager', cargo: 'Manager' },
  { id: 2, nome: 'Roberto Produtor', cargo: 'Produtor Musical' },
];

const getStatusBadgeClass = (status) => ({ 'Finalizado': 'badge-success', 'Em Análise': 'badge-info', 'Pendente': 'badge-warning' }[status] || 'badge-warning');
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const ApprovalForm = ({ members, tipo, comments, setComments, onSend }) => (
  <Card className="card-obsidian">
    <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Solicitar Aprovação - {tipo}</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      <div>
        <label className="overline block mb-2">Selecione os membros</label>
        <Select>
          <SelectTrigger className="input-obsidian" data-testid={`select-members-${tipo}`}><SelectValue placeholder="Selecione..." /></SelectTrigger>
          <SelectContent className="bg-sony-paper border-white/10">
            {members.map((m) => <SelectItem key={m.id} value={m.id.toString()} className="text-zinc-300 focus:bg-white/5 focus:text-white">{m.nome} - {m.cargo}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="overline block mb-2">Comentários (opcional)</label>
        <Textarea placeholder="Adicione comentários..." className="input-obsidian min-h-[100px]" value={comments} onChange={(e) => setComments(e.target.value)} />
      </div>
      <Button className="btn-sony w-full" onClick={() => onSend(tipo)} data-testid={`send-approval-${tipo}`}><Send className="h-4 w-4 mr-2" />Enviar para Aprovação</Button>
    </CardContent>
  </Card>
);

const ProjectInfo = ({ license }) => (
  <Card className="card-obsidian">
    <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Informações do Projeto</CardTitle></CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div><p className="overline">Título</p><p className="text-white font-medium">{license.titulo}</p></div>
          <div><p className="overline">Artista Sony</p><p className="text-white font-medium">{license.artistaSony}</p></div>
          <div><p className="overline">Tipo</p><p className="text-white font-medium">{license.tipo}</p></div>
        </div>
        <div className="space-y-4">
          <div><p className="overline">Projeto</p><p className="text-white font-medium">{license.projeto}</p></div>
          <div><p className="overline">Solicitante</p><p className="text-white font-medium">{license.solicitante}</p></div>
          <div><p className="overline">Prazo</p><p className="text-white font-medium">{license.prazo}</p></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const EmptyHistory = ({ title }) => (
  <Card className="card-obsidian">
    <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">{title}</CardTitle></CardHeader>
    <CardContent>
      <div className="text-center py-8"><Clock className="h-12 w-12 text-zinc-700 mx-auto mb-3" /><p className="text-zinc-500">Nenhuma avaliação registrada</p></div>
    </CardContent>
  </Card>
);

const LicenseOutApproval = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comments, setComments] = useState('');
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/licenses-out/${id}`)
      .then(({ data }) => setLicense(data))
      .catch((err) => toast.error(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendApproval = (tipo) => {
    toast.success(`Solicitação de aprovação enviada para ${tipo}`);
    setComments('');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 text-sony-red animate-spin" /></div>;
  }
  if (!license) {
    return (
      <div className="text-center py-20" data-testid="approval-not-found">
        <p className="text-zinc-500 mb-4">Solicitação não encontrada</p>
        <Button className="btn-sony" onClick={() => navigate('/license-out')}><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
      </div>
    );
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="license-out-approval-page">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/license-out')} className="text-zinc-400 hover:text-white hover:bg-white/5" data-testid="back-btn"><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="heading-md text-white" data-testid="approval-title">{license.projeto}</h1>
            <p className="body-sm text-zinc-500">{license.titulo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusBadgeClass(license.status)}>{license.status}</Badge>
          <Badge className="badge-info">License Out</Badge>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="diretoria" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-sony-paper border border-white/10 p-1">
            <TabsTrigger value="diretoria" className="data-[state=active]:bg-sony-red rounded-sm" data-testid="tab-diretoria">Diretoria</TabsTrigger>
            <TabsTrigger value="equipe" className="data-[state=active]:bg-sony-red rounded-sm" data-testid="tab-equipe">Equipe do Artista</TabsTrigger>
          </TabsList>

          <TabsContent value="diretoria" className="space-y-4">
            <ApprovalForm members={diretoria} tipo="Diretoria" comments={comments} setComments={setComments} onSend={handleSendApproval} />
            <ProjectInfo license={license} />
            <EmptyHistory title="Avaliações de Diretoria" />
          </TabsContent>
          <TabsContent value="equipe" className="space-y-4">
            <ApprovalForm members={equipeArtista} tipo="Equipe do Artista" comments={comments} setComments={setComments} onSend={handleSendApproval} />
            <ProjectInfo license={license} />
            <EmptyHistory title="Avaliações da Equipe" />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default LicenseOutApproval;
