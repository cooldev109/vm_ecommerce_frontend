import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAudioContent,
  getAllAccessKeys,
  createAudioContent,
  updateAudioContent,
  deleteAudioContent,
  generateAccessKeys,
  formatDuration,
  audioTitles,
  categoryLabels,
  type AudioContent,
  type AudioCategory,
  type AudioAccessKey,
} from '@/services/audioService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Loader2, Music, Key, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export const AdminAudioContent = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('content');

  // Audio content state
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<AudioContent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingContent, setDeletingContent] = useState<AudioContent | null>(null);

  // Access keys state
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form state for audio content
  const [formData, setFormData] = useState({
    titleKey: '',
    category: 'AMBIENT' as AudioCategory,
    fileUrl: '',
    durationSeconds: 0,
    isPreview: false,
    requiredPlan: '',
    sortOrder: 0,
  });

  // Form state for generating keys
  const [keyFormData, setKeyFormData] = useState({
    planId: 'MONTHLY',
    durationMonths: 1,
    count: 5,
  });

  // Fetch audio content
  const { data: contentData, isLoading: contentLoading } = useQuery({
    queryKey: ['admin-audio-content'],
    queryFn: () => getAudioContent({ limit: 100 }),
  });

  // Fetch access keys
  const { data: keysData, isLoading: keysLoading } = useQuery({
    queryKey: ['admin-access-keys'],
    queryFn: () => getAllAccessKeys({ limit: 100 }),
  });

  const audioContent = contentData?.audioContent || [];
  const accessKeys = keysData?.keys || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: createAudioContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-audio-content'] });
      toast.success('Audio content created');
      setContentDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create audio content');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAudioContent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-audio-content'] });
      toast.success('Audio content updated');
      setContentDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update audio content');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAudioContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-audio-content'] });
      toast.success('Audio content deleted');
      setDeleteDialogOpen(false);
      setDeletingContent(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete audio content');
    },
  });

  const generateKeysMutation = useMutation({
    mutationFn: generateAccessKeys,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-access-keys'] });
      toast.success('Access keys generated');
      setGenerateDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate keys');
    },
  });

  const resetForm = () => {
    setFormData({
      titleKey: '',
      category: 'AMBIENT',
      fileUrl: '',
      durationSeconds: 0,
      isPreview: false,
      requiredPlan: '',
      sortOrder: 0,
    });
    setEditingContent(null);
  };

  const handleAddContent = () => {
    resetForm();
    setContentDialogOpen(true);
  };

  const handleEditContent = (content: AudioContent) => {
    setEditingContent(content);
    setFormData({
      titleKey: content.titleKey,
      category: content.category,
      fileUrl: content.fileUrl || '',
      durationSeconds: content.durationSeconds,
      isPreview: content.isPreview,
      requiredPlan: content.requiredPlan || '',
      sortOrder: content.sortOrder,
    });
    setContentDialogOpen(true);
  };

  const handleDeleteContent = (content: AudioContent) => {
    setDeletingContent(content);
    setDeleteDialogOpen(true);
  };

  const handleSubmitContent = () => {
    if (!formData.titleKey || !formData.fileUrl) {
      toast.error('Title key and file URL are required');
      return;
    }

    const data = {
      ...formData,
      requiredPlan: formData.requiredPlan || null,
    };

    if (editingContent) {
      updateMutation.mutate({ id: editingContent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleGenerateKeys = () => {
    generateKeysMutation.mutate(keyFormData);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getTitle = (titleKey: string) => {
    return audioTitles[titleKey]?.en || titleKey;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">
            <Music className="h-4 w-4 mr-2" />
            Audio Content
          </TabsTrigger>
          <TabsTrigger value="keys">
            <Key className="h-4 w-4 mr-2" />
            Access Keys
          </TabsTrigger>
        </TabsList>

        {/* Audio Content Tab */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audio Content Library</CardTitle>
                  <CardDescription>Manage audio tracks for premium subscribers</CardDescription>
                </div>
                <Button onClick={handleAddContent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Audio
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {contentLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {audioContent.map((audio: AudioContent) => (
                      <TableRow key={audio.id}>
                        <TableCell className="font-medium">
                          {getTitle(audio.titleKey)}
                          <div className="text-xs text-muted-foreground">{audio.titleKey}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {categoryLabels[audio.category]?.en || audio.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDuration(audio.durationSeconds)}</TableCell>
                        <TableCell>
                          {audio.isPreview ? (
                            <Badge variant="secondary">Preview</Badge>
                          ) : audio.requiredPlan ? (
                            <Badge className="bg-amber-500">{audio.requiredPlan}</Badge>
                          ) : (
                            <Badge variant="default">All Plans</Badge>
                          )}
                        </TableCell>
                        <TableCell>{audio.sortOrder}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditContent(audio)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteContent(audio)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Keys Tab */}
        <TabsContent value="keys">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Access Keys</CardTitle>
                  <CardDescription>Generate and manage promotional access codes</CardDescription>
                </div>
                <Button onClick={() => setGenerateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Keys
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {keysLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key Code</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Redeemed By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessKeys.map((key: AudioAccessKey) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-mono">{key.keyCode}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{key.planId}</Badge>
                        </TableCell>
                        <TableCell>{key.durationMonths} month(s)</TableCell>
                        <TableCell>
                          {key.isRedeemed ? (
                            <Badge variant="secondary">Redeemed</Badge>
                          ) : (
                            <Badge variant="default">Available</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {key.redeemedBy ? (
                            <span className="text-sm">
                              {key.redeemedBy.profile?.firstName} {key.redeemedBy.profile?.lastName}
                              <br />
                              <span className="text-muted-foreground">{key.redeemedBy.email}</span>
                            </span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {!key.isRedeemed && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(key.keyCode)}
                            >
                              {copiedKey === key.keyCode ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Audio Content Dialog */}
      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingContent ? 'Edit Audio Content' : 'Add Audio Content'}</DialogTitle>
            <DialogDescription>
              {editingContent ? 'Update the audio track details' : 'Add a new audio track to the library'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title Key</Label>
              <Input
                value={formData.titleKey}
                onChange={(e) => setFormData({ ...formData, titleKey: e.target.value })}
                placeholder="e.g., morningSerenity"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as AudioCategory })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMBIENT">Ambient</SelectItem>
                  <SelectItem value="MEDITATION">Meditation</SelectItem>
                  <SelectItem value="FREQUENCY">Frequency</SelectItem>
                  <SelectItem value="EXCLUSIVE">Exclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>File URL</Label>
              <Input
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="/audio/filename.mp3"
              />
            </div>
            <div>
              <Label>Duration (seconds)</Label>
              <Input
                type="number"
                value={formData.durationSeconds}
                onChange={(e) => setFormData({ ...formData, durationSeconds: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Required Plan (optional)</Label>
              <Select
                value={formData.requiredPlan || 'none'}
                onValueChange={(value) => setFormData({ ...formData, requiredPlan: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All Plans</SelectItem>
                  <SelectItem value="MONTHLY">Monthly+</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly+</SelectItem>
                  <SelectItem value="ANNUAL">Annual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isPreview}
                onCheckedChange={(checked) => setFormData({ ...formData, isPreview: checked })}
              />
              <Label>Free Preview</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContentDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitContent}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingContent ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Keys Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Access Keys</DialogTitle>
            <DialogDescription>Create promotional access codes for audio content</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Plan</Label>
              <Select
                value={keyFormData.planId}
                onValueChange={(value) => setKeyFormData({ ...keyFormData, planId: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="ANNUAL">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration (months)</Label>
              <Input
                type="number"
                min="1"
                max="12"
                value={keyFormData.durationMonths}
                onChange={(e) => setKeyFormData({ ...keyFormData, durationMonths: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label>Number of Keys</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={keyFormData.count}
                onChange={(e) => setKeyFormData({ ...keyFormData, count: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateKeys} disabled={generateKeysMutation.isPending}>
              {generateKeysMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audio Content?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingContent && getTitle(deletingContent.titleKey)}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingContent && deleteMutation.mutate(deletingContent.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
