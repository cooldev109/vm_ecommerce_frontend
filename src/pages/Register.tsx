import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.png';
import { toast } from 'sonner';
import { Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Password validation rules
const validatePassword = (password: string) => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

// Email validation
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Register = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const lang = language === 'es' ? 'es' : 'en';

  // Validation states
  const passwordValidation = useMemo(() => validatePassword(formData.password), [formData.password]);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isEmailValid = validateEmail(formData.email);
  const passwordsMatch = formData.password === formData.confirmPassword;

  // Field errors
  const errors = useMemo(() => ({
    firstName: touched.firstName && !formData.firstName.trim()
      ? (lang === 'es' ? 'Nombre es requerido' : 'First name is required')
      : null,
    lastName: touched.lastName && !formData.lastName.trim()
      ? (lang === 'es' ? 'Apellido es requerido' : 'Last name is required')
      : null,
    email: touched.email && formData.email && !isEmailValid
      ? (lang === 'es' ? 'Email inválido' : 'Invalid email format')
      : null,
    password: touched.password && formData.password && !isPasswordValid
      ? (lang === 'es' ? 'La contraseña no cumple los requisitos' : 'Password does not meet requirements')
      : null,
    confirmPassword: touched.confirmPassword && formData.confirmPassword && !passwordsMatch
      ? (lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match')
      : null,
  }), [touched, formData, isEmailValid, isPasswordValid, passwordsMatch, lang]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error(lang === 'es' ? 'Complete todos los campos' : 'Please fill all fields');
      return;
    }

    if (!isEmailValid) {
      toast.error(lang === 'es' ? 'Email inválido' : 'Invalid email format');
      return;
    }

    if (!isPasswordValid) {
      toast.error(lang === 'es' ? 'La contraseña no cumple los requisitos' : 'Password does not meet requirements');
      return;
    }

    if (!passwordsMatch) {
      toast.error(lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      toast.success(t('accountCreated') || 'Account created', {
        description: t('welcomeMessage') || 'Welcome to V&M Candle Experience!',
      });
      navigate('/home');
    } else {
      toast.error(t('registrationFailed') || 'Registration failed', {
        description: result.error || 'Please try again',
      });
    }
  };

  // Password requirement indicator component
  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={cn(
      "flex items-center gap-2 text-xs transition-colors",
      met ? "text-green-600" : "text-muted-foreground"
    )}>
      {met ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <X className="h-3 w-3 text-muted-foreground" />
      )}
      <span>{text}</span>
    </div>
  );

  // Error message component
  const FieldError = ({ error }: { error: string | null }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
        <AlertCircle className="h-3 w-3" />
        <span>{error}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center section-padding bg-gradient-warm">
      <div className="w-full max-w-md">
        <div className="card-luxury p-8 animate-fade-in">
          <div className="text-center mb-8">
            <img src={logo} alt="V&M" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              {t('register')}
            </h1>
            <p className="text-luxury">
              {t('joinCommunity')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{t('firstName')}</Label>
                <Input
                  id="firstName"
                  required
                  placeholder="María"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('firstName')}
                  className={cn(errors.firstName && "border-red-500 focus-visible:ring-red-500")}
                />
                <FieldError error={errors.firstName} />
              </div>
              <div>
                <Label htmlFor="lastName">{t('lastName')}</Label>
                <Input
                  id="lastName"
                  required
                  placeholder="González"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('lastName')}
                  className={cn(errors.lastName && "border-red-500 focus-visible:ring-red-500")}
                />
                <FieldError error={errors.lastName} />
              </div>
            </div>

            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")}
              />
              <FieldError error={errors.email} />
            </div>

            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                className={cn(
                  touched.password && formData.password && !isPasswordValid && "border-red-500 focus-visible:ring-red-500",
                  touched.password && formData.password && isPasswordValid && "border-green-500 focus-visible:ring-green-500"
                )}
              />

              {/* Password requirements checklist */}
              {(formData.password || touched.password) && (
                <div className="mt-2 p-3 bg-muted/50 rounded-lg space-y-1">
                  <p className="text-xs font-medium text-foreground mb-2">
                    {lang === 'es' ? 'Requisitos de contraseña:' : 'Password requirements:'}
                  </p>
                  <PasswordRequirement
                    met={passwordValidation.minLength}
                    text={lang === 'es' ? 'Mínimo 8 caracteres' : 'At least 8 characters'}
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasUppercase}
                    text={lang === 'es' ? 'Una letra mayúscula (A-Z)' : 'One uppercase letter (A-Z)'}
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasLowercase}
                    text={lang === 'es' ? 'Una letra minúscula (a-z)' : 'One lowercase letter (a-z)'}
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasNumber}
                    text={lang === 'es' ? 'Un número (0-9)' : 'One number (0-9)'}
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasSpecial}
                    text={lang === 'es' ? 'Un carácter especial (!@#$%^&*)' : 'One special character (!@#$%^&*)'}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmPassword')}
                className={cn(
                  touched.confirmPassword && formData.confirmPassword && !passwordsMatch && "border-red-500 focus-visible:ring-red-500",
                  touched.confirmPassword && formData.confirmPassword && passwordsMatch && formData.password && "border-green-500 focus-visible:ring-green-500"
                )}
              />
              {touched.confirmPassword && formData.confirmPassword && (
                <div className={cn(
                  "flex items-center gap-1 mt-1 text-xs",
                  passwordsMatch ? "text-green-600" : "text-red-600"
                )}>
                  {passwordsMatch ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>{lang === 'es' ? 'Las contraseñas coinciden' : 'Passwords match'}</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3" />
                      <span>{lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match'}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-start">
              <input type="checkbox" required className="mr-2 mt-1" />
              <span className="text-sm text-luxury">
                {t('acceptTerms')}{' '}
                <a href="#" className="text-accent hover:underline">
                  {t('termsAndConditions')}
                </a>{' '}
                {t('and')}{' '}
                <a href="#" className="text-accent hover:underline">
                  {t('privacyPolicy')}
                </a>
              </span>
            </div>

            <Button
              type="submit"
              className="btn-luxury w-full"
              disabled={loading}
            >
              {loading ? t('creatingAccount') : t('createAccount')}
            </Button>

            <div className="text-center">
              <p className="text-sm text-luxury">
                {t('haveAccount')}{' '}
                <Link to="/login" className="text-accent hover:underline font-medium">
                  {t('login')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
