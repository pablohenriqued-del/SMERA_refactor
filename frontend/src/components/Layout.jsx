import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileInput, 
  FileOutput, 
  FolderPlus, 
  Shield, 
  Users, 
  Music,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const getInitials = (nome) =>
  (nome || 'U').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCount, setActiveCount] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setActiveCount(data.stats.licencasAtivas))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'License In', path: '/license-in', icon: FileInput },
    { name: 'License Out', path: '/license-out', icon: FileOutput },
    { name: 'Sony/Sony', path: '/sony-sony', icon: Music },
    { name: 'Cadastros', path: '/cadastros', icon: FolderPlus },
    { name: 'RLM', path: '/rlm', icon: Shield },
    { name: 'Acesso', path: '/acesso', icon: Users },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -280, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-black noise" data-testid="main-layout">
      {/* Sony Glow Top */}
      <div className="fixed top-0 left-0 right-0 h-[300px] sony-glow-top pointer-events-none z-0" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 glass-dark z-50" data-testid="header">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-zinc-400 hover:text-white hover:bg-white/5 hidden lg:flex"
              data-testid="sidebar-toggle-btn"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-zinc-400 hover:text-white hover:bg-white/5 lg:hidden"
              data-testid="mobile-menu-btn"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="h-10 flex items-center">
                <svg viewBox="0 0 80 80" className="h-10 w-auto transition-transform group-hover:scale-105" xmlns="http://www.w3.org/2000/svg">
                  <g fill="#E60012" className="transition-all group-hover:drop-shadow-[0_0_8px_rgba(230,0,18,0.6)]">
                    <circle cx="28" cy="12" r="2.5"/>
                    <circle cx="40" cy="12" r="2.5"/>
                    <circle cx="52" cy="12" r="2.5"/>
                    <circle cx="16" cy="20" r="2.5"/>
                    <circle cx="24" cy="20" r="2.5"/>
                    <circle cx="32" cy="20" r="2.5"/>
                    <circle cx="40" cy="20" r="2.5"/>
                    <circle cx="48" cy="20" r="2.5"/>
                    <circle cx="56" cy="20" r="2.5"/>
                    <circle cx="64" cy="20" r="2.5"/>
                    <circle cx="12" cy="28" r="2.5"/>
                    <circle cx="20" cy="28" r="2.5"/>
                    <circle cx="28" cy="28" r="2.5"/>
                    <circle cx="36" cy="28" r="2.5"/>
                    <circle cx="44" cy="28" r="2.5"/>
                    <circle cx="52" cy="28" r="2.5"/>
                    <circle cx="60" cy="28" r="2.5"/>
                    <circle cx="68" cy="28" r="2.5"/>
                    <circle cx="12" cy="36" r="2.5"/>
                    <circle cx="20" cy="36" r="2.5"/>
                    <circle cx="28" cy="36" r="2.5"/>
                    <circle cx="36" cy="36" r="2.5"/>
                    <circle cx="44" cy="36" r="2.5"/>
                    <circle cx="52" cy="36" r="2.5"/>
                    <circle cx="60" cy="36" r="2.5"/>
                    <circle cx="68" cy="36" r="2.5"/>
                    <circle cx="8" cy="44" r="2.5"/>
                    <circle cx="16" cy="44" r="2.5"/>
                    <circle cx="24" cy="44" r="2.5"/>
                    <circle cx="32" cy="44" r="2.5"/>
                    <circle cx="40" cy="44" r="2.5"/>
                    <circle cx="48" cy="44" r="2.5"/>
                    <circle cx="56" cy="44" r="2.5"/>
                    <circle cx="64" cy="44" r="2.5"/>
                    <circle cx="72" cy="44" r="2.5"/>
                    <circle cx="8" cy="52" r="2.5"/>
                    <circle cx="16" cy="52" r="2.5"/>
                    <circle cx="24" cy="52" r="2.5"/>
                    <circle cx="32" cy="52" r="2.5"/>
                    <circle cx="40" cy="52" r="2.5"/>
                    <circle cx="48" cy="52" r="2.5"/>
                    <circle cx="56" cy="52" r="2.5"/>
                    <circle cx="64" cy="52" r="2.5"/>
                    <circle cx="72" cy="52" r="2.5"/>
                    <circle cx="12" cy="60" r="2.5"/>
                    <circle cx="20" cy="60" r="2.5"/>
                    <circle cx="28" cy="60" r="2.5"/>
                    <circle cx="36" cy="60" r="2.5"/>
                    <circle cx="44" cy="60" r="2.5"/>
                    <circle cx="52" cy="60" r="2.5"/>
                    <circle cx="60" cy="60" r="2.5"/>
                    <circle cx="68" cy="60" r="2.5"/>
                    <circle cx="16" cy="68" r="2.5"/>
                    <circle cx="24" cy="68" r="2.5"/>
                    <circle cx="32" cy="68" r="2.5"/>
                    <circle cx="40" cy="68" r="2.5"/>
                    <circle cx="48" cy="68" r="2.5"/>
                    <circle cx="56" cy="68" r="2.5"/>
                    <circle cx="64" cy="68" r="2.5"/>
                    <circle cx="28" cy="76" r="2.5"/>
                    <circle cx="40" cy="76" r="2.5"/>
                    <circle cx="52" cy="76" r="2.5"/>
                  </g>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="overline text-[10px]">Sony Music</span>
                <h1 className="font-heading font-bold text-xl text-white tracking-tight -mt-1" data-testid="app-title">
                  SMERA
                </h1>
              </div>
            </Link>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Buscar..."
                className="pl-10 w-64 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-sony-red focus:ring-sony-red/20 h-10"
                data-testid="search-input"
              />
            </div>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-zinc-400 hover:text-white hover:bg-white/5 relative"
              data-testid="notifications-btn"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sony-red rounded-full animate-pulse" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 px-2 hover:bg-white/5" 
                  data-testid="user-menu-trigger"
                >
                  <div className="w-9 h-9 rounded-sm bg-sony-red flex items-center justify-center">
                    <span className="font-heading font-bold text-sm text-white">{getInitials(user?.nome)}</span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-white" data-testid="header-user-name">{user?.nome || 'Usuário'}</p>
                    <p className="text-xs text-zinc-500">{user?.perfil || ''}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-500 hidden lg:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-sony-paper border-white/10">
                <DropdownMenuLabel className="text-zinc-400 font-heading uppercase text-xs tracking-wider">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-zinc-300 hover:text-white hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white">
                  <User className="h-4 w-4 mr-2" />
                  {user?.email || 'Perfil'}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer focus:bg-red-500/10 focus:text-red-300"
                  onClick={handleLogout}
                  data-testid="logout-btn"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || isMobileMenuOpen) && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed left-0 top-16 bottom-0 w-[280px] bg-[#050505] border-r border-white/5 z-40 
              ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}
            data-testid="sidebar"
          >
            <nav className="p-4 space-y-1">
              <p className="overline px-4 py-2 mb-2">Menu Principal</p>
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, '-').replace('/', '')}`}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group
                        ${isActive
                          ? 'bg-white/5 text-white'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-sony-red"
                        />
                      )}
                      <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-sony-red' : 'group-hover:text-sony-red'}`} />
                      <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
              <div className="card-obsidian p-4">
                <p className="overline mb-1">Licenças Ativas</p>
                <p className="font-heading font-bold text-2xl text-white" data-testid="sidebar-active-count">{activeCount ?? '—'}</p>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-sony-red rounded-full" />
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 pt-16 min-h-screen
          ${isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-0'}`}
        data-testid="main-content"
      >
        <div className="p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Layout;
