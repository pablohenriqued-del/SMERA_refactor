# Graph Report - .  (2026-07-13)

## Corpus Check
- Corpus is ~49,470 words - fits in a single context window. You may not need a graph.

## Summary
- 800 nodes · 1443 edges · 65 communities (49 shown, 16 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.79)
- Token cost: 73,623 input · 0 output

## Community Hubs (Navigation)
- Entity Form & Contract UI
- App Shell & Layout
- License Callback & Participants UI
- Frontend Dependencies (package.json)
- Email & Royalty/Process Services
- Pydantic Data Models
- Backend Integration Tests
- Build/Lint Tooling Config
- SMERA Product Requirements
- shadcn/ui Components Config
- Babel Metadata Plugin
- Menubar UI Component
- Platform & Backend Dependencies
- JWT Auth & Download Tokens
- Database Seed Data
- Generic CRUD Router Factory
- Toast Notification Hook
- Rebranding Session Summary
- Carousel UI Component
- Alert Dialog UI Component
- Command Palette UI Component
- Context Menu UI Component
- Signed Document Storage Migration
- Form Field UI Component
- Dashboard & User Routes
- Dev Server Setup Script
- Breadcrumb UI Component
- Drawer UI Component
- Navigation Menu UI Component
- Pagination UI Component
- Sheet UI Component
- Toast UI Component
- Webpack Health Plugin
- JS Config Path Aliases
- Input OTP UI Component
- Health Check Endpoints
- Alert UI Component
- Craco Config
- Accordion UI Component
- Avatar UI Component
- Toggle Group UI Component
- Radio Group UI Component
- Scroll Area UI Component
- Toggle UI Component
- Recharts Dependency
- Checkbox UI Component
- Hover Card UI Component
- Popover UI Component
- Progress UI Component
- Separator UI Component
- Slider UI Component
- Switch UI Component
- Tooltip UI Component
- React Entry Point
- Root README Placeholder

## God Nodes (most connected - your core abstractions)
1. `SMERA Product Requirements Document` - 34 edges
2. `Button` - 19 edges
3. `useCrud()` - 18 edges
4. `Card` - 16 edges
5. `CardContent` - 16 edges
6. `Input` - 16 edges
7. `Badge()` - 15 edges
8. `apiErrorMessage()` - 15 edges
9. `_now_iso()` - 11 edges
10. `useAuth()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Upcoming Backend Integration Task` --conceptually_related_to--> `SMERA - Sony Music Licensing Platform`  [INFERRED]
  .emergent/summary.txt → memory/PRD.md
- `Resend Email API Dependency` --conceptually_related_to--> `SMERA - Sony Music Licensing Platform`  [AMBIGUOUS]
  backend/requirements.txt → memory/PRD.md
- `Emergent Build Environment Config` --conceptually_related_to--> `SMERA - Sony Music Licensing Platform`  [INFERRED]
  .emergent/emergent.yml → memory/PRD.md
- `SMERA Product Requirements Document` --references--> `Emergent.sh Platform`  [EXTRACTED]
  memory/PRD.md → .emergent/emergent.yml
- `recharts Charting Library` --conceptually_related_to--> `Dashboard Page (KPIs, donut charts, recent activity)`  [INFERRED]
  .emergent/summary.txt → memory/PRD.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Backend Architecture Files (SMERA API layer)** — backend_server, backend_db, backend_auth, backend_models, backend_crud, backend_routes, backend_seed_data [EXTRACTED 1.00]
- **Reusable CRUD Component Pattern Across License/Cadastros Pages** — memory_prd_usecrud, memory_prd_entityformdialog, memory_prd_confirmdeletedialog, memory_prd_license_in_page, memory_prd_license_out_page, memory_prd_sony_sony_page, memory_prd_d2c_page, memory_prd_cadastros_page [INFERRED 0.85]
- **Sony Music Rebranding Session Deliverables** — _emergent_summary_recharts_missing_dependency, _emergent_summary_license_out_approval_flow, _emergent_summary_rlm_detail_page [INFERRED 0.75]

## Communities (65 total, 16 thin omitted)

### Community 0 - "Entity Form & Contract UI"
Cohesion: 0.06
Nodes (90): ConfirmDeleteDialog(), ContractCalendar(), dayKey(), dotFor(), getStatusBadgeClass(), MONTHS_PT, parseDate(), STATUS_STYLE (+82 more)

### Community 1 - "App Shell & Layout"
Cohesion: 0.05
Nodes (54): ProtectedRoute(), getInitials(), Layout(), SonyLogo(), CardHeader, CardTitle, DropdownMenuCheckboxItem, DropdownMenuContent (+46 more)

