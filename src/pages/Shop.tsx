import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';
import { getProducts } from '@/services/productService';
import type { Product } from '@/types';
import { resolveProductImage } from '@/lib/imageHelper';
import { SEO } from '@/components/SEO';

const Shop = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [category, setCategory] = useState('all');

  // Fetch products from backend
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', language],
    queryFn: () => getProducts({ language: language.toUpperCase() }),
  });
  // Transform products - backend already returns flattened products with translation applied
  const translatedProducts = useMemo(() => {
    const products = data?.data?.products || [];
    return products.map((product: any) => ({
      id: product.id,
      name: product.name || 'Product',
      description: product.description || '',
      price: parseFloat(product.price),
      image: resolveProductImage(product.image),
      category: product.category.toLowerCase(),
    }));
  }, [data]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return translatedProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [translatedProducts, searchQuery, category]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      // Always show candles before accessories
      if (a.category !== b.category) {
        if (a.category === 'candles') return -1;
        if (b.category === 'candles') return 1;
      }

      // Then apply price sorting
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [filteredProducts, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-luxury">{t('loading') || 'Loading products...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Error loading products</p>
          <p className="text-luxury">{error instanceof Error ? error.message : 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  const shopSeoContent = {
    es: {
      title: 'Tienda',
      description: 'Descubre nuestra colección de velas artesanales premium. Velas de soya 100% natural con fragancias exclusivas y experiencias de audio únicas.',
      keywords: 'velas artesanales, velas premium, velas de soya, aromaterapia, comprar velas, Chile',
    },
    en: {
      title: 'Shop',
      description: 'Discover our collection of premium artisanal candles. 100% natural soy candles with exclusive fragrances and unique audio experiences.',
      keywords: 'artisanal candles, premium candles, soy candles, aromatherapy, buy candles, Chile',
    },
  };

  const seoContent = shopSeoContent[language === 'es' ? 'es' : 'en'];

  return (
    <div className="min-h-screen section-padding">
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        url="/shop"
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('shop')}
          </h1>
          <p className="text-lg text-luxury max-w-2xl mx-auto">
            {t('shopDescription')}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder={t('filter')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allCategories')}</SelectItem>
              <SelectItem value="candles">{t('categoryCandles')}</SelectItem>
              <SelectItem value="accessories">{t('categoryAccessories')}</SelectItem>
              <SelectItem value="sets">{t('categorySets')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder={t('sort')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">{t('sortPopular')}</SelectItem>
              <SelectItem value="price-low">{t('sortPriceLow')}</SelectItem>
              <SelectItem value="price-high">{t('sortPriceHigh')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-lg text-luxury">
              {t('noProductsFound') || 'No products found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
