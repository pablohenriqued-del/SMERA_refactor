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
import { WaitingBadge } from '../components/WaitingBadge';
import { BankSelect } from '../components/BankSelect';
import { stageBadgeClass } from './RLMProcessos';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { CallbackDocPreview, printCallbackDoc } from '../components/CallbackDocument';
import { useAuth } from '../context/AuthContext';
import { FileText, Printer, Upload, Paperclip, Pencil, Plus, Trash2 } from 'lucide-react';

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

const SumItem = ({ label, value }) => (
  <div className="card-obsidian p-3"><p className="overline mb-1">{label}</p><p className="text-white text-sm break-words">{value || '—'}</p></div>
);

// Read-only summary of a given stage's data (for viewing other stages in the stepper)
const StageSummary = ({ stageKey, proc }) => {
  const esc = proc.escritorio || {};
  const v = proc.vendor || {};
  const grid = (children) => <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>;
  switch (stageKey) {
    case 'aguardando_royalty_ar':
      return grid(<SumItem label="% de Royalties do Artista" value={`${proc.artistRoyaltyPercent || 0}%`} />);
    case 'aguardando_escritorio':
    case 'validacao_ar':
      return (
        <div className="space-y-3">
          {esc.submittedAt && <p className="text-xs text-emerald-400">Último preenchimento do escritório: {esc.submittedAt}</p>}
          {grid(<><SumItem label="Beneficiário" value={esc.artistaBeneficiario} /><SumItem label="CPF / CNPJ" value={esc.cpfCnpj} /><SumItem label="Banco / Ag / Conta" value={`${esc.banco || ''} ${esc.agencia || ''} ${esc.conta || ''}`.trim()} /><SumItem label="Royalty Total da Faixa" value={`${esc.royaltyPorFaixa || 0}%`} /></>)}
          <div className="card-obsidian p-3">
            <p className="overline mb-2">Participantes ({(esc.participantes || []).length}) — royalties e contas</p>
            {(esc.participantes || []).length === 0 ? <p className="text-xs text-zinc-600">Nenhum.</p> :
              (esc.participantes || []).map((p, i) => (
                <div key={i} className="py-1.5 border-b border-white/5 last:border-0">
                  <div className="flex justify-between text-sm text-zinc-200"><span>{p.nome || '—'}</span><span className="text-zinc-400">{p.royalty || 0}%</span></div>
                  <p className="text-xs text-zinc-500">{p.cpfCnpj || '—'} · {p.banco || '—'} · Ag {p.agencia || '—'} · Cc {p.conta || '—'}</p>
                </div>
              ))}
          </div>
        </div>
      );
    case 'aguardando_isrc_label': {
      const list = (proc.isrcs && proc.isrcs.length) ? proc.isrcs : ((proc.isrc || proc.grid) ? [{ isrc: proc.isrc, grid: proc.grid }] : []);
      return (
        <div className="card-obsidian p-3">
          <p className="overline mb-2">ISRCs / GRIDs ({list.length})</p>
          {list.length === 0 ? <p className="text-xs text-zinc-600">Nenhum.</p> :
            list.map((x, i) => (
              <div key={i} className="py-1.5 border-b border-white/5 last:border-0">
                <p className="text-sm text-zinc-200">{x.faixa || 'Faixa —'}</p>
                <p className="text-xs text-zinc-500">ISRC: {x.isrc || '—'} · GRID: {x.grid || '—'}</p>
              </div>
            ))}
        </div>
      );
    }
    case 'aguardando_vendor_ops':
      return (
        <div className="space-y-3">
          {grid(<><SumItem label="Fornecedor" value={v.nomeFornecedor} /><SumItem label="CPF / CNPJ" value={v.cpfCnpj} /><SumItem label="Banco / Ag / Conta" value={`${v.banco || ''} ${v.agencia || ''} ${v.conta || ''}`.trim()} /><SumItem label="Documento assinado" value={proc.signedDocFile?.name || proc.signedDocLink} /></>)}
          {proc.signedAt && <p className="text-xs text-emerald-400">Documento anexado em {proc.signedAt}</p>}
        </div>
      );
    case 'aguardando_input_sistema':
      return grid(<><SumItem label="Vendor no sistema" value={proc.vendorInputDone ? 'Sim' : 'Não'} /><SumItem label="ISRCs no sistema" value={proc.isrcInputDone ? 'Sim' : 'Não'} /></>);
    case 'validacao_final':
      return grid(<><SumItem label="Vendor" value={`${v.nomeFornecedor || '—'} (${v.cpfCnpj || '—'})`} /><SumItem label="ISRCs / GRIDs" value={`${(proc.isrcs?.length) || ((proc.isrc || proc.grid) ? 1 : 0)} item(ns)`} /></>);
    case 'pronto_royalties':
      return grid(<SumItem label="Cadastro de Royalties (Fase 2)" value={proc.royaltyRightId ? 'Criado' : 'Pendente'} />);
    default:
      return <p className="text-sm text-zinc-500">Sem dados nesta etapa.</p>;
  }
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
  const [viewStage, setViewStage] = useState(null);
  const [correcting, setCorrecting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, s] = await Promise.all([api.get(`/rlm-processes/${id}`), api.get('/rlm/stages')]);
      setProc(p.data);
      setStages(s.data);
      setEscNome(p.data.escritorioNome || '');
      setEscEmail(p.data.escritorioEmail || '');
      setViewStage((cur) => cur || p.data.status);
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
  }, [proc?.status, user]);

  const set = (patch) => setProc((prev) => ({ ...prev, ...patch }));
  const setEsc = (patch) => setProc((prev) => ({ ...prev, escritorio: { ...prev.escritorio, ...patch } }));
  const setVendor = (patch) => setProc((prev) => ({ ...prev, vendor: { ...prev.vendor, ...patch } }));
  const setCb = (patch) => setProc((prev) => ({ ...prev, callbackDoc: { ...prev.callbackDoc, ...patch } }));

  const todayStr = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const onUploadSigned = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast.error('Arquivo muito grande (máx. 8MB)'); return; }
    const fd = new FormData();
    fd.append('file', file);
    setSaving(true);
    try {
      const { data } = await api.post(`/rlm-processes/${id}/upload-signed`, fd);
      set({ signedDocFile: data, signedAt: proc.signedAt || todayStr() });
      toast.success('Documento assinado enviado');
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const viewSigned = async () => {
    try {
      const resp = await api.get(`/rlm-processes/${id}/signed-file`, { responseType: 'blob' });
      const url = URL.createObjectURL(resp.data);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  const onSignedLink = (value) => {
    set({ signedDocLink: value, signedAt: value ? (proc.signedAt || todayStr()) : (proc.signedDocFile?.name ? proc.signedAt : '') });
  };

  const save = async (silent = false) => {
    setSaving(true);
    try {
      const payload = {
        artistRoyaltyPercent: Number(proc.artistRoyaltyPercent) || 0,
        escritorio: proc.escritorio,
        isrc: proc.isrc, grid: proc.grid, isrcs: proc.isrcs || [],
        vendor: proc.vendor, callbackDoc: proc.callbackDoc,
        signedDocLink: proc.signedDocLink,
        signedDocFile: proc.signedDocFile || {},
        signedAt: proc.signedAt || '',
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
      setViewStage(data.status);
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
  const viewIdx = stages.findIndex((s) => s.key === viewStage);
  const viewMeta = stages[viewIdx] || cur;
  const isViewingCurrent = viewStage === proc.status;
  const EDITABLE_STAGES = ['aguardando_royalty_ar', 'aguardando_escritorio', 'aguardando_isrc_label', 'aguardando_vendor_ops', 'aguardando_input_sistema'];
  const canCorrect = !isViewingCurrent && EDITABLE_STAGES.includes(viewStage);
  const showStage = (k) => (isViewingCurrent && proc.status === k) || (correcting && viewStage === k);

  const saveCorrection = async () => {
    if (!(await save(true))) return;
    try { await api.post(`/rlm-processes/${id}/log-correction`, { stage: viewStage }); } catch { /* ignore */ }
    await load();
    setCorrecting(false);
    toast.success('Correção salva e registrada no histórico');
  };
  const cancelCorrection = async () => { setCorrecting(false); await load(); };

  const advanceBtn = (label = 'Avançar') => next && (
    <Button className="btn-sony" onClick={() => transition(next.key)} data-testid="advance-btn"><ChevronRight className="h-4 w-4 mr-1" />{label}</Button>
  );
  const returnBtn = (toKey, label = 'Devolver') => (
    <Button variant="outline" className="btn-sony-outline" onClick={() => transition(toKey)} data-testid="return-btn"><ChevronLeft className="h-4 w-4 mr-1" />{label}</Button>
  );

  const participantes = proc.escritorio?.participantes || [];
  const allocOk = isAllocationValid(participantes, proc.escritorio?.royaltyPorFaixa);
  const participantesBankOk = participantes.every((p) => p.nome && p.banco && p.agencia && p.conta);
  const isrcs = proc.isrcs || [];
  const addIsrc = () => set({ isrcs: [...isrcs, { faixa: '', isrc: '', grid: '' }] });
  const updIsrc = (idx, patch) => set({ isrcs: isrcs.map((x, i) => (i === idx ? { ...x, ...patch } : x)) });
  const delIsrc = (idx) => set({ isrcs: isrcs.filter((_, i) => i !== idx) });
  const publicLink = `${window.location.origin}/form/escritorio/${proc.escritorioToken}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(publicLink);
    toast.success('Link copiado');
  };

  const sendEscritorio = async (reminder = false) => {
    if (!escEmail) return;
    setSending(true);
    try {
      const { data } = await api.post(`/rlm-processes/${id}/send-escritorio`, { email: escEmail, nome: escNome, origin: window.location.origin, reminder });
      if (data.email?.sent) {
        toast.success(reminder ? 'Lembrete enviado por e-mail ao escritório' : 'Formulário enviado por e-mail ao escritório');
      } else {
        const link = data.link || publicLink;
        const subject = encodeURIComponent(`[SMERA] ${reminder ? 'Lembrete: ' : ''}Preenchimento de Vendors — ${proc.projeto}`);
        const body = encodeURIComponent(
          `Olá ${escNome || ''},\n\n${reminder ? 'Lembrete: ainda aguardamos o preenchimento dos percentuais e dados dos vendors' : 'Por favor, preencha os percentuais e dados dos vendors'} do projeto "${proc.projeto}" no formulário abaixo:\n\n${link}\n\nObrigado,\nSony Music`
        );
        window.location.href = `mailto:${escEmail}?subject=${subject}&body=${body}`;
        toast.message('Abrindo seu e-mail com o link', { description: 'Ou use "Copiar link" para enviar manualmente.' });
      }
      await load();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible" data-testid="rlm-processo-detail-page">
      <motion.div variants={itemVariants} className="sticky top-16 z-30 -mx-4 lg:-mx-8 -mt-4 lg:-mt-8 px-4 lg:px-8 py-3 glass-dark border-b border-white/10 mb-2" data-testid="process-summary-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate('/rlm/processos')} className="text-zinc-400 hover:text-white hover:bg-white/5 shrink-0" data-testid="back-btn"><ArrowLeft className="h-5 w-5" /></Button>
            <div className="min-w-0">
              <p className="overline truncate">{proc.projeto}</p>
              <h1 className="font-heading text-xl md:text-2xl font-semibold text-white truncate leading-tight" data-testid="processo-title">{proc.titulo || proc.projeto}</h1>
              {proc.artistaPrincipal && <p className="text-sm text-zinc-400 truncate">{proc.artistaPrincipal}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0 pl-11 md:pl-0">
            <div className="text-left md:text-right">
              <p className="overline">Royalty da Faixa</p>
              <p className={`font-heading text-2xl font-semibold ${(Number(proc.escritorio?.royaltyPorFaixa) || 0) > 0 ? 'text-emerald-400' : 'text-zinc-500'}`} data-testid="summary-total-percentage">{Number(proc.escritorio?.royaltyPorFaixa) || 0}%</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-left md:text-right">
              <p className="overline mb-1">Etapa Atual</p>
              <Badge className={`${stageBadgeClass(proc.status)} text-xs`}>{cur.order}. {cur.label}</Badge>
              <p className="text-[10px] text-zinc-500 mt-1">{cur.role}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stepper — all 8 steps fit on screen, clickable to view each stage */}
      <motion.div variants={itemVariants}>
        <Card className="card-obsidian"><CardContent className="p-4">
          <div className="flex items-start">
            {stages.map((s, i) => {
              const done = i < curIdx;
              const isCurrent = i === curIdx;
              const isViewed = s.key === viewStage;
              return (
                <button
                  key={s.key}
                  onClick={() => setViewStage(s.key)}
                  className="flex-1 min-w-0 flex flex-col items-center group focus:outline-none"
                  data-testid={`step-${s.key}`}
                  title={`${s.label} (${s.role})`}
                >
                  <div className="flex items-center w-full">
                    <div className={`h-0.5 flex-1 ${i === 0 ? 'opacity-0' : done || isCurrent ? 'bg-emerald-500/40' : 'bg-white/10'}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
                      ${isCurrent ? 'bg-sony-red text-white' : done ? 'bg-emerald-500 text-white' : 'bg-white/10 text-zinc-400'}
                      ${isViewed ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0E0E11]' : 'group-hover:ring-2 group-hover:ring-white/30 group-hover:ring-offset-2 group-hover:ring-offset-[#0E0E11]'}`}>
                      {done ? <Check className="h-4 w-4" /> : s.order}
                    </div>
                    <div className={`h-0.5 flex-1 ${i === stages.length - 1 ? 'opacity-0' : done ? 'bg-emerald-500/40' : 'bg-white/10'}`} />
                  </div>
                  <span className={`text-[10px] leading-tight text-center mt-1.5 px-1 line-clamp-2 ${isViewed ? 'text-white font-medium' : isCurrent ? 'text-zinc-200' : 'text-zinc-500'}`}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent></Card>
      </motion.div>

      {/* Stage panel */}
      <motion.div variants={itemVariants}>
        <Card className="card-obsidian" data-testid="stage-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-white uppercase tracking-wide text-sm">Etapa {viewMeta.order}: {viewMeta.label}</CardTitle>
            <div className="flex items-center gap-2">
              {correcting && <Badge className="badge-warning text-xs">Modo correção</Badge>}
              {!isViewingCurrent && !correcting && <Badge className="badge-warning text-xs">Somente leitura</Badge>}
              <Badge className="badge-info text-xs">{viewMeta.role}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">

            {(!isViewingCurrent && !correcting) ? (
              <>
                <StageSummary stageKey={viewStage} proc={proc} />
                <div className="flex gap-2">
                  {canCorrect && <Button className="btn-sony" onClick={() => setCorrecting(true)} data-testid="correct-btn"><Pencil className="h-4 w-4 mr-1" />Corrigir esta etapa</Button>}
                  <Button variant="outline" className="btn-sony-outline" onClick={() => setViewStage(proc.status)} data-testid="goto-current-btn"><ChevronRight className="h-4 w-4 mr-1" />Ir para a etapa atual</Button>
                </div>
              </>
            ) : (<>
              {correcting && (
                <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  Editando a Etapa {viewMeta.order} ({viewMeta.label}) sem alterar o status do processo. A alteração será registrada no histórico.
                </div>
              )}

            {showStage('aguardando_royalty_ar') && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="% de Royalties do Artista">
                    <Input type="number" className="input-obsidian" value={proc.artistRoyaltyPercent} onChange={(e) => set({ artistRoyaltyPercent: e.target.value })} data-testid="field-artist-royalty" />
                  </Field>
                </div>
                {isViewingCurrent && <div className="flex gap-2"><Button variant="outline" className="btn-sony-outline" onClick={() => save()} disabled={saving} data-testid="save-btn"><Save className="h-4 w-4 mr-1" />Salvar</Button>{advanceBtn('Enviar ao Escritório')}</div>}
              </>
            )}

            {showStage('aguardando_escritorio') && (
              <>
                {isViewingCurrent && (
                <div className="card-obsidian p-4 space-y-3" data-testid="send-escritorio-panel">
                  <Label className="overline flex items-center gap-2"><Send className="h-3.5 w-3.5 text-sony-red" />Enviar formulário ao Escritório<WaitingBadge item={proc} className="ml-2" /></Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input className="input-obsidian" placeholder="Nome do escritório" value={escNome} onChange={(e) => setEscNome(e.target.value)} data-testid="esc-nome-input" />
                    <Input className="input-obsidian" placeholder="E-mail do escritório" value={escEmail} onChange={(e) => setEscEmail(e.target.value)} data-testid="esc-email-input" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button className="btn-sony" onClick={() => sendEscritorio(false)} disabled={sending || !escEmail} data-testid="send-escritorio-btn">{sending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}Enviar por e-mail</Button>
                    {proc.escritorioEmail && <Button variant="outline" className="btn-sony-outline" onClick={() => sendEscritorio(true)} disabled={sending || !escEmail} data-testid="resend-reminder-btn"><Send className="h-4 w-4 mr-1" />Reenviar lembrete</Button>}
                    <Button variant="outline" className="btn-sony-outline" onClick={copyLink} data-testid="copy-link-btn"><Copy className="h-4 w-4 mr-1" />Copiar link</Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 break-all"><Link2 className="h-3.5 w-3.5 text-zinc-600 shrink-0" />{publicLink}</div>
                  {proc.escritorioEmail && <p className="text-xs text-emerald-400">Último envio para: {proc.escritorioNome} &lt;{proc.escritorioEmail}&gt;</p>}
                  {proc.escritorioSubmissionCount > 0 && <p className="text-xs text-amber-400">O escritório já devolveu o preenchimento {proc.escritorioSubmissionCount}x.</p>}
                </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nome do Artista"><Input className="input-obsidian" value={proc.escritorio.nomeArtista} onChange={(e) => setEsc({ nomeArtista: e.target.value })} data-testid="field-esc-nomeArtista" /></Field>
                  <Field label="Tipo de Contrato do Artista"><Input className="input-obsidian" value={proc.escritorio.tipoContratoArtista} onChange={(e) => setEsc({ tipoContratoArtista: e.target.value })} /></Field>
                  <Field label="Artista Beneficiário"><Input className="input-obsidian" value={proc.escritorio.artistaBeneficiario} onChange={(e) => setEsc({ artistaBeneficiario: e.target.value })} /></Field>
                  <Field label="CPF / CNPJ"><DocInput value={proc.escritorio.cpfCnpj} onChange={(v) => setEsc({ cpfCnpj: v })} testid="field-esc-cpfcnpj" /></Field>
                  <Field label="Banco"><BankSelect value={proc.escritorio.banco} onChange={(v) => setEsc({ banco: v })} testid="field-esc-banco" /></Field>
                  <Field label="Agência"><Input className="input-obsidian" value={proc.escritorio.agencia} onChange={(e) => setEsc({ agencia: e.target.value })} /></Field>
                  <Field label="Conta"><Input className="input-obsidian" value={proc.escritorio.conta} onChange={(e) => setEsc({ conta: e.target.value })} /></Field>
                  <Field label="Royalty Total da Faixa (%)"><Input type="number" className="input-obsidian" value={proc.escritorio.royaltyPorFaixa} onChange={(e) => setEsc({ royaltyPorFaixa: Number(e.target.value) })} data-testid="field-royalty-total" /></Field>
                  <Field label="Observações" full><Textarea className="input-obsidian min-h-[70px]" value={proc.escritorio.observacoes} onChange={(e) => setEsc({ observacoes: e.target.value })} /></Field>
                </div>

                <ParticipantesEditor participantes={participantes} royaltyTotal={proc.escritorio.royaltyPorFaixa} onChange={(arr) => setEsc({ participantes: arr })} artistName={proc.artistaPrincipal} />

                {isViewingCurrent && (
                <div className="flex gap-2">
                  <Button variant="outline" className="btn-sony-outline" onClick={() => save()} disabled={saving || !allocOk} data-testid="save-btn"><Save className="h-4 w-4 mr-1" />Salvar</Button>
                  <Button className="btn-sony" onClick={() => next && transition(next.key)} disabled={!allocOk || !participantesBankOk} data-testid="advance-btn"><ChevronRight className="h-4 w-4 mr-1" />Enviar para Validação</Button>
                </div>
                )}
                {!allocOk && <p className="text-xs text-red-400">A soma dos participantes ultrapassa o total da faixa — ajuste antes de salvar.</p>}
                {allocOk && !participantesBankOk && <p className="text-xs text-amber-400">Todos os participantes precisam ter nome, banco, agência e conta preenchidos para avançar.</p>}
              </>
            )}

            {isViewingCurrent && proc.status === 'validacao_ar' && (
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

            {showStage('aguardando_isrc_label') && (
              <>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Label className="overline">ISRCs / GRIDs ({isrcs.length})</Label>
                  <Button type="button" variant="outline" size="sm" className="btn-sony-outline !py-1 !px-3 text-xs" onClick={addIsrc} data-testid="add-isrc-btn"><Plus className="h-3 w-3 mr-1" />Adicionar ISRC/GRID</Button>
                </div>
                <div className="space-y-2">
                  {isrcs.map((x, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 border border-white/10 rounded-md p-3" data-testid={`isrc-row-${idx}`}>
                      <Field label={`Faixa #${idx + 1}`}><Input className="input-obsidian" placeholder="Nome da faixa" value={x.faixa || ''} onChange={(e) => updIsrc(idx, { faixa: e.target.value })} data-testid={`field-faixa-${idx}`} /></Field>
                      <Field label="ISRC"><Input className="input-obsidian" value={x.isrc} onChange={(e) => updIsrc(idx, { isrc: e.target.value })} data-testid={`field-isrc-${idx}`} /></Field>
                      <div className="flex gap-2 items-end">
                        <div className="flex-1"><Field label="GRID"><Input className="input-obsidian" value={x.grid} onChange={(e) => updIsrc(idx, { grid: e.target.value })} data-testid={`field-grid-${idx}`} /></Field></div>
                        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-red-400 mb-0.5" onClick={() => delIsrc(idx)} data-testid={`del-isrc-${idx}`}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                  {isrcs.length === 0 && <p className="text-xs text-zinc-600">Nenhum ISRC/GRID adicionado. Clique em Adicionar ISRC/GRID.</p>}
                </div>
                {isViewingCurrent && <div className="flex gap-2"><Button variant="outline" className="btn-sony-outline" onClick={() => save()} disabled={saving} data-testid="save-btn"><Save className="h-4 w-4 mr-1" />Salvar</Button>{advanceBtn('Concluir ISRC/GRID')}</div>}
              </>
            )}

            {showStage('aguardando_vendor_ops') && (
              <>
                <div className="card-obsidian p-4 space-y-3">
                  <Label className="overline text-sony-red">1 · Dados do Vendor (Fornecedor)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Nome do Fornecedor"><Input className="input-obsidian" value={proc.vendor.nomeFornecedor} onChange={(e) => setVendor({ nomeFornecedor: e.target.value })} data-testid="field-vendor-nome" /></Field>
                    <Field label="CPF / CNPJ do Fornecedor"><DocInput value={proc.vendor.cpfCnpj} onChange={(v) => setVendor({ cpfCnpj: v })} testid="field-vendor-cpfcnpj" /></Field>
                    <Field label="Banco"><BankSelect value={proc.vendor.banco} onChange={(v) => setVendor({ banco: v })} testid="field-vendor-banco" /></Field>
                    <Field label="Agência"><Input className="input-obsidian" value={proc.vendor.agencia} onChange={(e) => setVendor({ agencia: e.target.value })} /></Field>
                    <Field label="Conta Corrente"><Input className="input-obsidian" value={proc.vendor.conta} onChange={(e) => setVendor({ conta: e.target.value })} /></Field>
                  </div>
                </div>
                {/* Callback document (Confirmação de dados bancários) */}
                <div className="card-obsidian p-4 space-y-3">
                  <Label className="overline text-sony-red flex items-center gap-2"><FileText className="h-3.5 w-3.5" />2 · Documento de Callback (template de Envio ao Exterior)</Label>
                  <p className="text-xs text-zinc-500">Gere/imprima a Confirmação de dados bancários, colete a assinatura e anexe o documento assinado na seção 3.</p>
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
                  <Label className="overline text-sony-red flex items-center gap-2"><Paperclip className="h-3.5 w-3.5" />3 · Documento assinado (Envio ao Exterior)</Label>
                  <Field label="Link externo (SharePoint, etc.)" full><Input className="input-obsidian" placeholder="https://..." value={proc.signedDocLink} onChange={(e) => onSignedLink(e.target.value)} data-testid="field-signed-link" /></Field>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="btn-sony-outline cursor-pointer text-sm inline-flex items-center" data-testid="upload-signed-label">
                      <Upload className="h-4 w-4 mr-2" />Enviar arquivo assinado
                      <input type="file" accept="application/pdf,image/*" className="hidden" onChange={onUploadSigned} data-testid="upload-signed-input" />
                    </label>
                    {proc.signedDocFile?.name && (
                      <span className="flex items-center gap-2 text-sm text-emerald-400">
                        <Paperclip className="h-3.5 w-3.5" />
                        <button onClick={viewSigned} className="underline hover:text-emerald-300" data-testid="signed-file-link">{proc.signedDocFile.name}</button>
                        <button onClick={() => set({ signedDocFile: {} })} className="text-zinc-500 hover:text-red-400 text-xs" data-testid="remove-signed-btn">remover</button>
                      </span>
                    )}
                  </div>
                  {(proc.signedAt && (proc.signedDocFile?.name || proc.signedDocLink)) && (
                    <span className="inline-flex items-center gap-1.5 text-xs badge-success rounded-full px-2.5 py-1" data-testid="signed-stamp"><Check className="h-3 w-3" />Documento anexado em {proc.signedAt}</span>
                  )}
                </div>

                {isViewingCurrent && (
                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <input type="checkbox" checked={!!proc.envioExteriorDone} onChange={(e) => set({ envioExteriorDone: e.target.checked })} data-testid="envio-exterior-check" /> Envio ao exterior concluído
                </label>
                )}
                {isViewingCurrent && <div className="flex gap-2"><Button variant="outline" className="btn-sony-outline" onClick={() => save()} disabled={saving} data-testid="save-btn"><Save className="h-4 w-4 mr-1" />Salvar</Button>{advanceBtn('Avançar para Input no Sistema')}</div>}
              </>
            )}

            {showStage('aguardando_input_sistema') && (
              <>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input type="checkbox" checked={!!proc.vendorInputDone} onChange={(e) => set({ vendorInputDone: e.target.checked })} data-testid="vendor-input-check" /> Vendor inserido no sistema (A&R OPS)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input type="checkbox" checked={!!proc.isrcInputDone} onChange={(e) => set({ isrcInputDone: e.target.checked })} data-testid="isrc-input-check" /> ISRCs inseridos no sistema (Label)
                  </label>
                </div>
                {isViewingCurrent && (
                <div className="flex gap-2">
                  <Button variant="outline" className="btn-sony-outline" onClick={() => save()} disabled={saving} data-testid="save-btn"><Save className="h-4 w-4 mr-1" />Salvar</Button>
                  <Button className="btn-sony" disabled={!(proc.vendorInputDone && proc.isrcInputDone)} onClick={() => transition(next.key)} data-testid="advance-btn"><ChevronRight className="h-4 w-4 mr-1" />Avançar para Validação Final</Button>
                </div>
                )}
              </>
            )}

            {isViewingCurrent && proc.status === 'validacao_final' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="card-obsidian p-3"><p className="overline mb-1">Vendor</p><p className="text-white">{proc.vendor.nomeFornecedor || '—'} ({proc.vendor.cpfCnpj || '—'})</p></div>
                  <div className="card-obsidian p-3"><p className="overline mb-1">ISRCs / GRIDs</p><p className="text-white">{(proc.isrcs?.length) || ((proc.isrc || proc.grid) ? 1 : 0)} item(ns)</p></div>
                </div>
                <Field label="Comentário (opcional)" full><Textarea className="input-obsidian min-h-[70px]" value={note} onChange={(e) => setNote(e.target.value)} data-testid="note-input" /></Field>
                <div className="flex gap-2">{returnBtn('aguardando_input_sistema', 'Devolver')}{advanceBtn('Aprovar e Liberar Royalties')}</div>
              </>
            )}

            {isViewingCurrent && proc.status === 'pronto_royalties' && (
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
            {correcting && (
              <div className="flex gap-2 pt-2 border-t border-white/5">
                <Button variant="outline" className="btn-sony-outline" onClick={cancelCorrection} disabled={saving} data-testid="cancel-correction-btn">Cancelar</Button>
                <Button className="btn-sony" onClick={saveCorrection} disabled={saving || !allocOk} data-testid="save-correction-btn">{saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}Salvar correção</Button>
              </div>
            )}
            </>)}
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
