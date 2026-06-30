import React from 'react';

export const SONY_ADDRESS = 'Rua Lauro Muller, 116 - 40º andar · Cep 22.290-160 - Rio de Janeiro - RJ';

const field = (v) => (v && String(v).trim()) || '—';

// Builds the white-paper HTML used for printing / saving as PDF.
export function callbackDocHtml(proc) {
  const cb = proc.callbackDoc || {};
  const v = proc.vendor || {};
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
  <title>Confirmação de dados bancários - ${field(v.nomeFornecedor)}</title>
  <style>
    *{box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;}
    body{margin:0;padding:48px;color:#111;background:#fff;}
    .wrap{max-width:720px;margin:0 auto;}
    .logo{color:#E60012;font-weight:bold;letter-spacing:3px;font-size:13px;}
    h1{font-size:20px;margin:6px 0 24px;border-bottom:2px solid #E60012;padding-bottom:10px;}
    .row{margin:10px 0;font-size:14px;line-height:1.6;}
    .label{color:#666;font-size:11px;text-transform:uppercase;letter-spacing:1px;}
    .val{font-weight:bold;font-size:14px;}
    .grid{display:flex;gap:32px;flex-wrap:wrap;margin:6px 0 18px;}
    .sec{margin-top:22px;}
    .sec h2{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#E60012;border-bottom:1px solid #eee;padding-bottom:6px;}
    .sign{margin-top:48px;border-top:1px solid #333;width:300px;padding-top:6px;font-size:13px;}
    .foot{margin-top:48px;color:#888;font-size:11px;border-top:1px solid #eee;padding-top:12px;}
  </style></head><body><div class="wrap">
    <div class="logo">SONY MUSIC · SMERA</div>
    <h1>Confirmação de dados bancários de Fornecedor</h1>
    <div class="row"><span class="label">Data</span><br><span class="val">${field(cb.data)}</span></div>
    <div class="row">Eu, <strong>${field(cb.solicitante)}</strong>, confirmei verbalmente diretamente com o fornecedor que os dados bancários do beneficiário conferem com as informações abaixo.</div>
    <div class="sec"><h2>Dados do Fornecedor</h2>
      <div class="grid">
        <div><div class="label">CNPJ / CPF</div><div class="val">${field(v.cpfCnpj)}</div></div>
        <div><div class="label">Nome do Fornecedor</div><div class="val">${field(v.nomeFornecedor)}</div></div>
      </div>
    </div>
    <div class="sec"><h2>Detalhes da Confirmação</h2>
      <div class="grid">
        <div><div class="label">Data da confirmação</div><div class="val">${field(cb.dataConfirmacao)}</div></div>
        <div><div class="label">Nome de quem confirmou e cargo</div><div class="val">${field(cb.confirmadoPor)}</div></div>
      </div>
    </div>
    <div class="sec"><h2>Dados Bancários do Fornecedor</h2>
      <div class="grid">
        <div><div class="label">Banco</div><div class="val">${field(v.banco)}</div></div>
        <div><div class="label">Agência</div><div class="val">${field(v.agencia)}</div></div>
        <div><div class="label">Conta Corrente</div><div class="val">${field(v.conta)}</div></div>
      </div>
    </div>
    <div class="sign">Assinatura do solicitante<br><span style="color:#888;font-size:12px;">${field(cb.email)}</span></div>
    <div class="foot">${SONY_ADDRESS}</div>
  </div></body></html>`;
}

export function printCallbackDoc(proc) {
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(callbackDocHtml(proc));
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}

// On-screen white-paper preview for the dialog
export const CallbackDocPreview = ({ proc }) => {
  const cb = proc.callbackDoc || {};
  const v = proc.vendor || {};
  const Row = ({ label, value }) => (
    <div><p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p><p className="font-semibold text-zinc-900">{field(value)}</p></div>
  );
  return (
    <div className="bg-white text-zinc-900 rounded-md p-6 max-h-[60vh] overflow-y-auto" data-testid="callback-preview">
      <p className="text-[#E60012] font-bold tracking-[3px] text-xs">SONY MUSIC · SMERA</p>
      <h3 className="text-lg font-bold border-b-2 border-[#E60012] pb-2 mb-4 mt-1">Confirmação de dados bancários de Fornecedor</h3>
      <Row label="Data" value={cb.data} />
      <p className="text-sm my-3 leading-relaxed">Eu, <strong>{field(cb.solicitante)}</strong>, confirmei verbalmente diretamente com o fornecedor que os dados bancários do beneficiário conferem com as informações abaixo.</p>
      <p className="text-[11px] uppercase tracking-wider text-[#E60012] border-b border-zinc-200 pb-1 mt-4 mb-2 font-semibold">Dados do Fornecedor</p>
      <div className="grid grid-cols-2 gap-4"><Row label="CNPJ / CPF" value={v.cpfCnpj} /><Row label="Nome do Fornecedor" value={v.nomeFornecedor} /></div>
      <p className="text-[11px] uppercase tracking-wider text-[#E60012] border-b border-zinc-200 pb-1 mt-4 mb-2 font-semibold">Detalhes da Confirmação</p>
      <div className="grid grid-cols-2 gap-4"><Row label="Data da confirmação" value={cb.dataConfirmacao} /><Row label="Confirmado por (nome e cargo)" value={cb.confirmadoPor} /></div>
      <p className="text-[11px] uppercase tracking-wider text-[#E60012] border-b border-zinc-200 pb-1 mt-4 mb-2 font-semibold">Dados Bancários</p>
      <div className="grid grid-cols-3 gap-4"><Row label="Banco" value={v.banco} /><Row label="Agência" value={v.agencia} /><Row label="Conta Corrente" value={v.conta} /></div>
      <div className="mt-8 border-t border-zinc-800 w-64 pt-1 text-sm">Assinatura do solicitante<br /><span className="text-zinc-500 text-xs">{field(cb.email)}</span></div>
      <p className="mt-6 text-[11px] text-zinc-400 border-t border-zinc-200 pt-2">{SONY_ADDRESS}</p>
    </div>
  );
};
