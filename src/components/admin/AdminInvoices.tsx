import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Loader2, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllInvoices, generateInvoice as generateInvoiceAPI } from '@/services/invoiceService';
import { getAuthToken } from '@/lib/api';

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerEmail: string;
  total: string;
  status: string;
  pdfUrl: string | null;
  order: {
    id: string;
    status: string;
    paymentStatus: string;
  };
}

export const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await getAllInvoices(1, 50);
      setInvoices(data.invoices);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al cargar facturas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async (orderId: string) => {
    try {
      setGenerating(orderId);
      await generateInvoiceAPI({ orderId });
      toast({
        title: 'Éxito',
        description: 'Factura generada exitosamente',
      });
      await loadInvoices();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al generar factura',
        variant: 'destructive',
      });
    } finally {
      setGenerating(null);
    }
  };

  const handleDownloadPDF = async (invoiceId: string, invoiceNumber: string) => {
    try {
      console.log('Downloading invoice:', { invoiceId, invoiceNumber });

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const token = getAuthToken();

      console.log('API URL:', API_BASE_URL);
      console.log('Has token:', !!token);

      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to download invoice: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log('Blob size:', blob.size, 'type:', blob.type);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Éxito',
        description: 'Factura descargada exitosamente',
      });
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al descargar factura',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="outline" className="bg-gray-100">Borrador</Badge>;
      case 'ISSUED':
        return <Badge variant="default" className="bg-blue-600">Emitida</Badge>;
      case 'PAID':
        return <Badge variant="default" className="bg-green-600">Pagada</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline">Pendiente</Badge>;
      case 'PAID':
        return <Badge variant="default" className="bg-green-600">Pagado</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Fallido</Badge>;
      case 'REFUNDED':
        return <Badge variant="secondary">Reembolsado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Facturas</CardTitle>
        <CardDescription>Gestionar facturas y facturación de clientes</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factura #</TableHead>
                  <TableHead>ID Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[150px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No se encontraron facturas
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-sm font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {invoice.order.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{invoice.customerName}</p>
                          <p className="text-xs text-muted-foreground">{invoice.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(invoice.invoiceDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${parseFloat(invoice.total).toFixed(2)}
                      </TableCell>
                      <TableCell>{getPaymentBadge(invoice.order.paymentStatus)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {invoice.pdfUrl ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadPDF(invoice.id, invoice.invoiceNumber)}
                              title="Descargar PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGenerateInvoice(invoice.order.id)}
                              disabled={generating === invoice.order.id}
                              title="Generar Factura"
                            >
                              {generating === invoice.order.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <FileCheck className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
