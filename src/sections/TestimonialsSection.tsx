import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Instagram, Heart } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

interface Testimonial {
  id: string;
  username: string;
  avatar: string;
  comment: string;
  rating: number;
  likes: number;
  date: string;
}

// Top 10 comentarios de Instagram - estilo estético
const testimonials: Testimonial[] = [
  {
    id: '1',
    username: 'sophia.wellness',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    comment: "Studio 26 transformó por completo mi relación con el fitness. La instructora es muy atenta y el espacio es absolutamente hermoso. Cada clase se siente como un ritual de autocuidado ✨",
    rating: 5,
    likes: 234,
    date: 'hace 2 semanas'
  },
  {
    id: '2',
    username: 'emma.fitness',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    comment: "¡La estética de este estudio no tiene comparación! Luz suave, colores calmados y reformers de primera calidad. Nunca me había sentido tan en paz durante un entrenamiento 🌸",
    rating: 5,
    likes: 189,
    date: 'hace 3 semanas'
  },
  {
    id: '3',
    username: 'lily.pilates',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    comment: "¡Por fin encontré mi lugar en pilates! Las clases de 50 minutos tienen el ritmo perfecto y siempre salgo más fuerte y centrada. La comunidad aquí es increíble 💕",
    rating: 5,
    likes: 156,
    date: 'hace 1 mes'
  },
  {
    id: '4',
    username: 'ava.movement',
    avatar: 'https://randomuser.me/api/portraits/women/53.jpg',
    comment: "¡Estoy obsesionada con el paquete mensual ilimitado! Es la mejor relación calidad-precio y la flexibilidad para reservar cualquier clase es increíble. Mi cuerpo nunca se había visto mejor 🦋",
    rating: 5,
    likes: 142,
    date: 'hace 1 mes'
  },
  {
    id: '5',
    username: 'mia.wellness',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    comment: "Aquí realmente se preocupan por tu técnica y tu progreso. Las clases de Natalia son mis favoritas: transmite mucha calma y da indicaciones excelentes 🌿",
    rating: 5,
    likes: 128,
    date: 'hace 2 meses'
  },
  {
    id: '6',
    username: 'zara.lifestyle',
    avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    comment: "Desde que entras, se siente una vibra zen. La atención al detalle en todo —desde la decoración hasta la estructura de las clases— es impecable 🕊️",
    rating: 5,
    likes: 115,
    date: 'hace 2 meses'
  },
  {
    id: '7',
    username: 'chloe.balance',
    avatar: 'https://randomuser.me/api/portraits/women/76.jpg',
    comment: "Como principiante, estaba nerviosa, pero todos me hicieron sentir bienvenida. La oferta de inicio es perfecta para probar. Ahora estoy enganchada y voy 4 veces por semana 💪",
    rating: 5,
    likes: 98,
    date: 'hace 3 meses'
  },
  {
    id: '8',
    username: 'grace.strength',
    avatar: 'https://randomuser.me/api/portraits/women/19.jpg',
    comment: "¡Las clases de reformer aquí están a otro nivel! He probado muchos estudios y Studio 26 es, por lejos, el mejor. El equipamiento está impecable y las playlists son 🔥",
    rating: 5,
    likes: 87,
    date: 'hace 3 meses'
  },
  {
    id: '9',
    username: 'isla.mindful',
    avatar: 'https://randomuser.me/api/portraits/women/64.jpg',
    comment: "Este estudio es mi lugar feliz. La combinación de entrenamientos desafiantes y un ambiente tranquilo es exactamente lo que necesitaba. ¡Lo recomiendo muchísimo! 🌟",
    rating: 5,
    likes: 76,
    date: 'hace 4 meses'
  },
  {
    id: '10',
    username: 'ruby.flow',
    avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
    comment: "La app de reservas hace todo muy fácil y los recordatorios me salvan. Me encanta poder cancelar hasta 12 horas antes sin perder mi clase 🙏",
    rating: 5,
    likes: 65,
    date: 'hace 4 meses'
  }
];

export function TestimonialsSection() {
  const { tr } = useI18n();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const fallbackAvatar = '/avatar-placeholder.svg';

  const selectedTestimonial = testimonials[selectedIndex];

  const reelItems = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-background/80 text-muted-foreground px-4 py-2 rounded-full text-sm mb-6 shadow-soft">
            <Instagram className="w-4 h-4" />
            <span className="font-medium">@studio26pilates</span>
          </div>
          <h2 className="text-4xl sm:text-5xl text-foreground mb-4">
            {tr({ es: 'Lo que dice nuestra comunidad', en: 'What our community says' })}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tr({
              es: 'Historias reales de nuestra comunidad en Instagram. Únete a miles de miembros que encontraron su equilibrio en Studio 26.',
              en: 'Real stories from our Instagram family. Join thousands of members who found their balance at Studio 26.',
            })}
          </p>
        </div>

        {/* Clients Reel */}
        <div className="mb-10">
          <div className="overflow-hidden py-1">
            <div className="flex w-max gap-3 sm:gap-5 animate-testimonials-marquee">
            {reelItems.map((testimonial, renderIndex) => {
              const originalIndex = renderIndex % testimonials.length;
              const isSelected = originalIndex === selectedIndex;

              return (
                <button
                  key={`${testimonial.id}-${renderIndex}`}
                  onClick={() => setSelectedIndex(originalIndex)}
                  className={`relative shrink-0 w-[160px] sm:w-[220px] h-[280px] sm:h-[420px] rounded-3xl overflow-hidden transition-all focus:outline-none ${
                    isSelected
                      ? 'ring-2 ring-primary'
                      : 'ring-1 ring-border/40 hover:ring-primary/50'
                  }`}
                >
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.username}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      const target = event.currentTarget;
                      if (target.dataset.fallbackApplied !== 'true') {
                        target.dataset.fallbackApplied = 'true';
                        target.src = fallbackAvatar;
                      }
                    }}
                  />
                  <div className={`absolute top-3 right-3 w-3 h-3 rounded-full border border-white/70 ${isSelected ? 'bg-white' : 'bg-white/40'}`} />
                </button>
              );
            })}
            </div>
          </div>
        </div>

        {/* Selected Client Experience */}
        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-soft mb-12 max-w-4xl mx-auto">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-foreground text-lg">@{selectedTestimonial.username}</p>
                <p className="text-sm text-muted-foreground">{selectedTestimonial.date}</p>
              </div>
              <div className="flex items-center gap-1 text-primary">
                {[...Array(selectedTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
              "{selectedTestimonial.comment}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-ring">
                <Heart className="w-4 h-4 fill-current" />
                <span className="text-sm">{selectedTestimonial.likes} {tr({ es: 'me gusta', en: 'likes' })}</span>
              </div>
              <span className="text-xs text-muted-foreground">{tr({ es: 'Miembro verificado', en: 'Verified member' })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Instagram CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">{tr({ es: 'Comparte tu camino en Studio 26', en: 'Share your Studio 26 journey' })}</p>
          <a 
            href="https://instagram.com/studio26pilates" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-full shadow-soft hover:shadow-soft-lg transition-all"
          >
            <Instagram className="w-5 h-5" />
            <span className="font-medium">{tr({ es: 'Sigue a @studio26pilates', en: 'Follow @studio26pilates' })}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
