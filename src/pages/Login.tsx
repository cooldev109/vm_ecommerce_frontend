import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {
      toast({
        title: t('loginSuccessful') || 'Login successful',
        description: t('welcomeBack') || 'Welcome back!',
      });

      // Redirect admin users to admin dashboard, regular users to home page
      if (result.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      toast({
        title: t('loginFailed') || 'Login failed',
        description: result.error || 'Invalid credentials',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center section-padding bg-gradient-warm">
      <div className="w-full max-w-md">
        <div className="card-luxury p-8 animate-fade-in">
          <div className="text-center mb-8">
            <img src={logo} alt="V&M" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              {t('login')}
            </h1>
            <p className="text-luxury">
              {t('welcomeBack')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-luxury">{t('rememberMe')}</span>
              </label>
              <a href="#" className="text-sm text-accent hover:underline">
                {t('forgotPassword')}
              </a>
            </div>

            <Button
              type="submit"
              className="btn-luxury w-full"
              disabled={loading}
            >
              {loading ? t('loggingIn') : t('login')}
            </Button>

            <div className="text-center">
              <p className="text-sm text-luxury">
                {t('noAccount')}{' '}
                <Link to="/register" className="text-accent hover:underline font-medium">
                  {t('register')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
