/**
 * Image Helper
 * Maps database image paths to actual Vite imports
 * Ensures all product and accessory images are properly bundled in production
 */

// Import all product images
import productCalmRitual from '@/assets/V&M Calm  Ritual.jpg';
import productExecutiveBalance from '@/assets/executive_balance.png';

// Import accessory images
import accessorySnuffer from '@/assets/accessory-snuffer.jpg';
import accessoryTrimmer from '@/assets/accessory-trimmer.jpg';
import accessoryDipper from '@/assets/accessory-dipper.jpg';
import accessorySet from '@/assets/accessory-set.jpg';

// Fallback image
import candleProduct from '@/assets/candle-product.png';

// Map database paths to actual imports
const imageMap: Record<string, string> = {
  // Candles
  '/src/assets/V&M Calm  Ritual.jpg': productCalmRitual,
  '/src/assets/executive_balance.png': productExecutiveBalance,
  '/src/assets/candle-product.png': candleProduct,

  // Accessories
  '/src/assets/accessory-snuffer.jpg': accessorySnuffer,
  '/src/assets/accessory-trimmer.jpg': accessoryTrimmer,
  '/src/assets/accessory-dipper.jpg': accessoryDipper,
  '/src/assets/accessory-set.jpg': accessorySet,
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
