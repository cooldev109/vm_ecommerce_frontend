import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SEO } from '@/components/SEO';

export default function TermsOfUse() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const handleBack = () => {
    navigate('/subscriptions');
  };

  const termsSeoContent = {
    es: {
      title: 'Términos y Condiciones',
      description: 'Términos y condiciones de uso de V&M Candle Experience. Información sobre suscripciones, pagos, cancelaciones y propiedad intelectual.',
    },
    en: {
      title: 'Terms of Use',
      description: 'Terms and conditions of use for V&M Candle Experience. Information about subscriptions, payments, cancellations, and intellectual property.',
    },
  };

  const seoContent = termsSeoContent[language === 'es' ? 'es' : 'en'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        url="/terms"
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

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">{t('termsTitle')}</h1>
        <p className="text-lg font-semibold text-primary mb-2">V&M Candle Experience</p>
        <p className="text-sm text-muted-foreground mb-8">{t('termsLastUpdate')}: 07/12/2025</p>

        <p className="mb-6">
          {t('termsIntro')}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('termsSection1Title')}</h2>
          <p>
            {t('termsSection1Content')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('termsSection2Title')}</h2>
          <p>
            {t('termsSection2Content')}
          </p>
          <p className="mt-2">
            {t('termsSection2Note')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('termsSection3Title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{language === 'es' ? 'Los pagos se realizan de forma recurrente (mensual, trimestral, anual o según plan).' : 'Payments are made on a recurring basis (monthly, quarterly, annual or as per plan).'}</li>
            <li>{language === 'es' ? 'El cargo se renueva automáticamente hasta que el usuario cancele la suscripción.' : 'The charge is automatically renewed until the user cancels the subscription.'}</li>
            <li>{language === 'es' ? 'Los valores están expresados en CLP e incluyen impuestos cuando corresponda.' : 'Prices are expressed in CLP and include taxes where applicable.'}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('termsSection4Title')}</h2>
          <p>{t('termsSection4Intro')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>{t('termsSection4NoRefund')}</strong></li>
            <li>{t('termsSection4Cancel')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('termsSection5Title')}</h2>
          <p>
            {t('termsSection5Intro')}
          </p>
          <p className="font-medium text-primary mt-2">vymcandlexperience@gmail.com</p>
          <p className="mt-4">{t('termsSection5Effect')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>{t('termsSection5Stop')}</li>
            <li>{t('termsSection5Access')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('termsSection6Title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{language === 'es' ? 'La suscripción es personal e intransferible.' : 'The subscription is personal and non-transferable.'}</li>
            <li>{language === 'es' ? 'Está prohibido compartir accesos, claves o contenidos con terceros.' : 'Sharing access, passwords, or content with third parties is prohibited.'}</li>
            <li>{language === 'es' ? 'El incumplimiento dará lugar a la suspensión inmediata sin derecho a reembolso.' : 'Non-compliance will result in immediate suspension without right to refund.'}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('termsSection7Title')}</h2>
          <p>
            {t('termsSection7Content')}
          </p>
          <p className="mt-2">{t('termsSection7Forbidden')}</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>{language === 'es' ? 'Copiar' : 'Copy'}</li>
            <li>{language === 'es' ? 'Reproducir' : 'Reproduce'}</li>
            <li>{language === 'es' ? 'Distribuir' : 'Distribute'}</li>
            <li>{language === 'es' ? 'Revender' : 'Resell'}</li>
          </ul>
          <p className="mt-2">{t('termsSection7Auth')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('termsSection8Title')}</h2>
          <p>{t('termsSection8Intro')}</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>{language === 'es' ? 'Modificar contenidos' : 'Modify content'}</li>
            <li>{language === 'es' ? 'Agregar nuevos módulos' : 'Add new modules'}</li>
            <li>{language === 'es' ? 'Actualizar servicios' : 'Update services'}</li>
          </ul>
          <p className="mt-2">{t('termsSection8Note')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('termsSection9Title')}</h2>
          <p>{t('termsSection9Intro')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>{language === 'es' ? 'Usa la plataforma de forma voluntaria y consciente.' : 'Uses the platform voluntarily and consciously.'}</li>
            <li>{language === 'es' ? 'Comprende que los resultados dependen de su propio proceso personal.' : 'Understands that results depend on their own personal process.'}</li>
            <li>{language === 'es' ? 'Libera de responsabilidad a la plataforma por interpretaciones individuales del contenido.' : 'Releases the platform from responsibility for individual interpretations of content.'}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('termsSection10Title')}</h2>
          <p>{t('termsSection10Intro')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>{language === 'es' ? 'Incumple estas condiciones' : 'Violates these conditions'}</li>
            <li>{language === 'es' ? 'Realiza uso indebido del contenido' : 'Makes improper use of content'}</li>
            <li>{language === 'es' ? 'Afecta el funcionamiento de la comunidad' : 'Affects the functioning of the community'}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('termsSection11Title')}</h2>
          <p>
            {t('termsSection11Content')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('termsSection12Title')}</h2>
          <p>
            {t('termsSection12Content')}
          </p>
        </section>

        <section className="mb-8 p-4 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-3">{t('termsSection13Title')}</h2>
          <p className="font-medium">
            {t('termsSection13Content')}
          </p>
        </section>
      </div>
    </div>
  );
}
