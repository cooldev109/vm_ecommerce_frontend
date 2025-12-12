import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts } from '@/services/productService';
import { deleteProduct } from '@/services/adminProductService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Edit, Trash2, Loader2, Music } from 'lucide-react';
import { resolveProductImage } from '@/lib/imageHelper';
import { ProductFormDialog } from './ProductFormDialog';
import { AudioManagementDialog } from './AudioManagementDialog';
import { toast } from 'sonner';

export const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);
  const [audioDialogOpen, setAudioDialogOpen] = useState(false);
  const [audioProduct, setAudioProduct] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch all products
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getProducts({ language: 'EN' }),
  });

  const products = data?.data?.products || [];

  // Filter products by search query
  const filteredProducts = products.filter((product: any) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingProduct(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to delete product');
    },
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteProduct = (product: any) => {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingProduct) {
      deleteMutation.mutate(deletingProduct.id);
    }
  };

  const handleManageAudio = (product: any) => {
    setAudioProduct(product);
    setAudioDialogOpen(true);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </div>
            <Button className="btn-luxury" onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={resolveProductImage(product.image)}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.id}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                    <TableCell>
                      {product.inStock ? (
                        <Badge variant="default" className="bg-green-600">In Stock</Badge>
                      ) : (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleManageAudio(product)}
                          title="Manage Audio"
                        >
                          <Music className={`h-4 w-4 ${product.audioUrl ? 'text-accent' : 'text-muted-foreground'}`} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    {/* Product Form Dialog */}
    <ProductFormDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      product={editingProduct}
      onSuccess={handleSuccess}
    />

    {/* Audio Management Dialog */}
    <AudioManagementDialog
      open={audioDialogOpen}
      onOpenChange={setAudioDialogOpen}
      product={audioProduct}
      onSuccess={handleSuccess}
    />

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the product "{deletingProduct?.name}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};
