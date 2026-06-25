# SMERA - Credenciais de Teste

## Admin (principal)
- **Email:** pablo.duarte@sonymusic.com
- **Senha:** 123456
- **Perfil:** Administrador

## Admin legado (ainda válido)
- pablo.duartel@sonymusic.com / sony2025

## Usuários demo (senha padrão sony2025)
- maria.silva@sonymusic.com (Gestor)
- joao.santos@sonymusic.com (Gestor)
- ana.costa@sonymusic.com (Usuário)
- carlos.oliveira@sonymusic.com (Usuário, **Inativo** — login bloqueado 403)

## Endpoints de Auth
- POST /api/auth/login  -> { token, user }
- GET  /api/auth/me     (Bearer token)

## Observações
- Token JWT enviado via header `Authorization: Bearer <token>` (localStorage `smera_token`).
- Todas as rotas /api (exceto /api/ e /api/auth/login) exigem autenticação.
- Seed: 22 contratos em License In / Out / Sony-Sony com datas futuras (jun/jul 2026).
