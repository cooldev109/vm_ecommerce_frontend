import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import * as authService from '@/services/authService';
import type { Address } from '@/types';

const AddressesTab = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    type: 'SHIPPING' as 'SHIPPING' | 'BILLING',
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'Chile',
    isDefault: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await authService.getAddresses();

      if (response.success && response.data) {
        setAddresses(response.data.addresses);
      } else {
        throw new Error(response.error?.message || 'Failed to load addresses');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        type: address.type as 'SHIPPING' | 'BILLING',
        street: address.street,
        city: address.city,
        region: address.region,
        postalCode: address.postalCode,
        country: address.country,
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        type: 'SHIPPING',
        street: '',
        city: '',
        region: '',
        postalCode: '',
        country: 'Chile',
        isDefault: false,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let response;

      if (editingAddress) {
        // Update existing address
        response = await authService.updateAddress(editingAddress.id, formData);
      } else {
        // Create new address
        response = await authService.createAddress(formData);
      }

      if (response.success) {
        toast.success(editingAddress ? 'Address updated successfully' : 'Address created successfully');
        setDialogOpen(false);
        loadAddresses();
      } else {
        throw new Error(response.error?.message || 'Failed to save address');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await authService.deleteAddress(addressId);

      if (response.success) {
        toast.success('Address deleted successfully');
        loadAddresses();
      } else {
        throw new Error(response.error?.message || 'Failed to delete address');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete address');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Address Button */}
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="btn-luxury">
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
              <DialogDescription>
                {editingAddress ? 'Update your address information' : 'Add a new shipping or billing address'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Address Type */}
              <div>
                <Label>Address Type</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as 'SHIPPING' | 'BILLING' })}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SHIPPING" id="shipping" />
                    <Label htmlFor="shipping" className="cursor-pointer">Shipping</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BILLING" id="billing" />
                    <Label htmlFor="billing" className="cursor-pointer">Billing</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Street */}
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Av. Libertador 123, Apt 4B"
                  required
                />
              </div>

              {/* City and Region */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Santiago"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="Metropolitana"
                    required
                  />
                </div>
              </div>

              {/* Postal Code and Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="8320000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Default Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
                />
                <Label htmlFor="isDefault" className="cursor-pointer">
                  Set as default {formData.type.toLowerCase()} address
                </Label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="btn-luxury flex-1" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingAddress ? (
                    'Update Address'
                  ) : (
                    'Add Address'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <Card className="card-luxury">
          <CardContent className="py-12 text-center">
            <MapPin className="h-16 w-16 text-luxury mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Addresses Yet</h3>
            <p className="text-luxury mb-4">Add your first address to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className="card-luxury">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">
                      {address.type === 'SHIPPING' ? 'Shipping' : 'Billing'} Address
                    </CardTitle>
                  </div>
                  {address.isDefault && (
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-sm text-luxury space-y-1 mb-4">
                  <p className="font-semibold text-foreground">{address.street}</p>
                  <p>{address.city}, {address.region}</p>
                  <p>{address.postalCode}</p>
                  <p>{address.country}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(address)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesTab;
