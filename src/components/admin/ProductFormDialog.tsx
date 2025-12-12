import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, X } from 'lucide-react';
import { createProduct, updateProduct, upsertProductTranslation } from '@/services/adminProductService';
import { uploadProductImage } from '@/services/uploadService';
import { toast } from 'sonner';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any; // Existing product for edit mode
  onSuccess: () => void;
}

export const ProductFormDialog = ({ open, onOpenChange, product, onSuccess }: ProductFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!product;

  // Product basic info
  const [id, setId] = useState('');
  const [category, setCategory] = useState<'CANDLES' | 'ACCESSORIES' | 'SETS'>('CANDLES');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [burnTime, setBurnTime] = useState('');
  const [size, setSize] = useState('');
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState('');

  // English translation
  const [nameEN, setNameEN] = useState('');
  const [descEN, setDescEN] = useState('');
  const [longDescEN, setLongDescEN] = useState('');
  const [featuresEN, setFeaturesEN] = useState('');

  // Spanish translation
  const [nameES, setNameES] = useState('');
  const [descES, setDescES] = useState('');
  const [longDescES, setLongDescES] = useState('');
  const [featuresES, setFeaturesES] = useState('');

  // Load existing product data in edit mode
  useEffect(() => {
    if (product) {
      setId(product.id || '');
      setCategory(product.category || 'CANDLES');
      setPrice(product.price?.toString() || '');
      setImage(product.image || '');
      setBurnTime(product.burnTime || '');
      setSize(product.size || '');
      setInStock(product.inStock ?? true);
      setFeatured(product.featured ?? false);
      setSortOrder(product.sortOrder?.toString() || '');
      setNameEN(product.name || '');
      setDescEN(product.description || '');
      setLongDescEN(product.longDescription || '');
      setFeaturesEN(product.features?.join('\n') || '');
    } else {
      // Reset form for add mode
      resetForm();
    }
  }, [product, open]);

  const resetForm = () => {
    setId('');
    setCategory('CANDLES');
    setPrice('');
    setImage('');
    setImagePreview(null);
    setBurnTime('');
    setSize('');
    setInStock(true);
    setFeatured(false);
    setSortOrder('');
    setNameEN('');
    setDescEN('');
    setLongDescEN('');
    setFeaturesEN('');
    setNameES('');
    setDescES('');
    setLongDescES('');
    setFeaturesES('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadProductImage(file);
      setImage(result.filePath);
      setImagePreview(URL.createObjectURL(file));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage('');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...(isEdit ? {} : { id }), // Only include ID for new products
        category,
        price: parseFloat(price),
        image,
        images: [image],
        inStock,
        burnTime: burnTime || null,
        size: size || null,
        featured,
        sortOrder: sortOrder ? parseInt(sortOrder) : undefined,
      };

      let productId = product?.id || id;

      // Create or update product
      if (isEdit) {
        await updateProduct(productId, productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully');
      }

      // Update English translation
      if (nameEN || descEN) {
        await upsertProductTranslation(productId, 'EN', {
          name: nameEN,
          description: descEN,
          longDescription: longDescEN,
          features: featuresEN.split('\n').filter(f => f.trim()),
        });
      }

      // Update Spanish translation
      if (nameES || descES) {
        await upsertProductTranslation(productId, 'ES', {
          name: nameES,
          description: descES,
          longDescription: longDescES,
          features: featuresES.split('\n').filter(f => f.trim()),
        });
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update product information and translations' : 'Create a new product with translations'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Product Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Product Information</h3>

            <div className="grid grid-cols-2 gap-4">
              {!isEdit && (
                <div>
                  <Label htmlFor="id">Product ID *</Label>
                  <Input
                    id="id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                    placeholder="e.g., 12"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CANDLES">Candles</SelectItem>
                    <SelectItem value="ACCESSORIES">Accessories</SelectItem>
                    <SelectItem value="SETS">Sets</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="45.00"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="image">Product Image *</Label>
                <div className="mt-2">
                  {imagePreview || image ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview || `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${image}`}
                        alt="Product preview"
                        className="w-40 h-40 object-cover rounded-lg border-2 border-border"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="image"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          {uploading ? (
                            <span className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Uploading...</span>
                            </span>
                          ) : (
                            <>
                              <span className="font-semibold text-accent hover:text-accent/80">Click to upload</span>
                              <span className="block mt-1">PNG, JPG, WEBP up to 5MB</span>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="burnTime">Burn Time</Label>
                <Input
                  id="burnTime"
                  value={burnTime}
                  onChange={(e) => setBurnTime(e.target.value)}
                  placeholder="50-60 hours"
                />
              </div>

              <div>
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="250g"
                />
              </div>

              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch checked={inStock} onCheckedChange={setInStock} />
                  <Label>In Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={featured} onCheckedChange={setFeatured} />
                  <Label>Featured</Label>
                </div>
              </div>
            </div>
          </div>

          {/* English Translation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">English Translation</h3>

            <div>
              <Label htmlFor="nameEN">Name (EN) *</Label>
              <Input
                id="nameEN"
                value={nameEN}
                onChange={(e) => setNameEN(e.target.value)}
                required
                placeholder="Product Name"
              />
            </div>

            <div>
              <Label htmlFor="descEN">Description (EN) *</Label>
              <Textarea
                id="descEN"
                value={descEN}
                onChange={(e) => setDescEN(e.target.value)}
                required
                placeholder="Short description"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="longDescEN">Long Description (EN)</Label>
              <Textarea
                id="longDescEN"
                value={longDescEN}
                onChange={(e) => setLongDescEN(e.target.value)}
                placeholder="Detailed description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="featuresEN">Features (EN - one per line)</Label>
              <Textarea
                id="featuresEN"
                value={featuresEN}
                onChange={(e) => setFeaturesEN(e.target.value)}
                placeholder="100% natural plant wax&#10;Pure essential oils&#10;Handmade"
                rows={4}
              />
            </div>
          </div>

          {/* Spanish Translation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Spanish Translation</h3>

            <div>
              <Label htmlFor="nameES">Name (ES)</Label>
              <Input
                id="nameES"
                value={nameES}
                onChange={(e) => setNameES(e.target.value)}
                placeholder="Nombre del Producto"
              />
            </div>

            <div>
              <Label htmlFor="descES">Description (ES)</Label>
              <Textarea
                id="descES"
                value={descES}
                onChange={(e) => setDescES(e.target.value)}
                placeholder="Descripción corta"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="longDescES">Long Description (ES)</Label>
              <Textarea
                id="longDescES"
                value={longDescES}
                onChange={(e) => setLongDescES(e.target.value)}
                placeholder="Descripción detallada"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="featuresES">Features (ES - one per line)</Label>
              <Textarea
                id="featuresES"
                value={featuresES}
                onChange={(e) => setFeaturesES(e.target.value)}
                placeholder="Cera vegetal 100% natural&#10;Aceites esenciales puros&#10;Hecho a mano"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-luxury" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
