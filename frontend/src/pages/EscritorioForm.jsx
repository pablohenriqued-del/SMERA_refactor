import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Toaster } from '../components/ui/sonner';
import { SonyLogo } from '../components/SonyLogo';
import { ParticipantesEditor, isAllocationValid } from '../components/ParticipantesEditor';
import { validateDoc, formatCpfCnpj } from '../lib/validators';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Field = ({ label, children, full }) => (
  <div className={full ? 'md:col-span-2' : ''}>
    <Label className="overline block mb-1.5">{label}</Label>
    {children}
  </div>
);

const EscritorioForm = () => {
  const { token } = useParams();
  const [info, setInfo] = useState(null);
  const [esc, setEsc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axios.get(`${API}/public/escritorio/${token}`)
      .then(({ data }) => {
        setInfo(data);
        setEsc({
          nomeArtista: '', tipoContratoArtista: '', artistaBeneficiario: '', cpfCnpj: '',
          banco: '', agencia: '', conta: '', observacoes: '', royaltyPorFaixa: 0, participantes: [],
          ...(data.escritorio || {}),
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  const set = (patch) => setEsc((p) => ({ ...p, ...patch }));

  const docRes = validateDoc(esc?.cpfCnpj);
  const allocOk = esc ? isAllocationValid(esc.participantes, esc.royaltyPorFaixa) : true;
  const docOk = !esc?.cpfCnpj || docRes.valid;

  const submit = async () => {
    if (!allocOk) { toast.error('A soma dos participantes ultrapassa o total da faixa.'); return; }
    if (!docOk) { toast.error('CPF/CNPJ inválido.'); return; }
    setSaving(true);
    try {
      const { data } = await axios.post(`${API}/public/escritorio/${token}`, esc);
      setDone(true);
      toast.success(`Enviado com sucesso (envio #${data.submissionCount})`);
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Erro ao enviar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-8 w-8 text-sony-red animate-spin" /></div>;

  if (notFound) {
    return (
      <div className="min-h-screen bg-black noise flex items-center justify-center p-4">
        <div className="text-center"><AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-3" /><p className="text-white font-heading text-xl">Link inválido ou expirado</p><p className="text-zinc-500 mt-1">Contate o responsável A&R da Sony Music.</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black noise relative">
      <div className="fixed top-0 left-0 right-0 h-[300px] sony-glow-top pointer-events-none z-0" />
      <Toaster position="top-right" richColors theme="dark" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <SonyLogo svgClass="h-10 w-auto" titleClass="text-xl" />
          <span className="overline">Formulário do Escritório</span>
        </div>

        {done ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-obsidian p-10 text-center" data-testid="escritorio-success">
            <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <h1 className="font-heading text-2xl text-white mb-2">Dados enviados com sucesso</h1>
            <p className="text-zinc-500 mb-6">O responsável A&R foi notificado. Você pode reabrir este link para revisar ou reenviar os dados.</p>
            <Button className="btn-sony" onClick={() => setDone(false)} data-testid="reopen-btn">Revisar / Reenviar</Button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="card-obsidian p-5">
              <h1 className="font-heading text-2xl text-white">{info.projeto}</h1>
              <p className="text-zinc-500 text-sm mt-1">{info.titulo} {info.artistaPrincipal ? `• ${info.artistaPrincipal}` : ''}</p>
              <p className="text-sm text-zinc-400 mt-3">Royalty do artista principal: <strong className="text-white">{info.artistRoyaltyPercent}%</strong>. Preencha abaixo os percentuais e dados dos vendors. {info.submissionCount > 0 && <span className="text-amber-400">(já enviado {info.submissionCount}x)</span>}</p>
            </div>

            <div className="card-obsidian p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nome do Artista"><Input className="input-obsidian" value={esc.nomeArtista} onChange={(e) => set({ nomeArtista: e.target.value })} data-testid="f-nomeArtista" /></Field>
                <Field label="Tipo de Contrato do Artista"><Input className="input-obsidian" value={esc.tipoContratoArtista} onChange={(e) => set({ tipoContratoArtista: e.target.value })} /></Field>
                <Field label="Artista Beneficiário"><Input className="input-obsidian" value={esc.artistaBeneficiario} onChange={(e) => set({ artistaBeneficiario: e.target.value })} /></Field>
                <Field label="CPF / CNPJ">
                  <Input className={`input-obsidian ${esc.cpfCnpj && !docOk ? '!border-red-500' : docOk && esc.cpfCnpj ? '!border-emerald-500' : ''}`} value={esc.cpfCnpj} onChange={(e) => set({ cpfCnpj: formatCpfCnpj(e.target.value) })} placeholder="CPF ou CNPJ" data-testid="f-cpfcnpj" />
                  {esc.cpfCnpj && <p className={`text-xs mt-1 ${docOk ? 'text-emerald-400' : 'text-red-400'}`}>{docRes.type || 'Documento'} {docOk ? 'válido' : 'inválido'}</p>}
                </Field>
                <Field label="Banco"><Input className="input-obsidian" value={esc.banco} onChange={(e) => set({ banco: e.target.value })} /></Field>
                <Field label="Agência"><Input className="input-obsidian" value={esc.agencia} onChange={(e) => set({ agencia: e.target.value })} /></Field>
                <Field label="Conta"><Input className="input-obsidian" value={esc.conta} onChange={(e) => set({ conta: e.target.value })} /></Field>
                <Field label="Royalty Total da Faixa (%)"><Input type="number" className="input-obsidian" value={esc.royaltyPorFaixa} onChange={(e) => set({ royaltyPorFaixa: Number(e.target.value) })} data-testid="f-royalty-total" /></Field>
                <Field label="Observações" full><Textarea className="input-obsidian min-h-[70px]" value={esc.observacoes} onChange={(e) => set({ observacoes: e.target.value })} /></Field>
              </div>
            </div>

            <div className="card-obsidian p-5">
              <ParticipantesEditor participantes={esc.participantes} royaltyTotal={esc.royaltyPorFaixa} onChange={(arr) => set({ participantes: arr })} />
            </div>

            <Button className="btn-sony w-full" onClick={submit} disabled={saving || !allocOk || !docOk} data-testid="escritorio-submit-btn">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}Enviar para a Sony Music
            </Button>
            <p className="text-center text-xs text-zinc-600">© 2026 Sony Music Entertainment · SMERA</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EscritorioForm;