### Community 2 - "License Callback & Participants UI"
Cohesion: 0.08
Nodes (36): sonner, BankSelect(), callbackDocHtml(), CallbackDocPreview(), field(), printCallbackDoc(), isAllocationValid(), ParticipantesEditor() (+28 more)

### Community 3 - "Frontend Dependencies (package.json)"
Cohesion: 0.04
Nodes (50): dependencies, axios, class-variance-authority, clsx, cmdk, cra-template, date-fns, embla-carousel-react (+42 more)

### Community 4 - "Email & Royalty/Process Services"
Cohesion: 0.08
Nodes (37): ar_notification_html(), exterior_html(), _from_address(), invite_html(), is_configured(), Send an email via Resend. Returns {sent, reason?}. Never raises (degrades gracef, send_email(), CorrectionRequest (+29 more)

### Community 5 - "Pydantic Data Models"
Cohesion: 0.09
Nodes (39): hash_password(), Artist, ArtistBase, ArtistCreate, Company, CompanyBase, CompanyCreate, Label (+31 more)

### Community 6 - "Backend Integration Tests"
Cohesion: 0.06
Nodes (15): _date_in_jun_or_jul_2026(), SMERA backend integration tests. Covers: auth (login, me, 401/403), dashboard st, Verifies the new admin pablo.duarte@sonymusic.com / 123456 works., Accepts dd/mm/yyyy or yyyy-mm-dd or ISO; returns True if month is 06 or 07 / yea, Each of License In / Out / Sony-Sony must have 22 seeded contracts with dates in, For License In specifically: data must span both June and July 2026 (calendar ne, TestAuth, TestAuthRequired (+7 more)

### Community 7 - "Build/Lint Tooling Config"
Cohesion: 0.08
Nodes (24): browserslist, development, production, devDependencies, autoprefixer, @babel/plugin-proposal-private-property-in-object, @craco/craco, eslint (+16 more)

### Community 8 - "SMERA Product Requirements"
Cohesion: 0.10
Nodes (20): design_guidelines.json (design guidelines), Acesso Page (User Management), AuthContext, Cadastros Page (Artistas/Gravadoras/Empresas CRUD), ConfirmDeleteDialog Component, ContractCalendar Component, D2C Page (physical products), SMERA Product Requirements Document (+12 more)

### Community 9 - "shadcn/ui Components Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 10 - "Babel Metadata Plugin"
Cohesion: 0.15
Nodes (14): BINDING_DYNAMIC_CACHE, DYNAMIC_COMP_CACHE, EXTENSIONS, FILE_AST_CACHE, fileExportHasPortals(), fs, parseFileAst(), path (+6 more)

### Community 11 - "Menubar UI Component"
Cohesion: 0.12
Nodes (10): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarSubContent (+2 more)

### Community 12 - "Platform & Backend Dependencies"
Cohesion: 0.17
Nodes (15): Backend Python Dependencies (requirements.txt), FastAPI Framework Dependency, MongoDB Driver Dependencies (pymongo, motor), pyjwt Dependency, python-jose Dependency, Resend Email API Dependency, Emergent Build Environment Config, Emergent.sh Platform (+7 more)

### Community 13 - "JWT Auth & Download Tokens"
Cohesion: 0.22
Nodes (12): create_access_token(), create_download_token(), decode_download_token(), get_current_user(), _get_secret(), Returns the resource_id if the download token is valid, else raises jwt errors., verify_password(), LoginRequest (+4 more)

### Community 14 - "Database Seed Data"
Cohesion: 0.29
Nodes (11): _build_licenses_d2c(), _build_licenses_in(), _build_licenses_out(), _build_sony_sony(), _future_date(), _id(), Spread dates across June + July 2026 (stride to cover both months), deterministi, Idempotent admin + demo user seeding with hashed passwords. (+3 more)

### Community 15 - "Generic CRUD Router Factory"
Cohesion: 0.24
Nodes (7): APIRouter, make_crud_router(), BaseModel, Generic CRUD router for a MongoDB collection using uuid string ids., lifespan(), FastAPI, Generic CRUD Router Factory Pattern

### Community 16 - "Toast Notification Hook"
Cohesion: 0.31
Nodes (10): actionTypes, addToRemoveQueue(), dispatch(), genId(), listeners, memoryState, reducer(), toast() (+2 more)

### Community 17 - "Rebranding Session Summary"
Cohesion: 0.22
Nodes (10): Upcoming Backend Integration Task, Statistics Header / Pie Chart Component Duplication, License Out Two-Step Approval Flow (Diretoria + Equipe do Artista), recharts Charting Library, Missing recharts Dependency Issue (P0), RLM Detail Page (tabbed interface), Session Summary — Sony Music Rebranding, Backlog — Persist License Out Approval Flow (+2 more)

### Community 18 - "Carousel UI Component"
Cohesion: 0.20
Nodes (9): react, Carousel, CarouselContent, CarouselContext, CarouselItem, CarouselNext, CarouselPrevious, useCarousel() (+1 more)

### Community 19 - "Alert Dialog UI Component"
Cohesion: 0.36
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 20 - "Command Palette UI Component"
Cohesion: 0.20
Nodes (7): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator

### Community 21 - "Context Menu UI Component"
Cohesion: 0.20
Nodes (8): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuSubContent, ContextMenuSubTrigger

### Community 22 - "Signed Document Storage Migration"
Cohesion: 0.28
Nodes (5): One-off migration: move any base64 signedDocFile (dataUrl) to object storage., get_object(), init_storage(), put_object(), Call once; returns a session-scoped reusable storage key.

### Community 23 - "Form Field UI Component"
Cohesion: 0.22
Nodes (7): FormControl, FormDescription, FormFieldContext, FormItem, FormItemContext, FormLabel, FormMessage

### Community 24 - "Dashboard & User Routes"
Cohesion: 0.32
Nodes (4): dashboard_stats(), _parse_ddmmyyyy(), Parse 'dd/mm/yyyy' to a sortable (yyyy, mm, dd) tuple; unknown dates sort last., _status_breakdown()

### Community 25 - "Dev Server Setup Script"
Cohesion: 0.25
Nodes (5): { execSync }, express, fs, path, SUP_PASS

### Community 26 - "Breadcrumb UI Component"
Cohesion: 0.25
Nodes (5): Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage

### Community 27 - "Drawer UI Component"
Cohesion: 0.25
Nodes (4): DrawerContent, DrawerDescription, DrawerOverlay, DrawerTitle

### Community 28 - "Navigation Menu UI Component"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 30 - "Sheet UI Component"
Cohesion: 0.25
Nodes (5): SheetContent, SheetDescription, SheetOverlay, SheetTitle, sheetVariants

### Community 31 - "Toast UI Component"
Cohesion: 0.25
Nodes (7): Toast, ToastAction, ToastClose, ToastDescription, ToastTitle, toastVariants, ToastViewport

### Community 33 - "JS Config Path Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, include, @/*

### Community 34 - "Input OTP UI Component"
Cohesion: 0.33
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 35 - "Health Check Endpoints"
Cohesion: 0.47
Nodes (5): formatBytes(), formatDuration(), os, SERVER_START_TIME, setupHealthEndpoints()

### Community 36 - "Alert UI Component"
Cohesion: 0.40
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 37 - "Craco Config"
Cohesion: 0.50
Nodes (3): config, path, webpackConfig

### Community 38 - "Accordion UI Component"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 39 - "Avatar UI Component"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 40 - "Toggle Group UI Component"
Cohesion: 0.50
Nodes (3): ToggleGroup, ToggleGroupContext, ToggleGroupItem

## Ambiguous Edges - Review These
- `Resend Email API Dependency` → `SMERA - Sony Music Licensing Platform`  [AMBIGUOUS]
  backend/requirements.txt · relation: conceptually_related_to

## Knowledge Gaps
- **307 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+302 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Resend Email API Dependency` and `SMERA - Sony Music Licensing Platform`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `SMERA Product Requirements Document` connect `SMERA Product Requirements` to `Pydantic Data Models`, `Backend Integration Tests`, `Platform & Backend Dependencies`, `JWT Auth & Download Tokens`, `Database Seed Data`, `Generic CRUD Router Factory`, `Rebranding Session Summary`, `Dashboard & User Routes`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Frontend Dependencies (package.json)` to `License Callback & Participants UI`, `Input OTP UI Component`, `Carousel UI Component`, `Build/Lint Tooling Config`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `react` connect `Carousel UI Component` to `Toast Notification Hook`, `App Shell & Layout`, `Frontend Dependencies (package.json)`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **What connects `Returns the resource_id if the download token is valid, else raises jwt errors.`, `Generic CRUD router for a MongoDB collection using uuid string ids.`, `Send an email via Resend. Returns {sent, reason?}. Never raises (degrades gracef` to the rest of the system?**
  _329 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Entity Form & Contract UI` be split into smaller, more focused modules?**
  _Cohesion score 0.05501930501930502 - nodes in this community are weakly interconnected._
- **Should `App Shell & Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.052982456140350874 - nodes in this community are weakly interconnected._