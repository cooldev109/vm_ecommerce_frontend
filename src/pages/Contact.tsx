import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { SEO } from '@/components/SEO';

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
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {t('contactUs')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('contactUsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle className="font-serif">{t('getInTouch')}</CardTitle>
                  <CardDescription>
                    {t('getInTouchDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent rounded-lg">
                      <Mail className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('email')}</h3>
                      <a
                        href="mailto:info@vymexperience.com"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        info@vymexperience.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent rounded-lg">
                      <Phone className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('phone')}</h3>
                      <a
                        href="tel:+56912345678"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        +56 9 1234 5678
                      </a>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/56992257712"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <div className="p-3 bg-accent rounded-lg">
                      <MessageCircle className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('whatsapp')}</h3>
                      <p className="text-sm text-muted-foreground">
                        +56 9 9225 7712
                      </p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent rounded-lg">
                      <MapPin className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('address')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('addressValue')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">{t('businessHours')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('mondayFriday')}</span>
                    <span className="font-medium">{t('timeMonFri')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('saturday')}</span>
                    <span className="font-medium">{t('timeSat')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('sunday')}</span>
                    <span className="font-medium">{t('closed')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Owner Profile & Social Media */}
            <div className="lg:col-span-2 space-y-6">
              {/* Owner Profile Card */}
              <Card className="card-luxury">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    {/* Owner Picture - Circular */}
                    <div className="relative mb-6">
                      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 p-1">
                        <div className="w-full h-full rounded-full bg-accent/20 flex items-center justify-center overflow-hidden">
                          {/* Placeholder - Replace with actual image */}
                          <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                            <span className="text-6xl font-serif text-white">V&M</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Owner Info */}
                    <h2 className="text-3xl font-serif font-bold mb-2">
                      V&M Candle Experience
                    </h2>
                    <p className="text-lg text-muted-foreground mb-4">
                      {t('founderArtisan')}
                    </p>
                    <p className="text-sm text-muted-foreground max-w-2xl mb-8">
                      {t('founderDesc')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info Card */}
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle className="font-serif">{t('whyChooseVM')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('naturalIngredients')}</h4>
                        <p className="text-muted-foreground">{t('naturalIngredientsDesc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('handcraftedQuality')}</h4>
                        <p className="text-muted-foreground">{t('handcraftedQualityDesc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('perfumeGradeFragrances')}</h4>
                        <p className="text-muted-foreground">{t('perfumeGradeFragrancesDesc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('wellnessRituals')}</h4>
                        <p className="text-muted-foreground">{t('wellnessRitualsDesc')}</p>
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
