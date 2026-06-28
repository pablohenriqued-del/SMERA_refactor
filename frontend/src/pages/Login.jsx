import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, LogIn, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../lib/api';
import { SonyLogo } from '../components/SonyLogo';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black noise flex items-center justify-center p-4 relative overflow-hidden" data-testid="login-page">
      <div className="fixed top-0 left-0 right-0 h-[400px] sony-glow-top pointer-events-none z-0" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <SonyLogo svgClass="h-14 w-auto" titleClass="text-3xl" align="items-center" />
          <p className="body-sm text-zinc-500 mt-3">Plataforma de Licenciamento Musical</p>
        </div>

        <div className="card-obsidian p-8">
          <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
            <div>
              <Label className="overline block mb-2">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  type="email"
                  required
                  placeholder="seu.email@sonymusic.com"
                  className="input-obsidian pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="login-email-input"
                />
              </div>
            </div>
            <div>
              <Label className="overline block mb-2">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-obsidian pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="login-password-input"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-sm px-3 py-2" data-testid="login-error">
                {error}
              </p>
            )}

            <Button type="submit" className="btn-sony w-full" disabled={loading} data-testid="login-submit-btn">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LogIn className="h-4 w-4 mr-2" />}
              Entrar
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-zinc-600 mt-6">© 2026 Sony Music Entertainment</p>
      </motion.div>
    </div>
  );
};

export default Login;
