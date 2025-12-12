import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Shield,
  User,
  Database,
  Target,
  Lock,
  CreditCard,
  Cookie,
  UserCheck,
  Clock,
  Users,
  FileEdit,
  CheckCircle,
  Scale,
  Mail,
  MapPin,
  Building,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SEO } from '@/components/SEO';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const handleBack = () => {
    navigate('/subscriptions');
  };

  const privacySeoContent = {
    es: {
      title: 'Política de Privacidad',
      description: 'Conoce cómo V&M Candle Experience protege y maneja tu información personal. Información sobre recopilación de datos, uso, seguridad y tus derechos.',
    },
    en: {
      title: 'Privacy Policy',
      description: 'Learn how V&M Candle Experience protects and handles your personal information. Information about data collection, usage, security, and your rights.',
    },
  };

  const seoContent = privacySeoContent[language === 'es' ? 'es' : 'en'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        url="/privacy"
        noIndex={true}
      />
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('back')}
      </Button>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('privacyTitle')}</h1>
        <p className="text-lg font-semibold text-primary mb-2">V&M Candle Experience</p>
        <Badge variant="secondary" className="text-xs">
          {t('termsLastUpdate')}: 07/12/2025
        </Badge>
      </div>

      {/* Introduction Card */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">
            {t('privacyIntro')}
          </p>
          <p className="font-medium text-primary">
            {t('privacyAcceptance')}
          </p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Section 1 - Data Controller */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="h-5 w-5 text-primary" />
              {t('privacySection1Title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('privacySection1Intro')}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <User className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('privacyName')}</p>
                  <p className="font-medium">Patricia Labbé Cano</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Building className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('privacyBrand')}</p>
                  <p className="font-medium">V&M Candle Experience</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('privacyContact')}</p>
                  <a href="mailto:vymcandlexperience@gmail.com" className="font-medium text-primary hover:underline">
                    vymcandlexperience@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('privacyCountry')}</p>
                  <p className="font-medium">Chile</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2 - Data We Collect */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5 text-blue-500" />
              {t('privacySection2Title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('privacySection2Intro')}</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                language === 'es' ? 'Nombre y apellido' : 'First and last name',
                language === 'es' ? 'Correo electrónico' : 'Email address',
                language === 'es' ? 'Teléfono' : 'Phone number',
                language === 'es' ? 'Información de pago' : 'Payment information',
                language === 'es' ? 'Dirección IP' : 'IP address',
                language === 'es' ? 'Historial de compras' : 'Purchase history',
                language === 'es' ? 'Preferencias de contenido' : 'Content preferences',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
              {t('privacySection2Note')}
            </p>
          </CardContent>
        </Card>

        {/* Section 3 - Purpose of Data Use */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-purple-500" />
              {t('privacySection3Title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('privacySection3Intro')}</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                language === 'es' ? 'Gestionar tu acceso a la plataforma' : 'Manage your access to the platform',
                language === 'es' ? 'Procesar pagos y suscripciones' : 'Process payments and subscriptions',
                language === 'es' ? 'Enviar información relevante' : 'Send relevant information',
                language === 'es' ? 'Comunicaciones promocionales' : 'Promotional communications',
                language === 'es' ? 'Atención al cliente' : 'Customer service',
                language === 'es' ? 'Cumplimiento legal' : 'Legal compliance',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2">
                  <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 4 - Security */}
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-5 w-5 text-green-600" />
              {t('privacySection4Title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('privacySection4Content')}
            </p>
          </CardContent>
        </Card>

        {/* Section 5 - Payment Platforms */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-indigo-500" />
              {t('privacySection5Title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('privacySection5Intro')}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Hotmart', 'WebPay', 'PayPal', 'Stripe', 'MercadoPago'].map((platform) => (
                <Badge key={platform} variant="outline" className="px-3 py-1">
                  {platform}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('privacySection5Note')}
            </p>
          </CardContent>
        </Card>

        {/* Section 6 - Cookies */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cookie className="h-5 w-5 text-amber-500" />
              {t('privacySection6Title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('privacySection6Intro')}</p>
            <div className="space-y-2">
              {[
                language === 'es' ? 'Mejorar la experiencia del usuario' : 'Improve user experience',
                language === 'es' ? 'Analizar navegación' : 'Analyze navigation',
                language === 'es' ? 'Recordar preferencias' : 'Remember preferences',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {t('privacySection6Note')}
            </p>
          </CardContent>
        </Card>

        {/* Section 7 - User Rights */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-primary" />
              {t('privacySection7Title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('privacySection7Intro')}</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {[
                { icon: '🔍', text: language === 'es' ? 'Acceder a sus datos' : 'Access their data' },
                { icon: '✏️', text: language === 'es' ? 'Rectificar información incorrecta' : 'Rectify incorrect information' },
                { icon: '🗑️', text: language === 'es' ? 'Solicitar eliminación de sus datos' : 'Request deletion of their data' },
                { icon: '🚫', text: language === 'es' ? 'Oponerse a su uso con fines comerciales' : 'Object to its use for commercial purposes' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <p className="text-sm text-muted-foreground mb-2">{t('privacySection7Contact')}</p>
              <a href="mailto:vymcandlexperience@gmail.com" className="font-medium text-primary hover:underline flex items-center gap-2">
                <Mail className="h-4 w-4" />
                vymcandlexperience@gmail.com
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Section 8 - Data Retention */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-blue-500" />
              {t('privacySection8Title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('privacySection8Content')}
            </p>
          </CardContent>
        </Card>

        {/* Section 9 - Minors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-orange-500" />
              {t('privacySection9Title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('privacySection9Content')}
            </p>
          </CardContent>
        </Card>

        {/* Section 10 - Policy Modifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileEdit className="h-5 w-5 text-gray-500" />
              {t('privacySection10Title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('privacySection10Content')}
            </p>
          </CardContent>
        </Card>

        {/* Section 11 - Acceptance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {t('privacySection11Title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('privacySection11Content')}
            </p>
          </CardContent>
        </Card>

        {/* Section 12 - Applicable Legislation */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scale className="h-5 w-5 text-primary" />
              {t('privacySection12Title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">
              {t('privacySection12Content')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-sm text-muted-foreground">
        <p>{language === 'es' ? 'Elaborado por V&M Candle Experience • Chile' : 'Prepared by V&M Candle Experience • Chile'}</p>
        <p className="mt-2">
          {language === 'es' ? 'Para consultas adicionales, contacte a' : 'For additional inquiries, contact'}{' '}
          <a href="mailto:vymcandlexperience@gmail.com" className="text-primary hover:underline">
            vymcandlexperience@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
