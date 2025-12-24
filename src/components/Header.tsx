import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logo from '@/assets/logo.png';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { items } = useCart();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('shop'), href: '/shop' },
    { name: 'Solo Audio', href: '/audio' },
    { name: 'Planes', href: '/subscriptions' },
    { name: t('contact'), href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="V&M" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium tracking-wide uppercase text-foreground/80 hover:text-foreground transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />

            {/* User Account Dropdown */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex flex-col items-center text-foreground/80 hover:text-foreground transition-colors duration-300 outline-none">
                  <User className="h-5 w-5" />
                  <span className="text-xs mt-1 font-medium">
                    {profile ? profile.firstName : t('account')}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>
                    {profile ? `${profile.firstName} ${profile.lastName}` : user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/account')}>
                    <User className="mr-2 h-4 w-4" />
                    {user?.role === 'ADMIN' ? 'Admin Dashboard' : t('myAccount')}
                  </DropdownMenuItem>
                  {user?.role !== 'ADMIN' && (
                    <DropdownMenuItem onClick={() => navigate('/account#orders')}>
                      {t('orderHistory')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="flex flex-col items-center text-foreground/80 hover:text-foreground transition-colors duration-300"
              >
                <User className="h-5 w-5" />
                <span className="text-xs mt-1 font-medium">{t('login')}</span>
              </Link>
            )}

            <Link
              to="/cart"
              className="relative flex flex-col items-center text-foreground/80 hover:text-foreground transition-colors duration-300"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{t('cart')}</span>
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden text-foreground/80 hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-sm font-medium tracking-wide uppercase text-foreground/80 hover:text-foreground transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};
