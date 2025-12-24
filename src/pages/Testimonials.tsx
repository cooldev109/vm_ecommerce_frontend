import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  location: string;
  quote: string;
  rating: number;
  image: string;
  date: string;
}

const Testimonials = () => {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: language === 'es' ? 'Isabella Martínez' : 'Isabella Martinez',
      title: language === 'es' ? 'Directora Creativa' : 'Creative Director',
      location: 'Barcelona, Spain',
      quote: language === 'es'
        ? 'La experiencia V&M Candle transformó completamente mi rutina nocturna. Los aromas de lavanda y bergamota me transportan a un estado de calma profunda. La calidad es excepcional, verdaderamente un producto de lujo.'
        : 'The V&M Candle experience completely transformed my evening routine. The lavender and bergamot scents transport me to a state of deep calm. The quality is exceptional, truly a luxury product.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
      date: '2025-12-15',
    },
    {
      id: '2',
      name: language === 'es' ? 'Alexandre Dubois' : 'Alexandre Dubois',
      title: language === 'es' ? 'CEO & Fundador' : 'CEO & Founder',
      location: 'Paris, France',
      quote: language === 'es'
        ? 'Como ejecutivo, necesito productos que realmente funcionen. Estas velas aromáticas me ayudan a desconectar después de jornadas intensas. El diseño es elegante y los aromas son sofisticados. Una inversión en bienestar que vale cada centavo.'
        : 'As an executive, I need products that truly work. These aromatic candles help me disconnect after intense workdays. The design is elegant and the scents are sophisticated. An investment in wellbeing worth every penny.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      date: '2025-12-10',
    },
    {
      id: '3',
      name: language === 'es' ? 'Sofia Romano' : 'Sofia Romano',
      title: language === 'es' ? 'Arquitecta de Interiores' : 'Interior Architect',
      location: 'Milan, Italy',
      quote: language === 'es'
        ? 'La aromaterapia V&M no solo complementa mis diseños de interiores, sino que los eleva. Cada vela es una obra de arte que aporta calidez y elegancia a cualquier espacio. Mis clientes siempre preguntan por ellas.'
        : 'V&M aromatherapy not only complements my interior designs but elevates them. Each candle is a work of art that brings warmth and elegance to any space. My clients always ask about them.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80',
      date: '2025-12-05',
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextTestimonial, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      <SEO
        title={t('testimonialsSeoTitle')}
        description={t('testimonialsSeoDesc')}
      />

      {/* Luxury Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 via-orange-100/30 to-rose-100/50 dark:from-amber-900/20 dark:via-orange-900/10 dark:to-rose-900/20" />

        {/* Floating Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-delayed" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Luxury Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 dark:from-amber-900/50 dark:via-orange-900/50 dark:to-rose-900/50 border border-amber-200 dark:border-amber-800 shadow-xl mb-8 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-300 dark:to-rose-300 bg-clip-text text-transparent">
                {language === 'es' ? 'Experiencias de Lujo' : 'Luxury Experiences'}
              </span>
            </div>

            {/* Elegant Title */}
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-amber-900 via-orange-800 to-rose-900 dark:from-amber-200 dark:via-orange-200 dark:to-rose-200 bg-clip-text text-transparent leading-tight">
              {language === 'es' ? 'Voces de Excelencia' : 'Voices of Excellence'}
            </h1>

            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
              {language === 'es'
                ? 'Descubra por qué los profesionales más exigentes eligen V&M Candle para transformar sus espacios y elevar su bienestar'
                : 'Discover why the most discerning professionals choose V&M Candle to transform their spaces and elevate their wellbeing'}
            </p>
          </div>
        </div>
      </section>

      {/* Premium Testimonial Carousel */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
              {/* Luxury Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 opacity-20 dark:opacity-10" style={{ padding: '2px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image Side */}
                  <div className="relative h-96 md:h-[600px] overflow-hidden group">
                    <img
                      src={currentTestimonial.image}
                      alt={currentTestimonial.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Floating Badge */}
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white border-0 px-4 py-2 shadow-xl">
                        <Star className="w-4 h-4 mr-2 fill-current" />
                        {language === 'es' ? 'Cliente Premium' : 'Premium Client'}
                      </Badge>
                    </div>

                    {/* Client Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                        {currentTestimonial.name}
                      </h3>
                      <p className="text-amber-200 font-medium mb-1">
                        {currentTestimonial.title}
                      </p>
                      <p className="text-white/80 text-sm">
                        {currentTestimonial.location}
                      </p>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="p-8 md:p-12 flex flex-col justify-center relative">
                    {/* Decorative Quote Icon */}
                    <Quote className="w-16 h-16 text-amber-400/20 dark:text-amber-600/20 absolute top-8 right-8" />

                    {/* Star Rating */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-6 h-6 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    {/* Testimonial Quote */}
                    <blockquote className="text-xl md:text-2xl font-serif leading-relaxed text-gray-800 dark:text-gray-200 mb-8 italic">
                      "{currentTestimonial.quote}"
                    </blockquote>

                    {/* Date */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                      {new Date(currentTestimonial.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <Button
                          onClick={prevTestimonial}
                          variant="outline"
                          size="icon"
                          className="rounded-full w-12 h-12 border-2 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950 transition-all hover:scale-110 hover:shadow-lg hover:border-amber-400"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={nextTestimonial}
                          variant="outline"
                          size="icon"
                          className="rounded-full w-12 h-12 border-2 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950 transition-all hover:scale-110 hover:shadow-lg hover:border-amber-400"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Indicator Dots */}
                      <div className="flex gap-2">
                        {testimonials.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all duration-500 ${
                              index === currentIndex
                                ? 'w-8 bg-gradient-to-r from-amber-500 to-orange-500'
                                : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-amber-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Luxury Stats Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-amber-900 via-orange-900 to-rose-900 dark:from-amber-950 dark:via-orange-950 dark:to-rose-950 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTRoMnYtMmgtMnYyem0tMiAwdi0yaC0ydjJoMnptLTIgMmgydi0yaC0ydjJ6bTIgMnYyaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yLTJ2Mmgydi0yaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10,000+', label: language === 'es' ? 'Clientes Satisfechos' : 'Happy Clients' },
              { value: '98%', label: language === 'es' ? 'Índice de Satisfacción' : 'Satisfaction Rate' },
              { value: '50+', label: language === 'es' ? 'Países' : 'Countries' },
              { value: '5.0', label: language === 'es' ? 'Calificación Promedio' : 'Average Rating' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif">
                  {stat.value}
                </div>
                <div className="text-amber-200 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-amber-900 via-orange-800 to-rose-900 dark:from-amber-200 dark:via-orange-200 dark:to-rose-200 bg-clip-text text-transparent">
              {language === 'es' ? 'Únase a Nuestra Familia de Lujo' : 'Join Our Luxury Family'}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              {language === 'es'
                ? 'Experimente la excelencia que ha transformado miles de vidas alrededor del mundo'
                : 'Experience the excellence that has transformed thousands of lives around the world'}
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-700 hover:via-orange-700 hover:to-rose-700 text-white px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {language === 'es' ? 'Explorar Colección' : 'Explore Collection'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
