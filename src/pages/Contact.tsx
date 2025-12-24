import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { SEO } from '@/components/SEO';
import logo from '@/assets/logo.png';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title={t('contactSeoTitle')}
        description={t('contactSeoDesc')}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 mb-4">
              <Sparkles className="h-4 w-4 text-accent-foreground" />
              <span className="text-sm font-medium">{t('reachOut') || 'Reach Out'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 bg-clip-text text-transparent">
              {t('contactUs')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('contactUsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Methods */}
              <Card className="card-luxury hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="font-serif">{t('getInTouch')}</CardTitle>
                  <CardDescription>
                    {t('getInTouchDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Email */}
                  <a
                    href="mailto:info@vymexperience.com"
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/5 transition-colors group"
                  >
                    <div className="p-3 bg-accent rounded-lg group-hover:scale-110 transition-transform">
                      <Mail className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{t('email')}</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        info@vymexperience.com
                      </p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:+56912345678"
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/5 transition-colors group"
                  >
                    <div className="p-3 bg-accent rounded-lg group-hover:scale-110 transition-transform">
                      <Phone className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{t('phone')}</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        +56 9 1234 5678
                      </p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/56992257712"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/5 transition-colors group"
                  >
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:scale-110 transition-transform">
                      <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{t('whatsapp')}</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        +56 9 9225 7712
                      </p>
                    </div>
                  </a>

                  {/* Address */}
                  <div className="flex items-start gap-4 p-3">
                    <div className="p-3 bg-accent rounded-lg">
                      <MapPin className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{t('address')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('addressValue')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="card-luxury hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">{t('businessHours')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 rounded hover:bg-accent/5 transition-colors">
                    <span className="text-muted-foreground">{t('mondayFriday')}</span>
                    <span className="font-medium text-accent-foreground">{t('timeMonFri')}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded hover:bg-accent/5 transition-colors">
                    <span className="text-muted-foreground">{t('saturday')}</span>
                    <span className="font-medium">{t('timeSat')}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded hover:bg-accent/5 transition-colors">
                    <span className="text-muted-foreground">{t('sunday')}</span>
                    <span className="font-medium">{t('closed')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Brand Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Owner Profile Card */}
              <Card className="card-luxury hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    {/* Owner Picture - Circular */}
                    <div className="relative mb-6 animate-float">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black overflow-hidden bg-white">
                        <img
                          src={logo}
                          alt="V&M Candle Experience"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Owner Info */}
                    <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                      V&M Candle Experience
                    </h2>
                    <p className="text-lg text-muted-foreground mb-4">
                      {t('founderArtisan')}
                    </p>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                      {t('founderDesc')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose V&M */}
              <Card className="card-luxury hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="font-serif">{t('whyChooseVM')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/5 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('naturalIngredients')}</h4>
                        <p className="text-sm text-muted-foreground">{t('naturalIngredientsDesc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/5 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('handcraftedQuality')}</h4>
                        <p className="text-sm text-muted-foreground">{t('handcraftedQualityDesc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/5 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('perfumeGradeFragrances')}</h4>
                        <p className="text-sm text-muted-foreground">{t('perfumeGradeFragrancesDesc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/5 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('wellnessRituals')}</h4>
                        <p className="text-sm text-muted-foreground">{t('wellnessRitualsDesc')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
