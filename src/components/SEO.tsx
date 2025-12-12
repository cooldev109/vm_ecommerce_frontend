import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  noIndex?: boolean;
  // Product-specific
  productPrice?: number;
  productCurrency?: string;
  productAvailability?: 'in stock' | 'out of stock' | 'preorder';
  // Article-specific
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

const BASE_URL = 'https://vmcandleexperience.cl'; // Update with actual domain
const DEFAULT_IMAGE = '/og-image.jpg';

const seoTranslations = {
  es: {
    siteName: 'V&M Candle Experience',
    defaultTitle: 'V&M Candle Experience - Rituales que Restauran tu Alma',
    defaultDescription: 'Velas artesanales de alta gama con experiencias de audio premium. Rituales de bienestar que elevan tu alma. Elaboradas en Chile con cera de soya 100% natural.',
    defaultKeywords: 'velas artesanales, velas premium, velas de soya, aromaterapia, bienestar, meditación, rituales, Chile, velas naturales, experiencia sensorial',
  },
  en: {
    siteName: 'V&M Candle Experience',
    defaultTitle: 'V&M Candle Experience - Rituals that Restore Your Soul',
    defaultDescription: 'High-end artisanal candles with premium audio experiences. Wellness rituals that elevate your soul. Handcrafted in Chile with 100% natural soy wax.',
    defaultKeywords: 'artisanal candles, premium candles, soy candles, aromatherapy, wellness, meditation, rituals, Chile, natural candles, sensory experience',
  },
};

export const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false,
  productPrice,
  productCurrency = 'CLP',
  productAvailability,
  publishedTime,
  modifiedTime,
  author,
}: SEOProps) => {
  const { language } = useLanguage();
  const lang = language === 'es' ? 'es' : 'en';
  const translations = seoTranslations[lang];

  const seoTitle = title
    ? `${title} | ${translations.siteName}`
    : translations.defaultTitle;
  const seoDescription = description || translations.defaultDescription;
  const seoKeywords = keywords || translations.defaultKeywords;
  const seoImage = image ? `${BASE_URL}${image}` : `${BASE_URL}${DEFAULT_IMAGE}`;
  const seoUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="V&M Candle Experience" />
      <link rel="canonical" href={seoUrl} />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={translations.siteName} />
      <meta property="og:locale" content={lang === 'es' ? 'es_CL' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:site" content="@VandMCandles" />

      {/* Product Schema (for product pages) */}
      {type === 'product' && productPrice && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: title,
            description: seoDescription,
            image: seoImage,
            url: seoUrl,
            brand: {
              '@type': 'Brand',
              name: 'V&M Candle Experience',
            },
            offers: {
              '@type': 'Offer',
              price: productPrice,
              priceCurrency: productCurrency,
              availability: productAvailability
                ? `https://schema.org/${productAvailability.replace(' ', '')}`
                : 'https://schema.org/InStock',
              seller: {
                '@type': 'Organization',
                name: 'V&M Candle Experience',
              },
            },
          })}
        </script>
      )}

      {/* Article Schema (for blog/article pages) */}
      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            description: seoDescription,
            image: seoImage,
            url: seoUrl,
            datePublished: publishedTime,
            dateModified: modifiedTime || publishedTime,
            author: {
              '@type': 'Person',
              name: author || 'V&M Candle Experience',
            },
            publisher: {
              '@type': 'Organization',
              name: 'V&M Candle Experience',
              logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo.png`,
              },
            },
          })}
        </script>
      )}

      {/* Organization Schema (for homepage) */}
      {type === 'website' && !title && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'V&M Candle Experience',
            url: BASE_URL,
            logo: `${BASE_URL}/logo.png`,
            description: seoDescription,
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'CL',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'vymcandlexperience@gmail.com',
              contactType: 'customer service',
            },
            sameAs: [
              'https://www.instagram.com/vymcandleexperience',
              'https://www.facebook.com/vymcandleexperience',
            ],
          })}
        </script>
      )}

      {/* Local Business Schema */}
      {type === 'website' && !title && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'V&M Candle Experience',
            description: seoDescription,
            url: BASE_URL,
            telephone: '+56992257712',
            email: 'vymcandlexperience@gmail.com',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'Chile',
            },
            priceRange: '$$',
            paymentAccepted: 'Credit Card, Debit Card, WebPay',
            currenciesAccepted: 'CLP',
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
