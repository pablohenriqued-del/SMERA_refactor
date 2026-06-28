import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Check, ChevronRight, ChevronLeft, Plus, Trash2, Link2, History, CheckCircle2, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import api, { apiErrorMessage } from '../lib/api';
import { validateDoc, formatCpfCnpj } from '../lib/validators';

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
  const [proc, setProc] = useState(null);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    try {
      const [p, s] = await Promise.all([api.get(`/rlm-processes/${id}`), api.get('/rlm/stages')]);
      setProc(p.data);
      setStages(s.data);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const set = (patch) => setProc((prev) => ({ ...prev, ...patch }));
  const setEsc = (patch) => setProc((prev) => ({ ...prev, escritorio: { ...prev.escritorio, ...patch } }));
  const setVendor = (patch) => setProc((prev) => ({ ...prev, vendor: { ...prev.vendor, ...patch } }));
  const setCb = (patch) => setProc((prev) => ({ ...prev, callbackDoc: { ...prev.callbackDoc, ...patch } }));

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
  const addPart = () => { if (participantes.length < 20) setEsc({ participantes: [...participantes, { nome: '', royalty: 0 }] }); };
  const updPart = (i, patch) => setEsc({ participantes: participantes.map((p, idx) => idx === i ? { ...p, ...patch } : p) });
  const delPart = (i) => setEsc({ participantes: participantes.filter((_, idx) => idx !== i) });

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
                <div className="p-3 rounded-md bg-white/[0.03] border border-white/5 flex items-center gap-2 text-sm text-zinc-400">
                  <Link2 className="h-4 w-4 text-sony-red" />
                  Link público do escritório (Sub-fase B): <code className="text-zinc-300 text-xs">/form/escritorio/{proc.escritorioToken}</code>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nome do Artista"><Input className="input-obsidian" value={proc.escritorio.nomeArtista} onChange={(e) => setEsc({ nomeArtista: e.target.value })} data-testid="field-esc-nomeArtista" /></Field>
                  <Field label="Tipo de Contrato do Artista"><Input className="input-obsidian" value={proc.escritorio.tipoContratoArtista} onChange={(e) => setEsc({ tipoContratoArtista: e.target.value })} /></Field>
                  <Field label="Artista Beneficiário"><Input className="input-obsidian" value={proc.escritorio.artistaBeneficiario} onChange={(e) => setEsc({ artistaBeneficiario: e.target.value })} /></Field>
                  <Field label="CPF / CNPJ"><DocInput value={proc.escritorio.cpfCnpj} onChange={(v) => setEsc({ cpfCnpj: v })} testid="field-esc-cpfcnpj" /></Field>
                  <Field label="Banco"><Input className="input-obsidian" value={proc.escritorio.banco} onChange={(e) => setEsc({ banco: e.target.value })} /></Field>
                  <Field label="Agência"><Input className="input-obsidian" value={proc.escritorio.agencia} onChange={(e) => setEsc({ agencia: e.target.value })} /></Field>
                  <Field label="Conta"><Input className="input-obsidian" value={proc.escritorio.conta} onChange={(e) => setEsc({ conta: e.target.value })} /></Field>
                  <Field label="Royalty por Faixa (%)"><Input type="number" className="input-obsidian" value={proc.escritorio.royaltyPorFaixa} onChange={(e) => setEsc({ royaltyPorFaixa: Number(e.target.value) })} /></Field>
                  <Field label="Observações" full><Textarea className="input-obsidian min-h-[70px]" value={proc.escritorio.observacoes} onChange={(e) => setEsc({ observacoes: e.target.value })} /></Field>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="overline">Participantes ({participantes.length}/20)</Label>
                    <Button variant="outline" size="sm" className="btn-sony-outline !py-1 !px-3 text-xs" onClick={addPart} disabled={participantes.length >= 20} data-testid="add-participante-btn"><Plus className="h-3 w-3 mr-1" />Adicionar</Button>
                  </div>
                  <div className="space-y-2">
                    {participantes.map((p, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input className="input-obsidian flex-1" placeholder="Nome do participante" value={p.nome} onChange={(e) => updPart(i, { nome: e.target.value })} data-testid={`participante-nome-${i}`} />
                        <Input type="number" className="input-obsidian w-28" placeholder="% royalty" value={p.royalty} onChange={(e) => updPart(i, { royalty: Number(e.target.value) })} data-testid={`participante-royalty-${i}`} />
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-red-400" onClick={() => delPart(i)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    {participantes.length === 0 && <p className="text-xs text-zinc-600">Nenhum participante adicionado.</p>}
                  </div>
                </div>

                <div className="flex gap-2"><Button variant="outline" className="btn-sony-outline" onClick={() => save()} disabled={saving} data-testid="save-btn"><Save className="h-4 w-4 mr-1" />Salvar</Button>{advanceBtn('Enviar para Validação')}</div>
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
                <div className="p-3 rounded-md bg-white/[0.03] border border-white/5 text-xs text-zinc-500">Geração do documento de Callback (Confirmação de dados bancários) será habilitada na Sub-fase C.</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Link do documento assinado (SharePoint)" full><Input className="input-obsidian" placeholder="https://..." value={proc.signedDocLink} onChange={(e) => set({ signedDocLink: e.target.value })} data-testid="field-signed-link" /></Field>
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
                <Button className="btn-sony" onClick={() => navigate('/rlm')} data-testid="goto-fase2-btn">Ir para Cadastro de Royalties (Fase 2)</Button>
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
    </motion.div>
  );
};

export default RLMProcessoDetail;
