import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Music, Trash2 } from 'lucide-react';
import { AudioPlayer } from '@/components/AudioPlayer';
import { toast } from 'sonner';
import api from '@/lib/api';

interface AudioManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
  onSuccess: () => void;
}

export const AudioManagementDialog = ({
  open,
  onOpenChange,
  product,
  onSuccess,
}: AudioManagementDialogProps) => {
  const [audioUrl, setAudioUrl] = useState('');
  const [audioTitle, setAudioTitle] = useState('');
  const [audioDuration, setAudioDuration] = useState('');

  useEffect(() => {
    if (product) {
      setAudioUrl(product.audioUrl || '');
      setAudioTitle(product.audioTitle || '');
      setAudioDuration(product.audioDuration?.toString() || '');
    }
  }, [product]);

  const updateMutation = useMutation({
    mutationFn: async (data: { audioUrl: string; audioTitle?: string; audioDuration?: number }) => {
      const response = await api.put(`/products/${product.id}/audio`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Audio actualizado exitosamente');
      onSuccess();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Error al actualizar audio');
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/products/${product.id}/audio`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Audio eliminado exitosamente');
      setAudioUrl('');
      setAudioTitle('');
      setAudioDuration('');
      onSuccess();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Error al eliminar audio');
    },
  });

  const handleSave = () => {
    if (!audioUrl.trim()) {
      toast.error('URL de audio es requerida');
      return;
    }

    updateMutation.mutate({
      audioUrl: audioUrl.trim(),
      audioTitle: audioTitle.trim() || undefined,
      audioDuration: audioDuration ? parseInt(audioDuration) : undefined,
    });
  };

  const handleRemove = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar el audio de este producto?')) {
      removeMutation.mutate();
    }
  };

  if (!product) return null;

  const isPending = updateMutation.isPending || removeMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Gestionar Audio - {product.name}
          </DialogTitle>
          <DialogDescription>
            Agregar o actualizar experiencia de audio para este producto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Audio Preview */}
          {product.audioUrl && (
            <div>
              <Label className="mb-2 block">Audio Actual</Label>
              <AudioPlayer
                audioUrl={product.audioUrl}
                audioTitle={product.audioTitle}
              />
            </div>
          )}

          {/* Audio URL */}
          <div>
            <Label htmlFor="audioUrl">URL del Audio *</Label>
            <Input
              id="audioUrl"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="https://example.com/audio.mp3"
              disabled={isPending}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enlace directo al archivo de audio (MP3, WAV, OGG)
            </p>
          </div>

          {/* Audio Title */}
          <div>
            <Label htmlFor="audioTitle">Título del Audio</Label>
            <Input
              id="audioTitle"
              value={audioTitle}
              onChange={(e) => setAudioTitle(e.target.value)}
              placeholder="ej., Meditación Calmante"
              disabled={isPending}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Título opcional para la experiencia de audio
            </p>
          </div>

          {/* Audio Duration */}
          <div>
            <Label htmlFor="audioDuration">Duración (segundos)</Label>
            <Input
              id="audioDuration"
              type="number"
              value={audioDuration}
              onChange={(e) => setAudioDuration(e.target.value)}
              placeholder="ej., 300"
              disabled={isPending}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Duración opcional en segundos
            </p>
          </div>

          {/* Preview New Audio */}
          {audioUrl && audioUrl !== product.audioUrl && (
            <div>
              <Label className="mb-2 block">Vista Previa del Nuevo Audio</Label>
              <AudioPlayer
                audioUrl={audioUrl}
                audioTitle={audioTitle || 'Vista Previa'}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {product.audioUrl && (
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={isPending}
              className="mr-auto"
            >
              {removeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar Audio
                </>
              )}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isPending || !audioUrl.trim()}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Audio'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
