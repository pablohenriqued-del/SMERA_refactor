import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Clock, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';

const LicenseOutApproval = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comments, setComments] = useState('');

  const licenseData = {
    id: id || '2258', codigo: 'LIC-2258', projeto: 'Novo Licenciamento - D&VH (LIC) | Axtral',
    tituloFaixa: 'Acesso Vitalício', tituloProjeto: 'Isso é Axtral', artistaSony: 'Diego & Victor Hugo',
    artistaDemandante: 'Grupo Axtral', tipo: 'Participação Especial', participacao: 'Featuring Artist',
    territorio: 'Brasil e Mundo', meios: 'Somente Digital', distribuicao: 'ONERPM', previsao: '15/01/2026', status: 'Pendente'
  };

  const diretoria = [
    { id: 1, nome: 'Andre Vilella', cargo: 'Diretor de A&R' },
    { id: 2, nome: 'Carlos Santos', cargo: 'Diretor Comercial' },
    { id: 3, nome: 'Maria Costa', cargo: 'Diretora Jurídica' },
  ];

  const equipeArtista = [
    { id: 1, nome: 'Paula Manager', cargo: 'Manager' },
    { id: 2, nome: 'Roberto Produtor', cargo: 'Produtor Musical' },
  ];

  const avaliacoesDiretoria = [{ id: 1, data: '14/01/2026 11:06', usuario: 'Andre Vilella', cargo: 'Diretor de A&R', status: 'Aprovada', comentario: 'Projeto alinhado. Aprovado.' }];
  const avaliacoesEquipe = [{ id: 1, data: '13/01/2026 15:30', usuario: 'Paula Manager', cargo: 'Manager', status: 'Aprovada', comentario: 'Excelente oportunidade.' }];

  const handleSendApproval = (tipo) => alert(`Email enviado para aprovação ${tipo}!`);
  const getStatusBadgeClass = (status) => status === 'Aprovada' ? 'badge-success' : status === 'Reprovada' ? 'badge-error' : 'badge-warning';

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const ApprovalForm = ({ members, tipo }) => (
    <Card className="card-obsidian">
      <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Solicitar Aprovação - {tipo}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="overline block mb-2">Selecione os membros</label>
          <Select>
            <SelectTrigger className="input-obsidian"><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent className="bg-sony-paper border-white/10">
              {members.map((m) => <SelectItem key={m.id} value={m.id.toString()} className="text-zinc-300 hover:bg-white/5">{m.nome} - {m.cargo}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="overline block mb-2">Comentários (opcional)</label>
          <Textarea placeholder="Adicione comentários..." className="input-obsidian min-h-[100px]" value={comments} onChange={(e) => setComments(e.target.value)} />
        </div>
        <Button className="btn-sony w-full" onClick={() => handleSendApproval(tipo)}><Send className="h-4 w-4 mr-2" />Enviar para Aprovação</Button>
      </CardContent>
    </Card>
  );

  const ProjectInfo = () => (
    <Card className="card-obsidian">
      <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Informações do Projeto</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div><p className="overline">Título Fonograma</p><p className="text-white font-medium">{licenseData.tituloFaixa}</p></div>
            <div><p className="overline">Artista Sony</p><p className="text-white font-medium">{licenseData.artistaSony}</p></div>
            <div><p className="overline">Participação</p><p className="text-white font-medium">{licenseData.participacao}</p></div>
            <div><p className="overline">Distribuição</p><p className="text-white font-medium">{licenseData.distribuicao}</p></div>
          </div>
          <div className="space-y-4">
            <div><p className="overline">Título Projeto</p><p className="text-white font-medium">{licenseData.tituloProjeto}</p></div>
            <div><p className="overline">Artista Demandante</p><p className="text-white font-medium">{licenseData.artistaDemandante}</p></div>
            <div><p className="overline">Território</p><p className="text-white font-medium">{licenseData.territorio}</p></div>
            <div><p className="overline">Previsão</p><p className="text-white font-medium">{licenseData.previsao}</p></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ApprovalHistory = ({ avaliacoes, title }) => (
    <Card className="card-obsidian">
      <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">{title}</CardTitle></CardHeader>
      <CardContent>
        {avaliacoes.length === 0 ? (
          <div className="text-center py-8"><Clock className="h-12 w-12 text-zinc-700 mx-auto mb-3" /><p className="text-zinc-500">Nenhuma avaliação</p></div>
        ) : (
          <div className="space-y-3">
            {avaliacoes.map((a) => (
              <div key={a.id} className="card-obsidian p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-sony-red flex items-center justify-center"><User className="h-5 w-5 text-white" /></div>
                    <div><p className="font-medium text-white">{a.usuario}</p><p className="text-xs text-zinc-500">{a.cargo}</p></div>
                  </div>
                  <div className="text-right"><Badge className={getStatusBadgeClass(a.status)}>{a.status}</Badge><p className="text-xs text-zinc-600 mt-1">{a.data}</p></div>
                </div>
                {a.comentario && <div className="pt-3 border-t border-white/5"><p className="text-sm text-zinc-400">{a.comentario}</p></div>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="license-out-approval-page">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/license-out')} className="text-zinc-400 hover:text-white hover:bg-white/5" data-testid="back-btn"><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="heading-md text-white" data-testid="approval-title">[{licenseData.codigo}] {licenseData.projeto}</h1>
            <p className="body-sm text-zinc-500">{licenseData.tituloFaixa}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="badge-warning">{licenseData.status}</Badge>
          <Badge className="badge-info">License Out</Badge>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="diretoria" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-sony-paper border border-white/10 p-1">
            <TabsTrigger value="diretoria" className="data-[state=active]:bg-sony-red rounded-sm">Diretoria</TabsTrigger>
            <TabsTrigger value="equipe" className="data-[state=active]:bg-sony-red rounded-sm">Equipe do Artista</TabsTrigger>
          </TabsList>

          <TabsContent value="diretoria" className="space-y-4">
            <ApprovalForm members={diretoria} tipo="Diretoria" />
            <ProjectInfo />
            <ApprovalHistory avaliacoes={avaliacoesDiretoria} title="Avaliações de Diretoria" />
          </TabsContent>

          <TabsContent value="equipe" className="space-y-4">
            <ApprovalForm members={equipeArtista} tipo="Equipe do Artista" />
            <ProjectInfo />
            <ApprovalHistory avaliacoes={avaliacoesEquipe} title="Avaliações da Equipe" />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default LicenseOutApproval;
