import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Building2, Plus, Search, Edit, Trash2, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';

const Cadastros = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const artistas = [
    { id: 1, nome: 'Pabllo Vittar', gravadora: 'Sony Music', genero: 'Pop/Funk', pais: 'Brasil', status: 'Ativo', email: 'pabllo@sony.com', telefone: '+55 11 98765-0001' },
    { id: 2, nome: 'Pedro Sampaio', gravadora: 'Sony Music', genero: 'Funk', pais: 'Brasil', status: 'Ativo', email: 'pedro@sony.com', telefone: '+55 11 98765-0002' },
    { id: 3, nome: 'Anitta', gravadora: 'Sony Music', genero: 'Pop/Funk', pais: 'Brasil', status: 'Ativo', email: 'anitta@sony.com', telefone: '+55 11 98765-0003' },
    { id: 4, nome: 'Marília Mendonça', gravadora: 'Sony Music', genero: 'Sertanejo', pais: 'Brasil', status: 'Ativo', email: 'marilia@sony.com', telefone: '+55 11 98765-0004' },
    { id: 5, nome: 'MC Hariel', gravadora: 'Sony Music', genero: 'Funk', pais: 'Brasil', status: 'Ativo', email: 'hariel@sony.com', telefone: '+55 11 98765-0005' },
  ];

  const gravadoras = [
    { id: 1, nome: 'Sony Music Entertainment', pais: 'Brasil', tipo: 'Major', contato: 'contato@sonymusic.com', telefone: '+55 11 3333-0001', status: 'Ativo' },
    { id: 2, nome: 'Universal Music', pais: 'Brasil', tipo: 'Major', contato: 'info@universal.com', telefone: '+55 11 3333-0002', status: 'Ativo' },
    { id: 3, nome: 'Warner Music', pais: 'EUA', tipo: 'Major', contato: 'contact@warner.com', telefone: '+1 555 0001', status: 'Ativo' },
  ];

  const empresas = [
    { id: 1, nome: 'Nike Inc.', segmento: 'Esportes', pais: 'EUA', contato: 'licensing@nike.com', telefone: '+1 555 1000', status: 'Ativo' },
    { id: 2, nome: 'Netflix', segmento: 'Entretenimento', pais: 'EUA', contato: 'music@netflix.com', telefone: '+1 555 2000', status: 'Ativo' },
    { id: 3, nome: 'EA Games', segmento: 'Games', pais: 'EUA', contato: 'soundtrack@ea.com', telefone: '+1 555 4000', status: 'Ativo' },
  ];

  const stats = [
    { title: 'Total de Artistas', value: '248', icon: Music, gradient: 'from-sony-red to-red-600' },
    { title: 'Gravadoras', value: '42', icon: Building2, gradient: 'from-blue-500 to-blue-600' },
    { title: 'Empresas Parceiras', value: '86', icon: Building2, gradient: 'from-emerald-500 to-emerald-600' },
  ];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="cadastros-page">
      <motion.div variants={itemVariants}>
        <h1 className="heading-lg text-white" data-testid="cadastros-title">Cadastros</h1>
        <p className="body-sm text-zinc-500">Gerencie artistas, gravadoras e empresas</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-obsidian" data-testid={`stat-${index}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div><p className="overline">{stat.title}</p><p className="font-heading font-bold text-2xl text-white mt-1">{stat.value}</p></div>
                  <div className={`w-10 h-10 rounded-sm bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}><Icon className="h-5 w-5 text-white" /></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="artistas" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-sony-paper border border-white/10 p-1">
            <TabsTrigger value="artistas" className="data-[state=active]:bg-sony-red rounded-sm" data-testid="tab-artistas">Artistas</TabsTrigger>
            <TabsTrigger value="gravadoras" className="data-[state=active]:bg-sony-red rounded-sm" data-testid="tab-gravadoras">Gravadoras</TabsTrigger>
            <TabsTrigger value="empresas" className="data-[state=active]:bg-sony-red rounded-sm" data-testid="tab-empresas">Empresas</TabsTrigger>
          </TabsList>

          <TabsContent value="artistas">
            <Card className="card-obsidian">
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Artistas</CardTitle></div>
                <Button className="btn-sony text-xs" data-testid="add-artist-btn"><Plus className="h-4 w-4 mr-2" />Novo Artista</Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" /><Input placeholder="Buscar artistas..." className="input-obsidian pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} data-testid="search-artists-input" /></div>
                <div className="rounded-sm border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader><TableRow className="table-header"><TableHead>Nome</TableHead><TableHead>Gravadora</TableHead><TableHead>Gênero</TableHead><TableHead>País</TableHead><TableHead>Contato</TableHead><TableHead>Status</TableHead><TableHead className="text-center">Ações</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {artistas.map((a) => (
                        <TableRow key={a.id} className="table-row" data-testid={`artist-row-${a.id}`}>
                          <TableCell className="font-medium text-white">{a.nome}</TableCell>
                          <TableCell className="text-zinc-400">{a.gravadora}</TableCell>
                          <TableCell><Badge variant="outline" className="bg-sony-red/10 text-sony-red border-sony-red/20 text-xs">{a.genero}</Badge></TableCell>
                          <TableCell className="text-zinc-400">{a.pais}</TableCell>
                          <TableCell><div className="flex flex-col gap-1 text-xs text-zinc-500"><span className="flex items-center gap-1"><Mail className="h-3 w-3" />{a.email}</span><span className="flex items-center gap-1"><Phone className="h-3 w-3" />{a.telefone}</span></div></TableCell>
                          <TableCell><Badge className="badge-success text-xs">{a.status}</Badge></TableCell>
                          <TableCell><div className="flex justify-center gap-1"><Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5" data-testid={`edit-artist-${a.id}`}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10" data-testid={`delete-artist-${a.id}`}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gravadoras">
            <Card className="card-obsidian">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Gravadoras</CardTitle>
                <Button className="btn-sony text-xs" data-testid="add-label-btn"><Plus className="h-4 w-4 mr-2" />Nova Gravadora</Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-sm border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader><TableRow className="table-header"><TableHead>Nome</TableHead><TableHead>País</TableHead><TableHead>Tipo</TableHead><TableHead>Contato</TableHead><TableHead>Telefone</TableHead><TableHead>Status</TableHead><TableHead className="text-center">Ações</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {gravadoras.map((g) => (
                        <TableRow key={g.id} className="table-row" data-testid={`label-row-${g.id}`}>
                          <TableCell className="font-medium text-white">{g.nome}</TableCell>
                          <TableCell className="text-zinc-400">{g.pais}</TableCell>
                          <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">{g.tipo}</Badge></TableCell>
                          <TableCell className="text-zinc-400 text-xs">{g.contato}</TableCell>
                          <TableCell className="text-zinc-400 text-xs">{g.telefone}</TableCell>
                          <TableCell><Badge className="badge-success text-xs">{g.status}</Badge></TableCell>
                          <TableCell><div className="flex justify-center gap-1"><Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button></div></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="empresas">
            <Card className="card-obsidian">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Empresas Parceiras</CardTitle>
                <Button className="btn-sony text-xs" data-testid="add-company-btn"><Plus className="h-4 w-4 mr-2" />Nova Empresa</Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-sm border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader><TableRow className="table-header"><TableHead>Nome</TableHead><TableHead>Segmento</TableHead><TableHead>País</TableHead><TableHead>Contato</TableHead><TableHead>Telefone</TableHead><TableHead>Status</TableHead><TableHead className="text-center">Ações</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {empresas.map((e) => (
                        <TableRow key={e.id} className="table-row" data-testid={`company-row-${e.id}`}>
                          <TableCell className="font-medium text-white">{e.nome}</TableCell>
                          <TableCell><Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">{e.segmento}</Badge></TableCell>
                          <TableCell className="text-zinc-400">{e.pais}</TableCell>
                          <TableCell className="text-zinc-400 text-xs">{e.contato}</TableCell>
                          <TableCell className="text-zinc-400 text-xs">{e.telefone}</TableCell>
                          <TableCell><Badge className="badge-success text-xs">{e.status}</Badge></TableCell>
                          <TableCell><div className="flex justify-center gap-1"><Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button></div></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default Cadastros;
