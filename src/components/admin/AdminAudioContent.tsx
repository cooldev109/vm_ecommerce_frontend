import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAudioContent,
  getAllAccessKeys,
  createAudioContent,
  updateAudioContent,
  deleteAudioContent,
  generateAccessKeys,
  uploadAudioFile,
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
import { Plus, Edit, Trash2, Loader2, Music, Key, Copy, Check, Upload } from 'lucide-react';
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

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      toast.success('Contenido de audio creado');
      setContentDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear contenido de audio');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAudioContent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-audio-content'] });
      toast.success('Contenido de audio actualizado');
      setContentDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar contenido de audio');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAudioContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-audio-content'] });
      toast.success('Contenido de audio eliminado');
      setDeleteDialogOpen(false);
      setDeletingContent(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar contenido de audio');
    },
  });

  const generateKeysMutation = useMutation({
    mutationFn: generateAccessKeys,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-access-keys'] });
      toast.success('Claves de acceso generadas');
      setGenerateDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al generar claves');
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
    setSelectedFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-detect duration from audio file
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        setFormData(prev => ({ ...prev, durationSeconds: Math.round(audio.duration) }));
        URL.revokeObjectURL(audio.src);
      };
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const result = await uploadAudioFile(selectedFile);
      setFormData(prev => ({ ...prev, fileUrl: result.filePath }));
      toast.success('Archivo de audio subido exitosamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al subir archivo de audio');
    } finally {
      setIsUploading(false);
    }
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
      toast.error('Clave de título y URL del archivo son requeridos');
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
            Contenido de Audio
          </TabsTrigger>
          <TabsTrigger value="keys">
            <Key className="h-4 w-4 mr-2" />
            Claves de Acceso
          </TabsTrigger>
        </TabsList>

        {/* Audio Content Tab */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Biblioteca de Contenido de Audio</CardTitle>
                  <CardDescription>Administra pistas de audio para suscriptores premium</CardDescription>
                </div>
                <Button onClick={handleAddContent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Audio
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
                      <TableHead>Título</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Acceso</TableHead>
                      <TableHead>Orden</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
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
                            <Badge variant="secondary">Vista Previa</Badge>
                          ) : audio.requiredPlan ? (
                            <Badge className="bg-amber-500">{audio.requiredPlan}</Badge>
                          ) : (
                            <Badge variant="default">Todos los Planes</Badge>
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
                  <CardTitle>Claves de Acceso</CardTitle>
                  <CardDescription>Genera y administra códigos de acceso promocionales</CardDescription>
                </div>
                <Button onClick={() => setGenerateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generar Claves
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
                      <TableHead>Código de Clave</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Canjeado Por</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessKeys.map((key: AudioAccessKey) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-mono">{key.keyCode}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{key.planId}</Badge>
                        </TableCell>
                        <TableCell>{key.durationMonths} mes(es)</TableCell>
                        <TableCell>
                          {key.isRedeemed ? (
                            <Badge variant="secondary">Canjeado</Badge>
                          ) : (
                            <Badge variant="default">Disponible</Badge>
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
            <DialogTitle>{editingContent ? 'Editar Contenido de Audio' : 'Agregar Contenido de Audio'}</DialogTitle>
            <DialogDescription>
              {editingContent ? 'Actualiza los detalles de la pista de audio' : 'Agrega una nueva pista de audio a la biblioteca'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Clave de Título</Label>
              <Input
                value={formData.titleKey}
                onChange={(e) => setFormData({ ...formData, titleKey: e.target.value })}
                placeholder="ej., morningSerenity"
              />
            </div>
            <div>
              <Label>Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as AudioCategory })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMBIENT">Ambiental</SelectItem>
                  <SelectItem value="MEDITATION">Meditación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Archivo de Audio</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileSelect}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleUploadFile}
                    disabled={!selectedFile || isUploading}
                    size="sm"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {selectedFile && !formData.fileUrl && (
                  <p className="text-xs text-muted-foreground">
                    Seleccionado: {selectedFile.name} - Haz clic en el botón de subir
                  </p>
                )}
                {formData.fileUrl && (
                  <p className="text-xs text-green-600">
                    ✓ Subido: {formData.fileUrl}
                  </p>
                )}
                <Input
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="O ingresa URL manualmente: /audio/filename.mp3"
                  className="text-xs"
                />
              </div>
            </div>
            <div>
              <Label>Duración (segundos) {formData.durationSeconds > 0 && `(${formatDuration(formData.durationSeconds)})`}</Label>
              <Input
                type="number"
                value={formData.durationSeconds}
                onChange={(e) => setFormData({ ...formData, durationSeconds: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Plan Requerido (opcional)</Label>
              <Select
                value={formData.requiredPlan || 'none'}
                onValueChange={(value) => setFormData({ ...formData, requiredPlan: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todos los Planes</SelectItem>
                  <SelectItem value="WEEKLY">Semanal+</SelectItem>
                  <SelectItem value="MONTHLY">Mensual+</SelectItem>
                  <SelectItem value="QUARTERLY">Solo Trimestral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Orden</Label>
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
              <Label>Vista Previa Gratuita</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContentDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitContent}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingContent ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Keys Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generar Claves de Acceso</DialogTitle>
            <DialogDescription>Crear códigos de acceso promocionales para contenido de audio</DialogDescription>
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
                  <SelectItem value="WEEKLY">Semanal</SelectItem>
                  <SelectItem value="MONTHLY">Mensual</SelectItem>
                  <SelectItem value="QUARTERLY">Trimestral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duración (meses)</Label>
              <Input
                type="number"
                min="1"
                max="12"
                value={keyFormData.durationMonths}
                onChange={(e) => setKeyFormData({ ...keyFormData, durationMonths: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label>Cantidad de Claves</Label>
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
              Cancelar
            </Button>
            <Button onClick={handleGenerateKeys} disabled={generateKeysMutation.isPending}>
              {generateKeysMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Contenido de Audio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará permanentemente "{deletingContent && getTitle(deletingContent.titleKey)}".
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingContent && deleteMutation.mutate(deletingContent.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
