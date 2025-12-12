import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import * as authService from '@/services/authService';

const ProfileTab = () => {
  const { user, profile, setProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phone: profile?.phone || '',
    customerType: profile?.customerType || 'INDIVIDUAL',
    taxId: profile?.taxId || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.updateProfile(formData);

      if (response.success && response.data) {
        setProfile(response.data.profile);
        toast.success('Profile updated successfully');
        setEditing(false);
      } else {
        throw new Error(response.error?.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phone: profile?.phone || '',
      customerType: profile?.customerType || 'INDIVIDUAL',
      taxId: profile?.taxId || '',
    });
    setEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="card-luxury">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="font-serif text-2xl">Profile Information</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
            {!editing && (
              <Button onClick={() => setEditing(true)} variant="outline">
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Type */}
            <div>
              <Label>Customer Type</Label>
              <RadioGroup
                value={formData.customerType}
                onValueChange={(value) => setFormData({ ...formData, customerType: value as 'INDIVIDUAL' | 'BUSINESS' })}
                disabled={!editing}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="INDIVIDUAL" id="individual" />
                  <Label htmlFor="individual" className="cursor-pointer">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BUSINESS" id="business" />
                  <Label htmlFor="business" className="cursor-pointer">Business</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!editing}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!editing}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!editing}
                placeholder="+56912345678"
              />
            </div>

            {/* Tax ID */}
            <div>
              <Label htmlFor="taxId">
                {formData.customerType === 'BUSINESS' ? 'Business Tax ID (RUT)' : 'Tax ID (RUT)'}
              </Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                disabled={!editing}
                placeholder="12345678-9"
              />
            </div>

            {/* Action Buttons */}
            {editing && (
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="btn-luxury flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
