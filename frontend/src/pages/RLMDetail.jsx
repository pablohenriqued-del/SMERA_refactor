import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const RLMDetail = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('detalhes');

  const contract = {
    number: 'TEST004',
    name: 'FEATURING – TEST004',
    type: 'FT',
  };

  return (
    <div className="space-y-6" data-testid="rlm-detail-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/rlm')}
            className="text-gray-400 hover:text-white"
            data-testid="back-btn"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white" data-testid="rlm-detail-title">
              RLM Preview
            </h1>
            <p className="text-gray-400 mt-1">Visualização de contrato de licenciamento</p>
          </div>
        </div>
      </div>

      {/* Contract Header */}
      <Card className="border-0 shadow-lg bg-gray-950">
        <CardHeader>
          <CardTitle className="text-white">
            Contrato selecionado
          </CardTitle>
          <p className="text-lg text-gray-300 font-semibold">
            {contract.number} - {contract.name}
          </p>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 bg-gray-900 p-1">
          <TabsTrigger value="detalhes" className="data-[state=active]:bg-sony-red">
            DETALHES
          </TabsTrigger>
          <TabsTrigger value="vendors" className="data-[state=active]:bg-sony-red">
            ACCOUNT VENDORS
          </TabsTrigger>
          <TabsTrigger value="recording" className="data-[state=active]:bg-sony-red">
            RECORDING DESCRIPTION
          </TabsTrigger>
          <TabsTrigger value="project" className="data-[state=active]:bg-sony-red">
            PROJECT PROFIT CENTER
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-sony-red text-xs">
            GENERAL UNIT DEDUCTIONS
          </TabsTrigger>
          <TabsTrigger value="limited" className="data-[state=active]:bg-sony-red text-xs">
            LIMITED UNIT DEDUCTIONS
          </TabsTrigger>
          <TabsTrigger value="rates" className="data-[state=active]:bg-sony-red">
            RATES
          </TabsTrigger>
        </TabsList>

        {/* DETALHES Tab */}
        <TabsContent value="detalhes" className="space-y-6">
          {/* Identificação */}
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Identificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-400">Contract #</Label>
                  <Input value="TEST004" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Contract Name</Label>
                  <Input value="FEATURING – TEST004" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Contract Type</Label>
                  <Input value="FT" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Head Contract</Label>
                <Input placeholder="Head Contract" className="bg-gray-900 text-white border-gray-700" />
              </div>
            </CardContent>
          </Card>

          {/* Dados Contábeis */}
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Dados Contábeis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-400">Contracting Company Key</Label>
                  <Input value="0249" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Contract Accounting Period</Label>
                  <Input value="Quarterly" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Statement Days</Label>
                  <Input value="60" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-400">Payment Days</Label>
                  <Input value="60" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Accounting Yes/No</Label>
                  <Input value="No" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Source Contract</Label>
                  <Input value="SOURCE02" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comentários */}
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Comentários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Comment 1</Label>
                <Input 
                  value="Feito com base no SMERA ID ##### na data de ##/##/####" 
                  className="bg-gray-900 text-white border-gray-700" 
                  readOnly 
                />
              </div>
              <div>
                <Label className="text-gray-400">Comment 2</Label>
                <Input placeholder="Comment 2" className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <Label className="text-gray-400">Notes</Label>
                <Input placeholder="Notes" className="bg-gray-900 text-white border-gray-700" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACCOUNT VENDORS Tab */}
        <TabsContent value="vendors" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Vendor #1</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-400">Contract #</Label>
                  <Input value="TEST003" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Account Share %</Label>
                  <Input value="50%" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Account #</Label>
                  <Input value="AC001" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-400">Account Name</Label>
                  <Input value="Main Account" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Contracting Company</Label>
                  <Input value="Company A" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Account Type</Label>
                  <Input value="Primary" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-400">Vendor #</Label>
                  <Input value="V001" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Vendor Share %</Label>
                  <Input value="50%" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Vendor Name</Label>
                  <Input value="Vendor A" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RECORDING DESCRIPTION Tab */}
        <TabsContent value="recording" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Recording #1</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Recording Description Name</Label>
                  <Input 
                    value="FEATURING - TEST RC Medley 10 - 5%" 
                    className="bg-gray-900 text-white border-gray-700" 
                    readOnly 
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Recording Description Type</Label>
                  <Input value="Track" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-400">Product #</Label>
                  <Input value="BKF5C2300010" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">ISRC</Label>
                  <Input value="BKF5C2300010" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Share %</Label>
                  <Input value="5%" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Recording #2</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Recording Description Name</Label>
                  <Input 
                    value="FEATURING - TEST RC Medley 6 - 3%" 
                    className="bg-gray-900 text-white border-gray-700" 
                    readOnly 
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Recording Description Type</Label>
                  <Input value="Track" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-400">Product #</Label>
                  <Input value="BXIV82165409" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">ISRC</Label>
                  <Input value="BXIV82165409" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Share %</Label>
                  <Input value="3%" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROJECT PROFIT CENTER Tab */}
        <TabsContent value="project" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Profit Center #1</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-400">Contract #</Label>
                  <Input value="TEST003" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Link Type</Label>
                  <Input value="Direct" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Project #</Label>
                  <Input value="PROJO01" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Profit Center Code</Label>
                  <Input value="PCO01" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
                <div>
                  <Label className="text-gray-400">Proration %</Label>
                  <Input value="100%" className="bg-gray-900 text-white border-gray-700" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GENERAL UNIT DEDUCTIONS Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 text-lg">Nenhuma dedução geral configurada</p>
              <Button className="mt-4 bg-sony-red hover:bg-sony-red/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Dedução
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LIMITED UNIT DEDUCTIONS Tab */}
        <TabsContent value="limited" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 text-lg">Nenhuma dedução limitada configurada</p>
              <Button className="mt-4 bg-sony-red hover:bg-sony-red/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Dedução Limitada
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RATES Tab */}
        <TabsContent value="rates" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gray-950">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 text-lg">Nenhuma taxa configurada</p>
              <Button className="mt-4 bg-sony-red hover:bg-sony-red/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Taxa
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RLMDetail;
