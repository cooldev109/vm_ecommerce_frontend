import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedProducts } from '@/services/productService';
import type { Product } from '@/types';
import heroBackground from '@/assets/reference-lifestyle-2.png';
import candleProduct from '@/assets/candle-product.png';
import candleLifestyle from '@/assets/reference-lifestyle-1.png';
import { Sparkles, Headphones, Heart, Loader2 } from 'lucide-react';
import { resolveProductImage } from '@/lib/imageHelper';
import { SEO } from '@/components/SEO';

const Index = () => {
  const { t, language } = useLanguage();

  // Fetch featured products from backend
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products', language],
    queryFn: () => getFeaturedProducts(language.toUpperCase()),
  });

  const products = data?.data?.products || [];

  // Transform products for display
  // Backend returns flattened products with translation already applied
  const featuredProducts = products.slice(0, 3).map((product: any) => ({
    id: product.id,
    name: product.name || 'Product',
    description: product.description || '',
    price: parseFloat(product.price),
    image: resolveProductImage(product.image),
  }));

  return (
    <div className="min-h-screen">
      <SEO url="/" />
      {/* Hero Section - V&M Style */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-background/40" />
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 animate-fade-in">
          <div className="mb-8">
            <h1 className="font-serif text-6xl md:text-8xl font-light text-foreground mb-4 tracking-wide" style={{ fontStyle: 'Orelega' }}>
              V&M
            </h1>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-6 tracking-wider">
              Candle Experience
            </h2>
          </div>
          <p className="font-serif text-xl md:text-2xl text-foreground/85 mb-12 italic font-light tracking-wide">
            {t('heroTagline')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/shop">
              <Button className="btn-luxury">
                {t('shopNow')}
              </Button>
            </Link>
            <Link to="/audio">
              <Button className="btn-gold">
                <Headphones className="mr-2 h-4 w-4" />
                {t('exploreAudio')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('products')}
            </h2>
            <p className="text-lg text-luxury max-w-2xl mx-auto">
              {t('featuredProductsDesc')}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-accent" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link to="/shop">
                  <Button className="btn-outline-luxury">
                    {t('viewAll') || 'View All Products'}
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Essence Sets Section */}
      <section className="section-padding bg-gradient-beige">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-8 italic tracking-wide">
            {t('essenceSetsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
            {[
              {
                title: t('essenceFeature1Title'),
                desc: t('essenceFeature1Desc')
              },
              {
                title: t('essenceFeature2Title'),
                desc: t('essenceFeature2Desc')
              },
              {
                title: t('essenceFeature3Title'),
                desc: t('essenceFeature3Desc')
              },
              {
                title: t('essenceFeature4Title'),
                desc: t('essenceFeature4Desc')
              },
              {
                title: t('essenceFeature5Title'),
                desc: t('essenceFeature5Desc')
              },
              {
                title: t('essenceFeature6Title'),
                desc: t('essenceFeature6Desc')
              },
            ].map((item, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="font-serif text-xl md:text-2xl text-foreground/90 mb-3 font-light">
                  {item.title}
                </h3>
                <p className="text-base text-luxury leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="animate-fade-in">
            <img
              src={candleProduct}
              alt="Candle Experience"
              className="rounded shadow-luxury w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Ritual Section */}
      <section className="section-padding bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <img
                src={candleLifestyle}
                alt="Un ritual sensorial"
                className="rounded shadow-luxury w-full"
              />
            </div>
            <div className="animate-slide-up text-center lg:text-left">
              <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-6 italic">
                {t('ritualSectionTitle')}
              </h2>
              <p className="font-serif text-2xl md:text-3xl text-foreground/80 mb-8 italic font-light">
                <span className="font-script text-3xl md:text-4xl">{t('ritualSectionSubtitle')}</span>
              </p>
              <p className="text-lg text-luxury leading-relaxed mb-8">
                {t('ritualSectionDesc')}
              </p>
              <Link to="/audio">
                <Button className="btn-luxury">
                  {t('exploreAudio')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="section-padding bg-gradient-warm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-4 italic">
            {t('howToUseTitle')}
          </h2>
          <p className="text-lg text-luxury mb-6">
            {t('howToUseSubtitle')}
          </p>
          <p className="text-base text-luxury mb-8 italic">
            {t('howToUseDesc')}
          </p>
          <p className="font-script text-4xl md:text-5xl text-foreground/85 mb-12">
            {t('breatheReceiveRelease')}
          </p>
          <div className="animate-fade-in">
            <img
              src={candleProduct}
              alt="Enciende la vela"
              className="rounded shadow-luxury w-full max-w-sm mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-card">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('subscribeNewsletter')}
          </h2>
          <p className="text-lg text-luxury mb-8">
            {t('newsletterDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t('email')}
              className="flex-1"
            />
            <Button className="btn-gold">
              {t('send')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
