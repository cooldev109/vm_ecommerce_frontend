import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <img src={logo} alt="V&M" className="h-12 w-auto mb-4" />
            <p className="text-sm text-luxury max-w-md">
              {t('heroDescription')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">{t('shop')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-sm text-luxury hover:text-foreground transition-colors duration-300">
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link to="/audio" className="text-sm text-luxury hover:text-foreground transition-colors duration-300">
                  {t('audio')}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-luxury hover:text-foreground transition-colors duration-300">
                  {t('cart')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">{t('account')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm text-luxury hover:text-foreground transition-colors duration-300">
                  {t('login')}
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-luxury hover:text-foreground transition-colors duration-300">
                  {t('register')}
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-sm text-luxury hover:text-foreground transition-colors duration-300">
                  {t('profile')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">{t('information')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-luxury hover:text-foreground transition-colors duration-300">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link to="/product-info" className="text-sm text-luxury hover:text-foreground transition-colors duration-300">
                  {t('technicalSheet')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-luxury hover:text-foreground transition-colors duration-300">
                  {t('termsOfUse')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-luxury hover:text-foreground transition-colors duration-300">
                  {t('privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-luxury">
            © {new Date().getFullYear()} V&M Candle Experience. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
