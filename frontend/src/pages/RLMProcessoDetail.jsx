import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Check, ChevronRight, ChevronLeft, Link2, History, CheckCircle2, Save, Send, Copy } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import api, { apiErrorMessage } from '../lib/api';
import { validateDoc, formatCpfCnpj } from '../lib/validators';
import { ParticipantesEditor, isAllocationValid } from '../components/ParticipantesEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { CallbackDocPreview, printCallbackDoc } from '../components/CallbackDocument';
import { useAuth } from '../context/AuthContext';
import { FileText, Printer, Upload, Paperclip } from 'lucide-react';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Field = ({ label, children, full }) => (
  <div className={full ? 'md:col-span-2' : ''}>
    <Label className="overline block mb-1.5">{label}</Label>
    {children}
  </div>
);

// CPF/CNPJ input with live validation
const DocInput = ({ value, onChange, testid }) => {
  const res = validateDoc(value);
  const showError = !res.empty && !res.valid;
  return (
    <div>
      <Input
        className={`input-obsidian ${showError ? '!border-red-500' : res.valid && !res.empty ? '!border-emerald-500' : ''}`}
        value={value || ''}
        onChange={(e) => onChange(formatCpfCnpj(e.target.value))}
        placeholder="CPF ou CNPJ"
        data-testid={testid}
      />
      {!res.empty && (
        <p className={`text-xs mt-1 ${res.valid ? 'text-emerald-400' : 'text-red-400'}`}>
          {res.type || 'Documento'} {res.valid ? 'válido' : 'inválido'}
        </p>
      )}
    </div>
  );
};

const RLMProcessoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proc, setProc] = useState(null);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState('');
  const [escNome, setEscNome] = useState('');
  const [escEmail, setEscEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [showDoc, setShowDoc] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, s] = await Promise.all([api.get(`/rlm-processes/${id}`), api.get('/rlm/stages')]);
      setProc(p.data);
      setStages(s.data);
      setEscNome(p.data.escritorioNome || '');
      setEscEmail(p.data.escritorioEmail || '');
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // prefill callback solicitante/email from the logged-in user once, on the vendor stage
  useEffect(() => {
    if (proc && proc.status === 'aguardando_vendor_ops' && user) {
      const cb = proc.callbackDoc || {};
      if (!cb.solicitante && !cb.email) {
        setProc((prev) => ({ ...prev, callbackDoc: { ...prev.callbackDoc, solicitante: user.nome || '', email: user.email || '' } }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proc?.status, user]);

  const set = (patch) => setProc((prev) => ({ ...prev, ...patch }));
  const setEsc = (patch) => setProc((prev) => ({ ...prev, escritorio: { ...prev.escritorio, ...patch } }));
  const setVendor = (patch) => setProc((prev) => ({ ...prev, vendor: { ...prev.vendor, ...patch } }));
  const setCb = (patch) => setProc((prev) => ({ ...prev, callbackDoc: { ...prev.callbackDoc, ...patch } }));

  const onUploadSigned = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { toast.error('Arquivo muito grande (máx. 4MB)'); return; }
    const reader = new FileReader();
    reader.onload = () => set({ signedDocFile: { name: file.name, dataUrl: reader.result } });
    reader.readAsDataURL(file);
  };

  const save = async (silent = false) => {
    setSaving(true);
    try {
      const payload = {
        artistRoyaltyPercent: Number(proc.artistRoyaltyPercent) || 0,
        escritorio: proc.escritorio,
        isrc: proc.isrc, grid: proc.grid,
        vendor: proc.vendor, callbackDoc: proc.callbackDoc,
        signedDocLink: proc.signedDocLink,
        envioExteriorDone: !!proc.envioExteriorDone,
        vendorInputDone: !!proc.vendorInputDone,
        isrcInputDone: !!proc.isrcInputDone,
      };
      const { data } = await api.put(`/rlm-processes/${id}`, payload);
      setProc(data);
      if (!silent) toast.success('Dados salvos');
      return true;
    } catch (err) {
      toast.error(apiErrorMessage(err));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const transition = async (to, saveFirst = true) => {
    if (saveFirst && !(await save(true))) return;
    try {
      const { data } = await api.post(`/rlm-processes/${id}/transition`, { to, note });
      setProc(data);
      setNote('');
      toast.success('Etapa atualizada');
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  if (loading || !proc) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 text-sony-red animate-spin" /></div>;
  }

  const curIdx = stages.findIndex((s) => s.key === proc.status);
  const cur = stages[curIdx] || {};
  const next = stages[curIdx + 1];
  const prev = stages[curIdx - 1];

  const advanceBtn = (label = 'Avançar') => next && (
    <Button className="btn-sony" onClick={() => transition(next.key)} data-testid="advance-btn"><ChevronRight className="h-4 w-4 mr-1" />{label}</Button>
  );
  const returnBtn = (toKey, label = 'Devolver') => (
    <Button variant="outline" className="btn-sony-outline" onClick={() => transition(toKey)} data-testid="return-btn"><ChevronLeft className="h-4 w-4 mr-1" />{label}</Button>
  );

  const participantes = proc.escritorio?.participantes || [];
  const allocOk = isAllocationValid(participantes, proc.escritorio?.royaltyPorFaixa);
  const publicLink = `${window.location.origin}/form/escritorio/${proc.escritorioToken}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(publicLink);
    toast.success('Link copiado');
  };

  const sendEscritorio = async () => {
    if (!escEmail) return;
    setSending(true);
    try {
      const { data } = await api.post(`/rlm-processes/${id}/send-escritorio`, { email: escEmail, nome: escNome, origin: window.location.origin });
      if (data.email?.sent) toast.success('Formulário enviado por e-mail ao escritório');
      else toast.message('Link gerado — e-mail não configurado', { description: 'Use "Copiar link" para enviar manualmente.' });
      await load();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="rlm-processo-detail-page">
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/rlm/processos')} className="text-zinc-400 hover:text-white hover:bg-white/5" data-testid="back-btn"><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="heading-md text-white" data-testid="processo-title">{proc.projeto}</h1>
          <p className="body-sm text-zinc-500">{proc.titulo} {proc.artistaPrincipal ? `• ${proc.artistaPrincipal}` : ''}</p>
        </div>
      </motion.div>

      {/* Stepper */}
      <motion.div variants={itemVariants}>
        <Card className="card-obsidian"><CardContent className="p-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {stages.map((s, i) => {
              const done = i < curIdx;
              const isCur = i === curIdx;
              return (
                <React.Fragment key={s.key}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-md border ${isCur ? 'border-sony-red bg-sony-red/10' : done ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5'}`} data-testid={`step-${s.key}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCur ? 'bg-sony-red text-white' : done ? 'bg-emerald-500 text-white' : 'bg-white/10 text-zinc-400'}`}>
                      {done ? <Check className="h-3.5 w-3.5" /> : s.order}
                    </div>
                    <div className="text-left">
                      <p className={`text-xs font-medium ${isCur ? 'text-white' : 'text-zinc-400'}`}>{s.label}</p>
                      <p className="text-[10px] text-zinc-600">{s.role}</p>
                    </div>
                  </div>
                  {i < stages.length - 1 && <ChevronRight className="h-4 w-4 text-zinc-700 shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent></Card>
      </motion.div>

      {/* Current stage panel */}
      <motion.div variants={itemVariants}>
        <Card className="card-obsidian" data-testid="stage-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Etapa {cur.order}: {cur.label}</CardTitle>
            <Badge className="badge-info text-xs">{cur.role}</Badge>
          </CardHeader>
          <CardContent className="space-y-5">

            {proc.status === 'aguardando_royalty_ar' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="% de Royalties do Artista">
                    <Input type="number" className="input-obsidian" value={proc.artistRoyaltyPercent} onChange={(e) => set({ artistRoyaltyPercent: e.target.value })} data-testid="field-artist-royalty" />
                  </Field>
                </div>
                <div className="flex gap-2">{<Button variant="outline" className="btn-sony-outline" onClick={() => save()} disabled={saving} data-testid="save-btn"><Save className="h-4 w-4 mr-1" />Salvar</Button>}{advanceBtn('Enviar ao Escritório')}</div>
              </>
            )}

            {proc.status === 'aguardando_escritorio' && (
              <>
                <div className="card-obsidian p-4 space-y-3" data-testid="send-escritorio-panel">
                  <Label className="overline flex items-center gap-2"><Send className="h-3.5 w-3.5 text-sony-red" />Enviar formulário ao Escritório</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input className="input-obsidian" placeholder="Nome do escritório" value={escNome} onChange={(e) => setEscNome(e.target.value)} data-testid="esc-nome-input" />
                    <Input className="input-obsidian" placeholder="E-mail do escritório" value={escEmail} onChange={(e) => setEscEmail(e.target.value)} data-testid="esc-email-input" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button className="btn-sony" onClick={sendEscritorio} disabled={sending || !escEmail} data-testid="send-escritorio-btn">{sending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}Enviar por e-mail</Button>
                    <Button variant="outline" className="btn-sony-outline" onClick={copyLink} data-testid="copy-link-btn"><Copy className="h-4 w-4 mr-1" />Copiar link</Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 break-all"><Link2 className="h-3.5 w-3.5 text-zinc-600 shrink-0" />{publicLink}</div>
                  {proc.escritorioEmail && <p className="text-xs text-emerald-400">Último envio para: {proc.escritorioNome} &lt;{proc.escritorioEmail}&gt;</p>}
                  {proc.escritorioSubmissionCount > 0 && <p className="text-xs text-amber-400">O escritório já devolveu o preenchimento {proc.escritorioSubmissionCount}x.</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nome do Artista"><Input className="input-obsidian" value={proc.escritorio.nomeArtista} onChange={(e) => setEsc({ nomeArtista: e.target.value })} data-testid="field-esc-nomeArtista" /></Field>
                  <Field label="Tipo de Contrato do Artista"><Input className="input-obsidian" value={proc.escritorio.tipoContratoArtista} onChange={(e) => setEsc({ tipoContratoArtista: e.target.value })} /></Field>
                  <Field label="Artista Beneficiário"><Input className="input-obsidian" value={proc.escritorio.artistaBeneficiario} onChange={(e) => setEsc({ artistaBeneficiario: e.target.value })} /></Field>
                  <Field label="CPF / CNPJ"><DocInput value={proc.escritorio.cpfCnpj} onChange={(v) => setEsc({ cpfCnpj: v })} testid="field-esc-cpfcnpj" /></Field>
                  <Field label="Banco"><Input className="input-obsidian" value={proc.escritorio.banco} onChange={(e) => setEsc({ banco: e.target.value })} /></Field>
                  <Field label="Agência"><Input className="input-obsidian" value={proc.escritorio.agencia} onChange={(e) => setEsc({ agencia: e.target.value })} /></Field>
                  <Field label="Conta"><Input className="input-obsidian" value={proc.escritorio.conta} onChange={(e) => setEsc({ conta: e.target.value })} /></Field>
                  <Field label="Royalty Total da Faixa (%)"><Input type="number" className="input-obsidian" value={proc.escritorio.royaltyPorFaixa} onChange={(e) => setEsc({ royaltyPorFaixa: Number(e.target.value) })} data-testid="field-royalty-total" /></Field>
                  <Field label="Observações" full><Textarea className="input-obsidian min-h-[70px]" value={proc.escritorio.observacoes} onChange={(e) => setEsc({ observacoes: e.target.value })} /></Field>
                </div>

                <ParticipantesEditor participantes={participantes} royaltyTotal={proc.escritorio.royaltyPorFaixa} onChange={(arr) => setEsc({ participantes: arr })} />

                <div className="flex gap-2">
                  <Button variant="outline" className="btn-sony-outline" onClick={() => save()} disabled={saving || !allocOk} data-testid="save-btn"><Save className="h-4 w-4 mr-1" />Salvar</Button>
                  <Button className="btn-sony" onClick={() => next && transition(next.key)} disabled={!allocOk} data-testid="advance-btn"><ChevronRight className="h-4 w-4 mr-1" />Enviar para Validação</Button>
                </div>
                {!allocOk && <p className="text-xs text-red-400">A soma dos participantes ultrapassa o total da faixa — ajuste antes de salvar/avançar.</p>}
              </>
            )}

            {proc.status === 'validacao_ar' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="card-obsidian p-3"><p className="overline mb-1">Beneficiário</p><p className="text-white">{proc.escritorio.artistaBeneficiario || '—'}</p></div>
                  <div className="card-obsidian p-3"><p className="overline mb-1">CPF/CNPJ</p><p className="text-white">{proc.escritorio.cpfCnpj || '—'}</p></div>
                  <div className="card-obsidian p-3"><p className="overline mb-1">Banco / Ag / Conta</p><p className="text-white">{proc.escritorio.banco} {proc.escritorio.agencia} {proc.escritorio.conta}</p></div>
                  <div className="card-obsidian p-3"><p className="overline mb-1">Participantes</p><p className="text-white">{participantes.length}</p></div>
                </div>
                <Field label="Comentário (opcional)" full><Textarea className="input-obsidian min-h-[70px]" value={note} onChange={(e) => setNote(e.target.value)} data-testid="note-input" /></Field>
                <div className="flex gap-2">{returnBtn('aguardando_escritorio', 'Devolver ao Escritório')}{advanceBtn('Aprovar Preenchimento')}</div>
              </>
            )}

            {proc.status === 'aguardando_isrc_label' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="ISRC"><Input className="input-obsidian" value={proc.isrc} onChange={(e) => set({ isrc: e.target.value })} data-testid="field-isrc" /></Field>
                  <Field label="GRID"><Input className="input-obsidian" value={proc.grid} onChange={(e) => set({ grid: e.target.value })} data-testid="field-grid" /></Field>
                </div>
                <div className="flex gap-2"><Button variant="outline" className="btn-sony-outline" onClick={() => save()} disabled={saving} data-testid="save-btn"><Save className="h-4 w-4 mr-1" />Salvar</Button>{advanceBtn('Concluir ISRC/GRID')}</div>
              </>
            )}

            {proc.status === 'aguardando_vendor_ops' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nome do Fornecedor"><Input className="input-obsidian" value={proc.vendor.nomeFornecedor} onChange={(e) => setVendor({ nomeFornecedor: e.target.value })} data-testid="field-vendor-nome" /></Field>
                  <Field label="CPF / CNPJ do Fornecedor"><DocInput value={proc.vendor.cpfCnpj} onChange={(v) => setVendor({ cpfCnpj: v })} testid="field-vendor-cpfcnpj" /></Field>
                  <Field label="Banco"><Input className="input-obsidian" value={proc.vendor.banco} onChange={(e) => setVendor({ banco: e.target.value })} /></Field>
                  <Field label="Agência"><Input className="input-obsidian" value={proc.vendor.agencia} onChange={(e) => setVendor({ agencia: e.target.value })} /></Field>
                  <Field label="Conta Corrente"><Input className="input-obsidian" value={proc.vendor.conta} onChange={(e) => setVendor({ conta: e.target.value })} /></Field>
                </div>
                {/* Callback document (Confirmação de dados bancários) */}
                <div className="card-obsidian p-4 space-y-3">
                  <Label className="overline flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-sony-red" />Documento de Callback — Confirmação de dados bancários</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Data"><Input className="input-obsidian" placeholder="dd/mm/aaaa" value={proc.callbackDoc.data} onChange={(e) => setCb({ data: e.target.value })} data-testid="cb-data" /></Field>
                    <Field label="Solicitante (Sony)"><Input className="input-obsidian" value={proc.callbackDoc.solicitante} onChange={(e) => setCb({ solicitante: e.target.value })} data-testid="cb-solicitante" /></Field>
                    <Field label="Data da confirmação"><Input className="input-obsidian" placeholder="dd/mm/aaaa" value={proc.callbackDoc.dataConfirmacao} onChange={(e) => setCb({ dataConfirmacao: e.target.value })} /></Field>
                    <Field label="Confirmado por (nome e cargo)"><Input className="input-obsidian" value={proc.callbackDoc.confirmadoPor} onChange={(e) => setCb({ confirmadoPor: e.target.value })} /></Field>
                    <Field label="E-mail do solicitante" full><Input className="input-obsidian" value={proc.callbackDoc.email} onChange={(e) => setCb({ email: e.target.value })} /></Field>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="btn-sony-outline" onClick={() => setShowDoc(true)} data-testid="view-callback-btn"><FileText className="h-4 w-4 mr-1" />Visualizar documento</Button>
                    <Button variant="outline" className="btn-sony-outline" onClick={() => printCallbackDoc(proc)} data-testid="print-callback-btn"><Printer className="h-4 w-4 mr-1" />Gerar / Imprimir PDF</Button>
                  </div>
                </div>

                {/* Signed document: external link OR upload */}
                <div className="card-obsidian p-4 space-y-3">
                  <Label className="overline flex items-center gap-2"><Paperclip className="h-3.5 w-3.5 text-sony-red" />Documento assinado (Envio ao Exterior)</Label>
                  <Field label="Link externo (SharePoint, etc.)" full><Input className="input-obsidian" placeholder="https://..." value={proc.signedDocLink} onChange={(e) => set({ signedDocLink: e.target.value })} data-testid="field-signed-link" /></Field>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="btn-sony-outline cursor-pointer text-sm inline-flex items-center" data-testid="upload-signed-label">
                      <Upload className="h-4 w-4 mr-2" />Enviar arquivo assinado
                      <input type="file" accept="application/pdf,image/*" className="hidden" onChange={onUploadSigned} data-testid="upload-signed-input" />
                    </label>
                    {proc.signedDocFile?.name && (
                      <span className="flex items-center gap-2 text-sm text-emerald-400">
                        <Paperclip className="h-3.5 w-3.5" />
                        <a href={proc.signedDocFile.dataUrl} download={proc.signedDocFile.name} className="underline hover:text-emerald-300" data-testid="signed-file-link">{proc.signedDocFile.name}</a>
                        <button onClick={() => set({ signedDocFile: {} })} className="text-zinc-500 hover:text-red-400 text-xs" data-testid="remove-signed-btn">remover</button>
                      </span>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <input type="checkbox" checked={!!proc.envioExteriorDone} onChange={(e) => set({ envioExteriorDone: e.target.checked })} data-testid="envio-exterior-check" /> Envio ao exterior concluído
                </label>
                <div className="flex gap-2"><Button variant="outline" className="btn-sony-outline" onClick={() => save()} disabled={saving} data-testid="save-btn"><Save className="h-4 w-4 mr-1" />Salvar</Button>{advanceBtn('Avançar para Input no Sistema')}</div>
              </>
            )}

            {proc.status === 'aguardando_input_sistema' && (
              <>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input type="checkbox" checked={!!proc.vendorInputDone} onChange={(e) => set({ vendorInputDone: e.target.checked })} data-testid="vendor-input-check" /> Vendor inserido no sistema (A&R OPS)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input type="checkbox" checked={!!proc.isrcInputDone} onChange={(e) => set({ isrcInputDone: e.target.checked })} data-testid="isrc-input-check" /> ISRCs inseridos no sistema (Label)
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="btn-sony-outline" onClick={() => save()} disabled={saving} data-testid="save-btn"><Save className="h-4 w-4 mr-1" />Salvar</Button>
                  <Button className="btn-sony" disabled={!(proc.vendorInputDone && proc.isrcInputDone)} onClick={() => transition(next.key)} data-testid="advance-btn"><ChevronRight className="h-4 w-4 mr-1" />Avançar para Validação Final</Button>
                </div>
              </>
            )}

            {proc.status === 'validacao_final' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="card-obsidian p-3"><p className="overline mb-1">Vendor</p><p className="text-white">{proc.vendor.nomeFornecedor || '—'} ({proc.vendor.cpfCnpj || '—'})</p></div>
                  <div className="card-obsidian p-3"><p className="overline mb-1">ISRC / GRID</p><p className="text-white">{proc.isrc || '—'} / {proc.grid || '—'}</p></div>
                </div>
                <Field label="Comentário (opcional)" full><Textarea className="input-obsidian min-h-[70px]" value={note} onChange={(e) => setNote(e.target.value)} data-testid="note-input" /></Field>
                <div className="flex gap-2">{returnBtn('aguardando_input_sistema', 'Devolver')}{advanceBtn('Aprovar e Liberar Royalties')}</div>
              </>
            )}

            {proc.status === 'pronto_royalties' && (
              <div className="text-center py-8">
                <CheckCircle2 className="h-14 w-14 text-emerald-400 mx-auto mb-3" />
                <p className="font-heading text-xl text-white mb-1">Processo concluído</p>
                <p className="text-sm text-zinc-500 mb-5">Pronto para o Cadastro de Royalties (Fase 2).</p>
                <Button className="btn-sony" disabled={saving} onClick={async () => {
                  setSaving(true);
                  try {
                    const { data } = await api.post(`/rlm-processes/${id}/create-royalty`);
                    toast.success(data.created ? 'Cadastro de Royalties criado na Fase 2' : 'Abrindo cadastro existente');
                    navigate(`/rlm/${data.right.id}`);
                  } catch (err) {
                    toast.error(apiErrorMessage(err));
                  } finally {
                    setSaving(false);
                  }
                }} data-testid="goto-fase2-btn">
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {proc.royaltyRightId ? 'Abrir Cadastro de Royalties (Fase 2)' : 'Criar Cadastro de Royalties (Fase 2)'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* History */}
      <motion.div variants={itemVariants}>
        <Card className="card-obsidian" data-testid="history-card">
          <CardHeader><CardTitle className="font-heading text-white uppercase tracking-wide text-sm flex items-center gap-2"><History className="h-4 w-4" />Histórico</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(proc.history || []).slice().reverse().map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-md border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-sony-red mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{h.note || `Transição para ${h.to}`}</p>
                    <p className="text-xs text-zinc-600">{h.by} • {h.at}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showDoc} onOpenChange={setShowDoc}>
        <DialogContent className="glass-dark border-white/10 text-white max-w-2xl">
          <DialogHeader><DialogTitle className="font-heading uppercase tracking-wide text-sm">Documento de Callback</DialogTitle></DialogHeader>
          <CallbackDocPreview proc={proc} />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" className="btn-sony-outline" onClick={() => setShowDoc(false)}>Fechar</Button>
            <Button className="btn-sony" onClick={() => printCallbackDoc(proc)} data-testid="print-callback-modal-btn"><Printer className="h-4 w-4 mr-1" />Gerar / Imprimir PDF</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default RLMProcessoDetail;
