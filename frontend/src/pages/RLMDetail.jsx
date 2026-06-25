import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import api from '../lib/api';

const RLMDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('detalhes');
  const [direito, setDireito] = useState(null);

  useEffect(() => {
    api.get(`/rlm-rights/${id}`).then(({ data }) => setDireito(data)).catch(() => {});
  }, [id]);

  const contract = { number: direito?.codigo || 'TEST004', name: direito ? `${direito.tipo} – ${direito.obra}` : 'FEATURING – TEST004', type: 'FT' };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const tabs = [
    { value: 'detalhes', label: 'Detalhes' },
    { value: 'vendors', label: 'Account Vendors' },
    { value: 'recording', label: 'Recording' },
    { value: 'project', label: 'Profit Center' },
    { value: 'general', label: 'General Deductions' },
    { value: 'limited', label: 'Limited Deductions' },
    { value: 'rates', label: 'Rates' },
  ];

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="rlm-detail-page">
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/rlm')} className="text-zinc-400 hover:text-white hover:bg-white/5" data-testid="back-btn">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="heading-lg text-white" data-testid="rlm-detail-title">RLM Preview</h1>
          <p className="body-sm text-zinc-500">Visualização de contrato</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="card-obsidian">
          <CardHeader className="pb-2">
            <p className="overline">Contrato Selecionado</p>
            <CardTitle className="font-heading text-xl text-white">{contract.number} - {contract.name}</CardTitle>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="card-obsidian p-2 overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex w-full md:w-auto gap-1 bg-transparent">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="px-4 py-2.5 rounded-sm text-xs font-heading uppercase tracking-wider transition-all data-[state=active]:bg-sony-red data-[state=active]:text-white data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:bg-white/5 data-[state=inactive]:hover:text-white whitespace-nowrap">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="detalhes" className="space-y-4">
            <Card className="card-obsidian">
              <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Identificação</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label className="overline">Contract #</Label><Input value="TEST004" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Contract Name</Label><Input value="FEATURING – TEST004" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Contract Type</Label><Input value="FT" className="input-obsidian mt-1" readOnly /></div>
                </div>
                <div><Label className="overline">Head Contract</Label><Input placeholder="Head Contract" className="input-obsidian mt-1" /></div>
              </CardContent>
            </Card>
            <Card className="card-obsidian">
              <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Dados Contábeis</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label className="overline">Company Key</Label><Input value="0249" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Accounting Period</Label><Input value="Quarterly" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Statement Days</Label><Input value="60" className="input-obsidian mt-1" readOnly /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label className="overline">Payment Days</Label><Input value="60" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Accounting</Label><Input value="No" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Source Contract</Label><Input value="SOURCE02" className="input-obsidian mt-1" readOnly /></div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-obsidian">
              <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Comentários</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label className="overline">Comment 1</Label><Input value="Feito com base no SMERA ID ##### na data de ##/##/####" className="input-obsidian mt-1" readOnly /></div>
                <div><Label className="overline">Comment 2</Label><Input placeholder="Comment 2" className="input-obsidian mt-1" /></div>
                <div><Label className="overline">Notes</Label><Input placeholder="Notes" className="input-obsidian mt-1" /></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-4">
            <Card className="card-obsidian">
              <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Vendor #1</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label className="overline">Contract #</Label><Input value="TEST003" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Account Share %</Label><Input value="50%" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Account #</Label><Input value="AC001" className="input-obsidian mt-1" readOnly /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label className="overline">Account Name</Label><Input value="Main Account" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Contracting Company</Label><Input value="Company A" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Account Type</Label><Input value="Primary" className="input-obsidian mt-1" readOnly /></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recording" className="space-y-4">
            <Card className="card-obsidian">
              <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Recording #1</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="overline">Recording Name</Label><Input value="FEATURING - TEST RC Medley 10 - 5%" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Type</Label><Input value="Track" className="input-obsidian mt-1" readOnly /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label className="overline">Product #</Label><Input value="BKF5C2300010" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">ISRC</Label><Input value="BKF5C2300010" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Share %</Label><Input value="5%" className="input-obsidian mt-1" readOnly /></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="project" className="space-y-4">
            <Card className="card-obsidian">
              <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Profit Center #1</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label className="overline">Contract #</Label><Input value="TEST003" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Link Type</Label><Input value="Direct" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Project #</Label><Input value="PROJO01" className="input-obsidian mt-1" readOnly /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="overline">Profit Center Code</Label><Input value="PCO01" className="input-obsidian mt-1" readOnly /></div>
                  <div><Label className="overline">Proration %</Label><Input value="100%" className="input-obsidian mt-1" readOnly /></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {['general', 'limited', 'rates'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card className="card-obsidian">
                <CardContent className="py-12 text-center">
                  <p className="text-zinc-500">Nenhum item configurado</p>
                  <Button className="btn-sony mt-4"><Plus className="h-4 w-4 mr-2" />Adicionar</Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default RLMDetail;
