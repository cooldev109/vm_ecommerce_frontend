import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with V&M Candle Experience. We're here to help with any questions about our luxury candles."
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question or need assistance? We're here to help you with your luxury candle experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle className="font-serif">Get In Touch</CardTitle>
                  <CardDescription>
                    We'd love to hear from you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent rounded-lg">
                      <Mail className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href="mailto:info@vmcandles.com"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        info@vmcandles.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent rounded-lg">
                      <Phone className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a
                        href="tel:+56912345678"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        +56 9 1234 5678
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent rounded-lg">
                      <MessageCircle className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">WhatsApp</h3>
                      <a
                        href="https://wa.me/56912345678"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        +56 9 1234 5678
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent rounded-lg">
                      <MapPin className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-sm text-muted-foreground">
                        Santiago, Chile
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Business Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
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
                      Founder & Artisan
                    </p>
                    <p className="text-sm text-muted-foreground max-w-2xl mb-8">
                      Creating luxury handcrafted candles with pure essential oils and natural ingredients.
                      Each candle is a ritual of wellness, designed to elevate your senses and restore your soul.
                    </p>

                    {/* Social Media Links */}
                    <div className="space-y-4 w-full max-w-md">
                      <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Facebook */}
                        <a
                          href="https://facebook.com/vmcandles"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all duration-300"
                        >
                          <Facebook className="h-6 w-6 text-blue-600" />
                          <span className="font-medium">Facebook</span>
                        </a>

                        {/* Instagram */}
                        <a
                          href="https://instagram.com/vmcandles"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all duration-300"
                        >
                          <Instagram className="h-6 w-6 text-pink-600" />
                          <span className="font-medium">Instagram</span>
                        </a>

                        {/* Twitter */}
                        <a
                          href="https://twitter.com/vmcandles"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all duration-300"
                        >
                          <Twitter className="h-6 w-6 text-blue-400" />
                          <span className="font-medium">Twitter</span>
                        </a>

                        {/* WhatsApp */}
                        <a
                          href="https://wa.me/56912345678"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all duration-300"
                        >
                          <MessageCircle className="h-6 w-6 text-green-600" />
                          <span className="font-medium">WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info Card */}
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle className="font-serif">Why Choose V&M?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                      <div>
                        <h4 className="font-semibold mb-1">100% Natural Ingredients</h4>
                        <p className="text-muted-foreground">Plant-based waxes and pure essential oils</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                      <div>
                        <h4 className="font-semibold mb-1">Handcrafted Quality</h4>
                        <p className="text-muted-foreground">Small batches, artisan attention to detail</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                      <div>
                        <h4 className="font-semibold mb-1">Perfume-Grade Fragrances</h4>
                        <p className="text-muted-foreground">High aromatic concentration for luxury experience</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                      <div>
                        <h4 className="font-semibold mb-1">Wellness Rituals</h4>
                        <p className="text-muted-foreground">Designed for meditation and mindfulness</p>
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
