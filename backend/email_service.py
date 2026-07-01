import os
import asyncio
import logging

import resend

logger = logging.getLogger(__name__)


def _from_address():
    name = os.environ.get("SENDER_NAME", "").strip()
    email = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev").strip()
    if name:
        # quote display name (it may contain commas)
        return f'"{name}" <{email}>'
    return email


def is_configured() -> bool:
    return bool(os.environ.get("RESEND_API_KEY"))


async def send_email(to: str, subject: str, html: str) -> dict:
    """Send an email via Resend. Returns {sent, reason?}. Never raises (degrades gracefully)."""
    if not is_configured():
        return {"sent": False, "reason": "no_key"}
    resend.api_key = os.environ["RESEND_API_KEY"]
    params = {"from": _from_address(), "to": [to], "subject": subject, "html": html}
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        return {"sent": True, "id": result.get("id") if isinstance(result, dict) else None}
    except Exception as e:  # noqa: BLE001
        logger.error(f"Resend send failed: {e}")
        return {"sent": False, "reason": str(e)}


def invite_html(projeto: str, link: str, artist_pct, titulo: str = "") -> str:
    faixa_line = f'<p style="color:#b3b3b3;line-height:1.6;margin-top:4px;">Faixa: <strong style="color:#fff;">{titulo}</strong></p>' if titulo else ""
    return f"""
    <div style="font-family:Arial,sans-serif;background:#0b0b0c;padding:24px;color:#fff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#141417;border-radius:12px;overflow:hidden;border:1px solid #222;">
        <tr><td style="padding:24px 28px;border-bottom:1px solid #222;">
          <span style="color:#E60012;font-weight:bold;letter-spacing:2px;font-size:12px;">SONY MUSIC · SMERA</span>
        </td></tr>
        <tr><td style="padding:28px;">
          <h2 style="margin:0 0 8px;color:#fff;">Preenchimento de Vendors / Royalties</h2>
          <p style="color:#b3b3b3;line-height:1.6;">Olá, você foi designado(a) para preencher os percentuais e dados dos vendors do projeto
          <strong style="color:#fff;">{projeto}</strong>.</p>
          {faixa_line}
          <p style="color:#b3b3b3;line-height:1.6;">Royalty do artista principal: <strong style="color:#fff;">{artist_pct}%</strong>. A soma dos royalties dos participantes não pode ultrapassar o total da faixa.</p>
          <p style="margin:24px 0;">
            <a href="{link}" style="background:#E60012;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;display:inline-block;">Abrir formulário</a>
          </p>
          <p style="color:#777;font-size:12px;word-break:break-all;">Ou copie este link: {link}</p>
        </td></tr>
      </table>
    </div>
    """


def ar_notification_html(projeto: str, link: str) -> str:
    return f"""
    <div style="font-family:Arial,sans-serif;background:#0b0b0c;padding:24px;color:#fff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#141417;border-radius:12px;border:1px solid #222;">
        <tr><td style="padding:28px;">
          <span style="color:#E60012;font-weight:bold;letter-spacing:2px;font-size:12px;">SONY MUSIC · SMERA</span>
          <h2 style="margin:12px 0 8px;color:#fff;">Escritório devolveu o preenchimento</h2>
          <p style="color:#b3b3b3;line-height:1.6;">O escritório enviou os dados do projeto
          <strong style="color:#fff;">{projeto}</strong>. Acesse o SMERA para validar o preenchimento.</p>
          <p style="margin:20px 0;"><a href="{link}" style="background:#E60012;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-weight:bold;display:inline-block;">Abrir processo</a></p>
        </td></tr>
      </table>
    </div>
    """


def exterior_html(projeto: str, titulo: str, vendor: dict, signed_link: str = "", expires_days: int = 7) -> str:
    v = vendor or {}
    faixa_line = f'<p style="margin:2px 0;color:#b3b3b3;">Faixa: <strong style="color:#fff;">{titulo}</strong></p>' if titulo else ""
    link_block = (
        f'<p style="margin:20px 0;"><a href="{signed_link}" style="background:#E60012;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-weight:bold;display:inline-block;">Abrir documento assinado</a></p>'
        f'<p style="color:#777;font-size:12px;">Link válido por {expires_days} dias.</p>'
        if signed_link else '<p style="color:#f59e0b;font-size:13px;">O documento assinado segue em anexo (envie manualmente se necessário).</p>'
    )
    return f"""
    <div style="font-family:Arial,sans-serif;background:#0b0b0c;padding:24px;color:#fff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#141417;border-radius:12px;border:1px solid #222;">
        <tr><td style="padding:28px;">
          <span style="color:#E60012;font-weight:bold;letter-spacing:2px;font-size:12px;">SONY MUSIC · SMERA</span>
          <h2 style="margin:12px 0 8px;color:#fff;">Callback — Confirmação de dados bancários (Envio ao Exterior)</h2>
          <p style="margin:2px 0;color:#b3b3b3;">Projeto: <strong style="color:#fff;">{projeto}</strong></p>
          {faixa_line}
          <div style="margin:16px 0;padding:14px;background:#0a0a0a;border:1px solid #222;border-radius:8px;">
            <p style="margin:0 0 6px;color:#777;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Fornecedor</p>
            <p style="margin:2px 0;color:#fff;"><strong>{v.get('nomeFornecedor','—')}</strong> · {v.get('cpfCnpj','—')}</p>
            <p style="margin:2px 0;color:#b3b3b3;">Banco: {v.get('banco','—')} · Ag: {v.get('agencia','—')} · Cc: {v.get('conta','—')}</p>
          </div>
          {link_block}
        </td></tr>
      </table>
    </div>
    """
