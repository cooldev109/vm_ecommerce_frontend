import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-warm section-padding">
      <div className="text-center animate-fade-in">
        <h1 className="mb-4 text-8xl font-bold font-serif text-accent">404</h1>
        <h2 className="mb-4 text-3xl font-semibold text-foreground">{t('pageNotFound')}</h2>
        <p className="mb-8 text-xl text-luxury max-w-md mx-auto">{t('pageNotFoundMessage')}</p>
        <Button asChild className="btn-luxury">
          <a href="/" className="inline-flex items-center gap-2">
            <Home className="h-4 w-4" />
            {t('returnHome')}
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
