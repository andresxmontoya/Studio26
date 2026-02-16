import { Button } from '@/components/ui/button';
import type { View } from '@/types';
import { ArrowRight, Sparkles, Heart, Clock, Users } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

interface HeroSectionProps {
  onViewChange: (view: View) => void;
}

export function HeroSection({ onViewChange }: HeroSectionProps) {
  const { tr } = useI18n();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-aesthetic">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent rounded-full blur-3xl opacity-60"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-muted rounded-full blur-3xl opacity-40"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm text-muted-foreground px-4 py-2 rounded-full text-sm mb-8 shadow-soft">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-medium">{tr({ es: 'La experiencia #1 en pilates', en: 'The #1 pilates experience' })}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-6">
              {tr({ es: 'Encuentra tu', en: 'Find your' })}
              <span className="block text-gradient italic">{tr({ es: 'equilibrio interior', en: 'inner balance' })}</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
              {tr({
                es: '50 minutos de movimiento consciente. Transformación de cuerpo completo. Descubre el enfoque estético del pilates moderno.',
                en: '50 minutes of mindful movement. Full body transformation. Discover the aesthetic approach to modern pilates.',
              })}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-10">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-soft">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-foreground">50</p>
                  <p className="text-xs text-muted-foreground">{tr({ es: 'Minutos', en: 'Minutes' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-soft">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-foreground">8</p>
                  <p className="text-xs text-muted-foreground">{tr({ es: 'Por clase', en: 'Per class' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-soft">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-ring" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-foreground">4.9</p>
                  <p className="text-xs text-muted-foreground">{tr({ es: 'Valoración', en: 'Rating' })}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Button
                onClick={() => onViewChange('schedule')}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-6 text-lg rounded-full shadow-soft hover:shadow-soft-lg transition-all"
              >
                {tr({ es: 'Reservar una clase', en: 'Book a class' })}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => onViewChange('packages')}
                size="lg"
                variant="outline"
                className="border-primary text-foreground hover:bg-primary hover:text-primary-foreground font-medium px-8 py-6 text-lg rounded-full transition-all"
              >
                {tr({ es: 'Ver paquetes', en: 'View packages' })}
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative">
              <div className="relative rounded-[2rem] overflow-hidden shadow-soft-lg">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80"
                  alt="Pilates Studio"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 to-transparent"></div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-soft-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{tr({ es: 'Únete a +2,000', en: 'Join 2,000+' })}</p>
                    <p className="text-sm text-muted-foreground">{tr({ es: 'Miembros felices', en: 'Happy members' })}</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-primary/40 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground tracking-wider uppercase">{tr({ es: 'Desliza para explorar', en: 'Scroll to explore' })}</span>
        <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
