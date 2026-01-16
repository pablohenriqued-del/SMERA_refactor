import React, { useState } from 'react';
import { ArrowLeft, Send, Check, X, Clock, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';

const LicenseOutApproval = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [comments, setComments] = useState('');

  // Dados do licenciamento
  const licenseData = {
    id: id || '2258',
    codigo: 'LIC-2258',
    projeto: 'Novo Licenciamento - D&VH (LIC) | Axtral',
    tituloFaixa: 'Acesso Vitalício',
    tituloProjeto: 'Isso é Axtral',
    artistaSony: 'Diego & Victor Hugo',
    artistaDemandante: 'Grupo Axtral',
    tipo: 'Participação Especial',
    participacao: 'Featuring Artist',
    territorio: 'Brasil e Mundo',
    meios: 'Somente Digital',
    distribuicao: 'ONERPM',
    previsao: '15/01/2026',
    status: 'Pendente'
  };

  // Membros da diretoria
  const diretoria = [
    { id: 1, nome: 'Andre Vilella', email: 'andre.vilella@sonymusic.com', cargo: 'Diretor de A&R' },
    { id: 2, nome: 'Carlos Santos', email: 'carlos.santos@sonymusic.com', cargo: 'Diretor Comercial' },
    { id: 3, nome: 'Maria Costa', email: 'maria.costa@sonymusic.com', cargo: 'Diretora Jurídica' },
    { id: 4, nome: 'João Silva', email: 'joao.silva@sonymusic.com', cargo: 'Diretor de Marketing' },
  ];

  // Equipe do artista
  const equipeArtista = [
    { id: 1, nome: 'Paula Manager', email: 'paula@artistmanagement.com', cargo: 'Manager' },
    { id: 2, nome: 'Roberto Produtor', email: 'roberto@production.com', cargo: 'Produtor Musical' },
    { id: 3, nome: 'Ana Assessora', email: 'ana@press.com', cargo: 'Assessora de Imprensa' },
  ];

  // Histórico de aprovações da diretoria
  const avaliacoesDiretoria = [
    {
      id: 1,
      data: '14/01/2026 11:06',
      usuario: 'Andre Vilella',
      email: 'andre.vilella@sonymusic.com',
      cargo: 'Diretor de A&R',
      status: 'Aprovada',
      comentario: 'Projeto alinhado com estratégia do artista. Aprovado.'
    }
  ];

  // Histórico de aprovações da equipe do artista
  const avaliacoesEquipe = [
    {
      id: 1,
      data: '13/01/2026 15:30',
      usuario: 'Paula Manager',
      email: 'paula@artistmanagement.com',
      cargo: 'Manager',
      status: 'Aprovada',
      comentario: 'Excelente oportunidade de colaboração. Equipe aprova.'
    }
  ];

  const handleSendApproval = (tipo) => {
    alert(`Email enviado para aprovação ${tipo}!`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprovada':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Reprovada':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      default:
        return 'bg-gray-100 text-gray-300 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-6" data-testid="license-out-approval-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/license-out')}
            className="text-gray-400 hover:text-white"
            data-testid="back-btn"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white" data-testid="approval-title">
              [{licenseData.codigo}] {licenseData.projeto}
            </h1>
            <p className="text-gray-400 mt-1">{licenseData.tituloFaixa}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(licenseData.status)}>
            {licenseData.status}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-300 border-blue-700">
            License Out
          </Badge>
        </div>
      </div>

      {/* Tabs - Diretoria e Equipe do Artista */}
      <Tabs defaultValue="diretoria" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-900">
          <TabsTrigger value="diretoria" className="data-[state=active]:bg-sony-red">
            Aprovação Diretoria
          </TabsTrigger>
          <TabsTrigger value="equipe" className="data-[state=active]:bg-sony-red">
            Aprovação Equipe do Artista
          </TabsTrigger>
        </TabsList>

        {/* Tab Aprovação Diretoria */}
        <TabsContent value="diretoria" className="space-y-6">
          {/* Formulário de Envio */}
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Solicitar Aprovação da Diretoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Selecione os membros da diretoria para enviar um email
                </label>
                <Select>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione os membros da diretoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {diretoria.map((membro) => (
                      <SelectItem key={membro.id} value={membro.id.toString()}>
                        {membro.nome} - {membro.cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Comentários adicionais (opcional)
                </label>
                <Textarea
                  placeholder="Adicione comentários sobre o licenciamento..."
                  className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
              <Button 
                className="bg-sony-red hover:bg-sony-red/90 text-white w-full"
                onClick={() => handleSendApproval('Diretoria')}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar para Aprovação
              </Button>
            </CardContent>
          </Card>

          {/* Informações do Projeto */}
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Informações do Projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Título Provisório do Fonograma ou Videograma:</p>
                    <p className="text-white font-medium">{licenseData.tituloFaixa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Artista Sony Music:</p>
                    <p className="text-white font-medium">{licenseData.artistaSony}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Participação:</p>
                    <p className="text-white font-medium">{licenseData.participacao}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Distribuição:</p>
                    <p className="text-white font-medium">{licenseData.distribuicao}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Título Provisório do Projeto:</p>
                    <p className="text-white font-medium">{licenseData.tituloProjeto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Artista Demandante:</p>
                    <p className="text-white font-medium">{licenseData.artistaDemandante}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Território:</p>
                    <p className="text-white font-medium">{licenseData.territorio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Previsão de Lançamento:</p>
                    <p className="text-white font-medium">{licenseData.previsao}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Tipo de Licenciamento:</p>
                    <p className="text-white font-medium">{licenseData.tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Meios/Mídias:</p>
                    <p className="text-white font-medium">{licenseData.meios}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avaliações de Diretoria */}
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Avaliações de Diretoria</CardTitle>
            </CardHeader>
            <CardContent>
              {avaliacoesDiretoria.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhuma avaliação registrada ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {avaliacoesDiretoria.map((avaliacao) => (
                    <div
                      key={avaliacao.id}
                      className="bg-gray-900 p-4 rounded-lg border border-gray-800"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-sony-red flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{avaliacao.usuario}</p>
                            <p className="text-sm text-gray-400">{avaliacao.cargo}</p>
                            <p className="text-xs text-gray-500">{avaliacao.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(avaliacao.status)}>
                            {avaliacao.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{avaliacao.data}</p>
                        </div>
                      </div>
                      {avaliacao.comentario && (
                        <div className="mt-3 pt-3 border-t border-gray-800">
                          <p className="text-sm text-gray-300">{avaliacao.comentario}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Aprovação Equipe do Artista */}
        <TabsContent value="equipe" className="space-y-6">
          {/* Formulário de Envio */}
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Solicitar Aprovação da Equipe do Artista</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Selecione os membros da equipe do artista para enviar um email
                </label>
                <Select>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione os membros da equipe" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {equipeArtista.map((membro) => (
                      <SelectItem key={membro.id} value={membro.id.toString()}>
                        {membro.nome} - {membro.cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Comentários adicionais (opcional)
                </label>
                <Textarea
                  placeholder="Adicione comentários sobre o licenciamento..."
                  className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
              <Button 
                className="bg-sony-red hover:bg-sony-red/90 text-white w-full"
                onClick={() => handleSendApproval('Equipe do Artista')}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar para Aprovação
              </Button>
            </CardContent>
          </Card>

          {/* Informações do Projeto (mesma seção) */}
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Informações do Projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Título Provisório do Fonograma ou Videograma:</p>
                    <p className="text-white font-medium">{licenseData.tituloFaixa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Artista Sony Music:</p>
                    <p className="text-white font-medium">{licenseData.artistaSony}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Participação:</p>
                    <p className="text-white font-medium">{licenseData.participacao}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Distribuição:</p>
                    <p className="text-white font-medium">{licenseData.distribuicao}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Título Provisório do Projeto:</p>
                    <p className="text-white font-medium">{licenseData.tituloProjeto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Artista Demandante:</p>
                    <p className="text-white font-medium">{licenseData.artistaDemandante}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Território:</p>
                    <p className="text-white font-medium">{licenseData.territorio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Previsão de Lançamento:</p>
                    <p className="text-white font-medium">{licenseData.previsao}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Tipo de Licenciamento:</p>
                    <p className="text-white font-medium">{licenseData.tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Meios/Mídias:</p>
                    <p className="text-white font-medium">{licenseData.meios}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avaliações da Equipe */}
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Avaliações da Equipe do Artista</CardTitle>
            </CardHeader>
            <CardContent>
              {avaliacoesEquipe.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhuma avaliação registrada ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {avaliacoesEquipe.map((avaliacao) => (
                    <div
                      key={avaliacao.id}
                      className="bg-gray-900 p-4 rounded-lg border border-gray-800"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-sony-red flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{avaliacao.usuario}</p>
                            <p className="text-sm text-gray-400">{avaliacao.cargo}</p>
                            <p className="text-xs text-gray-500">{avaliacao.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(avaliacao.status)}>
                            {avaliacao.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{avaliacao.data}</p>
                        </div>
                      </div>
                      {avaliacao.comentario && (
                        <div className="mt-3 pt-3 border-t border-gray-800">
                          <p className="text-sm text-gray-300">{avaliacao.comentario}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LicenseOutApproval;
