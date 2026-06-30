# SMERA - Sony Music Licensing Platform

## Visão Geral
Sistema de gerenciamento de licenciamento musical para Sony Music. Full-stack: React + FastAPI + MongoDB. Interface 100% em Português.

## Status Atual (Dez/2025 - atualizado)
- **Frontend**: ✅ Completo, conectado ao backend (dados reais, sem mocks)
- **Backend**: ✅ FastAPI + MongoDB, CRUD completo + JWT auth
- **Database**: ✅ MongoDB, seed idempotente no startup

---

## Design System "Sony Obsidian / Luxury Swiss" (Jun/2026)
- Tema escuro premium, cores Sony (vermelho #E60012, preto, branco)
- **Tipografia**: Outfit (títulos), Plus Jakarta Sans (corpo) — JetBrains Mono (dados)
- Cards rounded-xl obsidian, badges de status (emerald/blue/amber via !important), sidebar com indicador ativo suave (barra vermelha)
- Animações Framer Motion, glass-morphism, grão/noise
- Guidelines em `/app/design_guidelines.json`

---

## Autenticação (JWT)
- Login email/senha, bcrypt + JWT (token 12h, header Bearer, localStorage `smera_token`)
- Rotas /api protegidas por `get_current_user` (exceto `/api/` e `/api/auth/login`)
- Seed idempotente de admin (nome derivado do email) + 4 usuários demo
- **Admin**: pablo.duarte@sonymusic.com / 123456 (ver `/app/memory/test_credentials.md`)

## Backend — Arquitetura
```
/app/backend/
├── server.py        # app + monta routers (/api)
├── db.py            # conexão Mongo
├── auth.py          # bcrypt, JWT, get_current_user
├── models.py        # Pydantic (uuid id, exclui _id)
├── crud.py          # make_crud_router (factory CRUD genérico)
├── routes.py        # auth_router, dashboard_router, users_router
├── seed_data.py     # 22 contratos/tipo (jun/jul 2026) + cadastros + usuários
└── tests/backend_test.py  # 38 testes pytest
```

### Endpoints
- `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/dashboard/stats`
- CRUD genérico: `/api/licenses-in`, `/api/licenses-out`, `/api/sony-sony`, `/api/rlm-rights`, `/api/artists`, `/api/labels`, `/api/companies`
- Users (hash de senha, email único 409, anti auto-exclusão): `/api/users`

## Frontend — Páginas
1. **Login** — branding Sony
2. **Dashboard** — KPIs ao vivo, 3 donut charts, atividade recente (sem painel de Territórios). Botão de calendário = atalho para a Timeline.
2b. **Timeline** (`/timeline`) — visão **unificada** dos 3 tipos (License In/Out/Sony) num único calendário, abrindo sempre no **mês atual**; quadrados coloridos por status, pontos por contrato, tooltip Artista—Faixa e painel do dia.
3. **License In / Out / Sony/Sony / D2C** — CRUD + **Timeline/Calendário** + paginação + exportação CSV. **D2C** = produtos físicos (Direct-to-Consumer): Vinil/CD/Box Set/Camiseta/etc., com cliente, formato e quantidade. Seed com contagens variadas (80/60/50/30).
4. **RLM** (menu com submenus **RLM Fase 1** e **RLM Fase 2**) — **Fase 1**: workflow de 8 etapas (stepper, validação CPF/CNPJ, avanço/devolução, histórico). Envio ao escritório (link único + e-mail Resend/Copiar link) + formulário público `/form/escritorio/:token`. Alocação de royalties (soma participantes ≤ total). **Sub-fase C**: geração do documento de Callback ("Confirmação de dados bancários") preenchido + impressão PDF + upload do assinado/link SharePoint na etapa de Envio ao Exterior. Pendências (`/rlm/pendencias`). **Fase 2** (`/rlm`): Cadastro de Royalties/Direitos.
5. **Cadastros** — abas Artistas / Gravadoras / Empresas (CRUD)
6. **Acesso** — gestão de usuários (CRUD, perfis)

### Componentes reutilizáveis
- `useCrud` (hook), `EntityFormDialog`, `ConfirmDeleteDialog`, `ContractCalendar`, `ViewToggle`, `AuthContext`, `lib/api.js`

---

## O que foi implementado (Jun/2026)
- [x] Backend FastAPI + MongoDB com CRUD completo (7 entidades + usuários)
- [x] Autenticação JWT (bcrypt, Bearer token, rotas protegidas)
- [x] Frontend conectado ao backend (mocks removidos)
- [x] Redesign visual completo (novas fontes Outfit/Plus Jakarta Sans, paleta obsidian refinada)
- [x] Novo admin pablo.duarte@sonymusic.com / 123456
- [x] Seed de 22 contratos por tipo, datas futuras (junho/julho 2026)
- [x] Visualização Timeline/Calendário por tipo de contrato (License In/Out/Sony)
- [x] Testes: 38/38 backend pytest, frontend 100%

---

## Backlog / Próximos Passos
### P1
- [ ] Persistir fluxo de aprovação (License Out): hoje o envio é apenas toast (não gravado)
- [ ] Modelar Territórios (dashboard usa dados estáticos)
- [ ] RLMDetail: abas além do cabeçalho são preview estático (sistema RLM externo)

### P2
- [ ] Paginação/ordenação server-side nas tabelas
- [ ] Exportação (CSV/Excel) e filtros avançados
- [ ] Datas em ISO no backend (recentActivity ordena por string dd/mm/yyyy)
- [ ] Endurecer CORS (allow_origins explícito) em produção

### P3
- [ ] Notificações em tempo real / histórico de alterações

---

## Notas Técnicas
- Token via Authorization Bearer (localStorage) — escolhido pela robustez no ingress.
- Badges de status forçam cor via `!important` (sobre o variant default vermelho do shadcn).
- Seed só insere quando a coleção está vazia (preserva dados criados pelo usuário).
