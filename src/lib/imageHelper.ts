/**
 * Image Helper
 * Maps database image paths to actual Vite imports
 */

// Import all product images
import productCalmRitual from '@/assets/V&M Calm  Ritual.jpg';
import productVanilla from '@/assets/product-vanilla-candle.jpg';
import productLavender from '@/assets/product-lavender-candle.jpg';
import productRose from '@/assets/product-rose-candle.jpg';
import productJasmine from '@/assets/product-jasmine-candle.jpg';
import productCitrus from '@/assets/product-citrus-candle.jpg';
import productEucalyptus from '@/assets/product-eucalyptus-candle.jpg';
import productAmber from '@/assets/product-amber-candle.jpg';
import productCedarwood from '@/assets/product-cedarwood-candle.jpg';
import productBergamot from '@/assets/product-bergamot-candle.jpg';
import productPeony from '@/assets/product-peony-candle.jpg';
import productSandalwood from '@/assets/product-sandalwood-candle.jpg';

// Import accessory images
import accessorySnuffer from '@/assets/accessory-snuffer.jpg';
import accessoryTrimmer from '@/assets/accessory-trimmer.jpg';
import accessoryDipper from '@/assets/accessory-dipper.jpg';

// Fallback image
import candleProduct from '@/assets/candle-product.png';

// Map database paths to actual imports
const imageMap: Record<string, string> = {
  // Candles
  '/src/assets/V&M Calm  Ritual.jpg': productCalmRitual,
  '/src/assets/product-vanilla-candle.jpg': productVanilla,
  '/src/assets/product-lavender-candle.jpg': productLavender,
  '/src/assets/product-rose-candle.jpg': productRose,
  '/src/assets/product-jasmine-candle.jpg': productJasmine,
  '/src/assets/product-citrus-candle.jpg': productCitrus,
  '/src/assets/product-eucalyptus-candle.jpg': productEucalyptus,
  '/src/assets/product-amber-candle.jpg': productAmber,
  '/src/assets/product-cedarwood-candle.jpg': productCedarwood,
  '/src/assets/product-bergamot-candle.jpg': productBergamot,
  '/src/assets/product-peony-candle.jpg': productPeony,
  '/src/assets/product-sandalwood-candle.jpg': productSandalwood,

  // Accessories
  '/src/assets/accessory-snuffer.jpg': accessorySnuffer,
  '/src/assets/accessory-trimmer.jpg': accessoryTrimmer,
  '/src/assets/accessory-dipper.jpg': accessoryDipper,
};

/**
 * Resolves a database image path to the actual Vite-processed image URL
 */
export function resolveProductImage(imagePath: string): string {
  // If the path is already a processed Vite URL (starts with /@fs or /assets), return as-is
  if (imagePath.startsWith('/@fs') || imagePath.startsWith('/assets')) {
    return imagePath;
  }

  // If the path is an uploaded image (starts with /uploads), prepend the backend base URL
  if (imagePath.startsWith('/uploads/')) {
    // Get the API base URL and remove the /api suffix to get the backend base URL
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const backendBaseUrl = apiBaseUrl.replace(/\/api$/, '');
    return `${backendBaseUrl}${imagePath}`;
  }

  // Look up in the image map
  const resolvedImage = imageMap[imagePath];

  // Return the resolved image or fallback
  return resolvedImage || candleProduct;
}
