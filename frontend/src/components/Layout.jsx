import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
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
  ChevronDown
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
import { Avatar, AvatarFallback } from './ui/avatar';

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'License In', path: '/license-in', icon: FileInput },
    { name: 'License Out', path: '/license-out', icon: FileOutput },
    { name: 'Cadastros', path: '/cadastros', icon: FolderPlus },
    { name: 'RLM', path: '/rlm', icon: Shield },
    { name: 'Acesso', path: '/acesso', icon: Users },
    { name: 'Sony/Sony', path: '/sony-sony', icon: Music },
  ];

  return (
    <div className="min-h-screen bg-black" data-testid="main-layout">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-gray-800 z-50" data-testid="header">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              data-testid="sidebar-toggle-btn"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-3">
              {/* Sony Music Logo */}
              <div className="flex items-center gap-3">
                <div className="h-10 flex items-center">
                  <svg viewBox="0 0 80 80" className="h-10 w-auto" xmlns="http://www.w3.org/2000/svg">
                    {/* Sony Music Dot Pattern Logo */}
                    <g fill="#E2001A">
                      {/* Top 3 dots */}
                      <circle cx="28" cy="12" r="2.5"/>
                      <circle cx="40" cy="12" r="2.5"/>
                      <circle cx="52" cy="12" r="2.5"/>
                      
                      {/* Second row - 7 dots */}
                      <circle cx="16" cy="20" r="2.5"/>
                      <circle cx="24" cy="20" r="2.5"/>
                      <circle cx="32" cy="20" r="2.5"/>
                      <circle cx="40" cy="20" r="2.5"/>
                      <circle cx="48" cy="20" r="2.5"/>
                      <circle cx="56" cy="20" r="2.5"/>
                      <circle cx="64" cy="20" r="2.5"/>
                      
                      {/* Third row - 9 dots */}
                      <circle cx="12" cy="28" r="2.5"/>
                      <circle cx="20" cy="28" r="2.5"/>
                      <circle cx="28" cy="28" r="2.5"/>
                      <circle cx="36" cy="28" r="2.5"/>
                      <circle cx="44" cy="28" r="2.5"/>
                      <circle cx="52" cy="28" r="2.5"/>
                      <circle cx="60" cy="28" r="2.5"/>
                      <circle cx="68" cy="28" r="2.5"/>
                      
                      {/* Fourth row - 9 dots */}
                      <circle cx="12" cy="36" r="2.5"/>
                      <circle cx="20" cy="36" r="2.5"/>
                      <circle cx="28" cy="36" r="2.5"/>
                      <circle cx="36" cy="36" r="2.5"/>
                      <circle cx="44" cy="36" r="2.5"/>
                      <circle cx="52" cy="36" r="2.5"/>
                      <circle cx="60" cy="36" r="2.5"/>
                      <circle cx="68" cy="36" r="2.5"/>
                      
                      {/* Fifth row - 11 dots */}
                      <circle cx="8" cy="44" r="2.5"/>
                      <circle cx="16" cy="44" r="2.5"/>
                      <circle cx="24" cy="44" r="2.5"/>
                      <circle cx="32" cy="44" r="2.5"/>
                      <circle cx="40" cy="44" r="2.5"/>
                      <circle cx="48" cy="44" r="2.5"/>
                      <circle cx="56" cy="44" r="2.5"/>
                      <circle cx="64" cy="44" r="2.5"/>
                      <circle cx="72" cy="44" r="2.5"/>
                      
                      {/* Sixth row - 11 dots */}
                      <circle cx="8" cy="52" r="2.5"/>
                      <circle cx="16" cy="52" r="2.5"/>
                      <circle cx="24" cy="52" r="2.5"/>
                      <circle cx="32" cy="52" r="2.5"/>
                      <circle cx="40" cy="52" r="2.5"/>
                      <circle cx="48" cy="52" r="2.5"/>
                      <circle cx="56" cy="52" r="2.5"/>
                      <circle cx="64" cy="52" r="2.5"/>
                      <circle cx="72" cy="52" r="2.5"/>
                      
                      {/* Seventh row - 9 dots */}
                      <circle cx="12" cy="60" r="2.5"/>
                      <circle cx="20" cy="60" r="2.5"/>
                      <circle cx="28" cy="60" r="2.5"/>
                      <circle cx="36" cy="60" r="2.5"/>
                      <circle cx="44" cy="60" r="2.5"/>
                      <circle cx="52" cy="60" r="2.5"/>
                      <circle cx="60" cy="60" r="2.5"/>
                      <circle cx="68" cy="60" r="2.5"/>
                      
                      {/* Eighth row - 7 dots */}
                      <circle cx="16" cy="68" r="2.5"/>
                      <circle cx="24" cy="68" r="2.5"/>
                      <circle cx="32" cy="68" r="2.5"/>
                      <circle cx="40" cy="68" r="2.5"/>
                      <circle cx="48" cy="68" r="2.5"/>
                      <circle cx="56" cy="68" r="2.5"/>
                      <circle cx="64" cy="68" r="2.5"/>
                      
                      {/* Bottom 3 dots */}
                      <circle cx="28" cy="76" r="2.5"/>
                      <circle cx="40" cy="76" r="2.5"/>
                      <circle cx="52" cy="76" r="2.5"/>
                    </g>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sony Music</span>
                  <h1 className="text-xl font-bold text-white -mt-1" data-testid="app-title">SMERA</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar..."
                className="pl-10 w-64"
                data-testid="search-input"
              />
            </div>

            <Button variant="ghost" size="icon" data-testid="notifications-btn">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2" data-testid="user-menu-trigger">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-sony-red text-white text-sm font-semibold">
                      PD
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">Olá, Pablo Duartel</p>
                    <p className="text-xs text-gray-500">Sony Music Entertainment</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-testid="sidebar"
      >
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-sony-red text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 pt-16 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
        data-testid="main-content"
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;