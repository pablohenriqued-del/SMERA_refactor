# SMERA - Sony Music Licensing Platform

## Visão Geral
Sistema de gerenciamento de licenciamento musical para Sony Music, desenvolvido com design "Sony Obsidian" premium.

## Status Atual
**Frontend**: ✅ Completo (MOCKED - dados estáticos)
**Backend**: ⏳ Não implementado
**Database**: ⏳ Não implementado

---

## O que foi implementado

### Design System "Sony Obsidian" (Janeiro 2026)
- Tema escuro premium com cores Sony (vermelho #E60012, preto, branco)
- Tipografia: Barlow Condensed (títulos), Manrope (corpo)
- Componentes: cards obsidian, badges coloridos, tabelas tech
- Animações com Framer Motion em todas as páginas
- Layout responsivo com sidebar colapsável

### Páginas Implementadas
1. **Dashboard** - Bento grid, gráficos pie chart (recharts), modais interativos
2. **License In** - Lista com estatísticas, filtros, paginação
3. **License Out** - Lista com fluxo de aprovação (2 etapas)
4. **Sony/Sony** - Colaborações entre artistas Sony
5. **RLM** - Gestão de direitos e licenciamento
6. **RLMDetail** - Interface tabbed para detalhes de contrato
7. **Cadastros** - Artistas, gravadoras, empresas
8. **Acesso** - Controle de usuários e permissões

### Funcionalidades
- Dashboard interativo com elementos clicáveis
- Gráficos de status (License In, License Out, Sony/Sony)
- Fluxo de aprovação em 2 etapas (Diretoria + Equipe do Artista)
- Busca e filtros em todas as listas
- Navegação com animações suaves

---

## Stack Tecnológica
- **Frontend**: React 18, TailwindCSS, shadcn/ui, Framer Motion, Recharts
- **Backend**: FastAPI (Python)
- **Database**: MongoDB

---

## Próximos Passos (Backlog)

### P0 - Alta Prioridade
- [ ] Integração com Backend (substituir dados mockados)
- [ ] Criar modelos MongoDB para todas as entidades
- [ ] Implementar endpoints CRUD no FastAPI

### P1 - Média Prioridade
- [ ] Sistema de autenticação
- [ ] Upload de documentos
- [ ] Notificações em tempo real

### P2 - Baixa Prioridade
- [ ] Relatórios e exportação
- [ ] Histórico de alterações
- [ ] Integração com sistemas externos

---

## Arquivos de Referência
- `/app/frontend/src/components/Layout.jsx` - Layout principal
- `/app/frontend/src/pages/Dashboard.jsx` - Dashboard
- `/app/frontend/src/index.css` - Design system CSS
- `/app/frontend/tailwind.config.js` - Configuração Tailwind

---

## Notas
- Todos os dados são **MOCKED** (hardcoded no frontend)
- Interface em **Português**
- Design responsivo mobile-first
