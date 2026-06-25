# SMERA - Credenciais de Teste

## Admin
- **Email:** pablo.duartel@sonymusic.com
- **Senha:** sony2025
- **Perfil:** Administrador

## Usuários demo (mesma senha padrão)
- maria.silva@sonymusic.com / sony2025 (Gestor)
- joao.santos@sonymusic.com / sony2025 (Gestor)
- ana.costa@sonymusic.com / sony2025 (Usuário)
- carlos.oliveira@sonymusic.com / sony2025 (Usuário, **Inativo** — login bloqueado)

## Endpoints de Auth
- POST /api/auth/login  -> { token, user }
- GET  /api/auth/me     (Bearer token)

## Observações
- Token JWT enviado via header `Authorization: Bearer <token>` (armazenado em localStorage `smera_token`).
- Todas as rotas /api (exceto /api/ e /api/auth/login) exigem autenticação.
