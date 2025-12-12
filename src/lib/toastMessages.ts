import { toast } from 'sonner';

type Language = 'es' | 'en';

interface ToastMessages {
  es: string;
  en: string;
}

// Predefined toast messages
const messages = {
  // Cart
  addedToCart: {
    es: 'Agregado al carrito',
    en: 'Added to cart',
  },
  removedFromCart: {
    es: 'Eliminado del carrito',
    en: 'Removed from cart',
  },
  cartUpdated: {
    es: 'Carrito actualizado',
    en: 'Cart updated',
  },
  cartCleared: {
    es: 'Carrito vaciado',
    en: 'Cart cleared',
  },

  // Auth
  loginSuccess: {
    es: 'Inicio de sesión exitoso',
    en: 'Login successful',
  },
  loginFailed: {
    es: 'Error al iniciar sesión',
    en: 'Login failed',
  },
  logoutSuccess: {
    es: 'Sesión cerrada',
    en: 'Logged out successfully',
  },
  registerSuccess: {
    es: 'Registro exitoso',
    en: 'Registration successful',
  },
  registerFailed: {
    es: 'Error al registrarse',
    en: 'Registration failed',
  },

  // Orders
  orderPlaced: {
    es: 'Pedido realizado exitosamente',
    en: 'Order placed successfully',
  },
  orderFailed: {
    es: 'Error al procesar el pedido',
    en: 'Failed to process order',
  },
  paymentSuccess: {
    es: 'Pago exitoso',
    en: 'Payment successful',
  },
  paymentFailed: {
    es: 'Error en el pago',
    en: 'Payment failed',
  },

  // Subscription
  subscriptionActivated: {
    es: 'Suscripción activada',
    en: 'Subscription activated',
  },
  subscriptionCancelled: {
    es: 'Suscripción cancelada',
    en: 'Subscription cancelled',
  },
  subscriptionError: {
    es: 'Error con la suscripción',
    en: 'Subscription error',
  },

  // Audio
  audioAccessGranted: {
    es: 'Acceso al audio desbloqueado',
    en: 'Audio access unlocked',
  },
  audioAccessDenied: {
    es: 'Sin acceso al audio',
    en: 'Audio access denied',
  },
  invalidAccessKey: {
    es: 'Código de acceso inválido',
    en: 'Invalid access code',
  },
  accessKeyRedeemed: {
    es: 'Código canjeado exitosamente',
    en: 'Access code redeemed successfully',
  },

  // Profile
  profileUpdated: {
    es: 'Perfil actualizado',
    en: 'Profile updated',
  },
  profileUpdateFailed: {
    es: 'Error al actualizar perfil',
    en: 'Failed to update profile',
  },
  passwordChanged: {
    es: 'Contraseña cambiada',
    en: 'Password changed',
  },

  // Invoice
  invoiceGenerated: {
    es: 'Factura generada',
    en: 'Invoice generated',
  },
  invoiceFailed: {
    es: 'Error al generar factura',
    en: 'Failed to generate invoice',
  },

  // General
  success: {
    es: 'Operación exitosa',
    en: 'Operation successful',
  },
  error: {
    es: 'Ha ocurrido un error',
    en: 'An error occurred',
  },
  loading: {
    es: 'Cargando...',
    en: 'Loading...',
  },
  saved: {
    es: 'Guardado',
    en: 'Saved',
  },
  deleted: {
    es: 'Eliminado',
    en: 'Deleted',
  },
  copied: {
    es: 'Copiado al portapapeles',
    en: 'Copied to clipboard',
  },
  networkError: {
    es: 'Error de conexión',
    en: 'Network error',
  },
  sessionExpired: {
    es: 'Sesión expirada. Por favor inicia sesión nuevamente.',
    en: 'Session expired. Please log in again.',
  },
  unauthorized: {
    es: 'No autorizado',
    en: 'Unauthorized',
  },
  notFound: {
    es: 'No encontrado',
    en: 'Not found',
  },
};

type MessageKey = keyof typeof messages;

// Get current language from localStorage or default to 'es'
const getCurrentLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language');
    return stored === 'en' ? 'en' : 'es';
  }
  return 'es';
};

// Toast utility functions
export const showToast = {
  success: (messageKey: MessageKey | string, description?: string) => {
    const lang = getCurrentLanguage();
    const title = typeof messageKey === 'string' && messages[messageKey as MessageKey]
      ? messages[messageKey as MessageKey][lang]
      : messageKey;

    toast.success(title, { description });
  },

  error: (messageKey: MessageKey | string, description?: string) => {
    const lang = getCurrentLanguage();
    const title = typeof messageKey === 'string' && messages[messageKey as MessageKey]
      ? messages[messageKey as MessageKey][lang]
      : messageKey;

    toast.error(title, { description });
  },

  info: (messageKey: MessageKey | string, description?: string) => {
    const lang = getCurrentLanguage();
    const title = typeof messageKey === 'string' && messages[messageKey as MessageKey]
      ? messages[messageKey as MessageKey][lang]
      : messageKey;

    toast.info(title, { description });
  },

  warning: (messageKey: MessageKey | string, description?: string) => {
    const lang = getCurrentLanguage();
    const title = typeof messageKey === 'string' && messages[messageKey as MessageKey]
      ? messages[messageKey as MessageKey][lang]
      : messageKey;

    toast.warning(title, { description });
  },

  loading: (messageKey: MessageKey | string = 'loading') => {
    const lang = getCurrentLanguage();
    const title = messages[messageKey as MessageKey]?.[lang] || messageKey;
    return toast.loading(title);
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },

  promise: <T,>(
    promise: Promise<T>,
    msgs: {
      loading: MessageKey | string;
      success: MessageKey | string;
      error: MessageKey | string;
    }
  ) => {
    const lang = getCurrentLanguage();
    return toast.promise(promise, {
      loading: messages[msgs.loading as MessageKey]?.[lang] || msgs.loading,
      success: messages[msgs.success as MessageKey]?.[lang] || msgs.success,
      error: messages[msgs.error as MessageKey]?.[lang] || msgs.error,
    });
  },
};

// Get message by key
export const getMessage = (key: MessageKey, lang?: Language): string => {
  const language = lang || getCurrentLanguage();
  return messages[key][language];
};

// Custom bilingual toast
export const bilingualToast = {
  success: (messagesObj: ToastMessages, description?: ToastMessages) => {
    const lang = getCurrentLanguage();
    toast.success(messagesObj[lang], {
      description: description?.[lang],
    });
  },

  error: (messagesObj: ToastMessages, description?: ToastMessages) => {
    const lang = getCurrentLanguage();
    toast.error(messagesObj[lang], {
      description: description?.[lang],
    });
  },

  info: (messagesObj: ToastMessages, description?: ToastMessages) => {
    const lang = getCurrentLanguage();
    toast.info(messagesObj[lang], {
      description: description?.[lang],
    });
  },
};

export default showToast;
