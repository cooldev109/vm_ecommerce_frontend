import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductById } from '@/services/productService';
import { getProductReviews, createReview } from '@/services/reviewService';
import { resolveProductImage } from '@/lib/imageHelper';
import { AudioPlayer } from '@/components/AudioPlayer';
import { SEO } from '@/components/SEO';
import ReviewList from '@/components/ReviewList';
import ReviewForm from '@/components/ReviewForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [reviewPage, setReviewPage] = useState(1);

  // Fetch product from backend
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id, language],
    queryFn: () => getProductById(id || '', language.toUpperCase()),
    enabled: !!id,
  });

  const product = data?.data?.product;

  // Fetch reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id, reviewPage],
    queryFn: () => getProductReviews(id || '', reviewPage, 10),
    enabled: !!id,
  });

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: ({ productId, rating, comment }: { productId: string; rating: number; comment: string }) =>
      createReview(productId, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      toast.success(t('reviewSubmitted') || 'Review submitted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || error.message || 'Failed to submit review';
      toast.error(message);
    },
  });

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!isAuthenticated) {
      toast.error(t('pleaseLoginToReview') || 'Please login to submit a review');
      navigate('/login');
      return;
    }

    if (!id) return;

    await createReviewMutation.mutateAsync({ productId: id, rating, comment });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-luxury">{t('loading') || 'Loading product...'}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('productNotFound') || 'Product not found'}</h1>
          <Button onClick={() => navigate('/shop')}>
            {t('backToShop') || 'Back to Shop'}
          </Button>
        </div>
      </div>
    );
  }

  // Resolve product image
  const productImage = resolveProductImage(product.image);
  const productImages = product.images?.map((img: string) => resolveProductImage(img)) || [productImage];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: productImage,
    });
    toast.success(t('addToCart'), {
      description: product.name,
    });
  };

  return (
    <div className="min-h-screen section-padding">
      <SEO
        title={product.name}
        description={product.description}
        image={productImage}
        url={`/product/${product.id}`}
        type="product"
        productPrice={parseFloat(product.price)}
        productCurrency="CLP"
        productAvailability={product.inStock ? 'in stock' : 'out of stock'}
      />
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/shop')}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToShop')}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4 animate-fade-in">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted shadow-luxury">
              <img
                src={productImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:shadow-soft transition-shadow duration-300"
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="animate-slide-up">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-accent mb-6">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <p className="text-lg text-luxury mb-4">
              {product.description}
            </p>
            {product.longDescription && (
              <p className="text-base text-luxury/80 mb-8">
                {product.longDescription}
              </p>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                  {t('features') || 'Features'}
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span className="text-luxury">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Info */}
            {(product.burnTime || product.size) && (
              <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-card rounded-lg">
                {product.burnTime && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t('burnTime') || 'Burn Time'}</p>
                    <p className="font-semibold">{product.burnTime}</p>
                  </div>
                )}
                {product.size && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t('size') || 'Size'}</p>
                    <p className="font-semibold">{product.size}</p>
                  </div>
                )}
              </div>
            )}

            {/* Audio Experience */}
            {product.audioUrl && (
              <div className="mb-8">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                  {t('audioExperience') || 'Audio Experience'}
                </h3>
                <AudioPlayer
                  audioUrl={product.audioUrl}
                  audioTitle={product.audioTitle}
                />
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <span className="text-sm font-medium text-green-600">
                  ✓ {t('inStock')}
                </span>
              ) : (
                <span className="text-sm font-medium text-destructive">
                  {t('outOfStock')}
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              className="btn-luxury w-full mb-4"
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {t('addToCart')}
            </Button>

            <Button
              onClick={() => navigate('/checkout')}
              className="btn-gold w-full"
              disabled={!product.inStock}
            >
              {t('buyNow') || 'Buy Now'}
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="reviews">
                {t('reviews') || 'Reviews'} ({reviewsData?.data?.stats?.totalReviews || 0})
              </TabsTrigger>
              <TabsTrigger value="write-review">
                {t('writeReview') || 'Write a Review'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-8">
              <ReviewList
                reviews={reviewsData?.data?.reviews || []}
                averageRating={reviewsData?.data?.stats?.averageRating || 0}
                totalReviews={reviewsData?.data?.stats?.totalReviews || 0}
                currentPage={reviewsData?.data?.pagination?.page || 1}
                totalPages={reviewsData?.data?.pagination?.totalPages || 1}
                hasMore={reviewsData?.data?.pagination?.hasMore || false}
                onPageChange={setReviewPage}
                isLoading={reviewsLoading}
              />
            </TabsContent>

            <TabsContent value="write-review" className="mt-8">
              <div className="max-w-2xl">
                {isAuthenticated ? (
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                      {t('shareYourThoughts') || 'Share Your Thoughts'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {t('reviewDescription') || 'Your feedback helps other customers make informed decisions.'}
                    </p>
                    <ReviewForm
                      onSubmit={handleSubmitReview}
                      isSubmitting={createReviewMutation.isPending}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <p className="text-lg text-muted-foreground mb-4">
                      {t('loginToReview') || 'Please login to write a review'}
                    </p>
                    <Button onClick={() => navigate('/login')} className="btn-luxury">
                      {t('login') || 'Login'}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
