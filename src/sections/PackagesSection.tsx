import { useState } from 'react';
import type { Package } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Check, Sparkles, Clock, Calendar, Star, CreditCard, Crown } from 'lucide-react';
import { getCheckoutUrlForPackage } from '@/lib/checkout';
import { useI18n } from '@/i18n/I18nProvider';

interface PackagesSectionProps {
  packages: Package[];
  onPurchase: (packageId: string) => boolean;
}

export function PackagesSection({ packages }: PackagesSectionProps) {
  const { tr } = useI18n();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string>('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const introOffers = packages.filter(p => p.isIntroOffer);
  const monthlyMemberships = packages.filter(p => p.isMonthly && !p.isIntroOffer);
  const classPackages = packages.filter(p => !p.isMonthly && !p.isIntroOffer);

  const handlePurchaseClick = (pkg: Package) => {
    setCheckoutError('');
    setSelectedPackage(pkg);
    setPurchaseDialogOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedPackage) {
      return;
    }

    const checkoutUrl = getCheckoutUrlForPackage(selectedPackage.id);
    if (!checkoutUrl) {
      setCheckoutError(tr({ es: 'Checkout no configurado. Agrega las URLs de pago en variables de entorno para activar cobro real.', en: 'Checkout not configured. Add payment URLs in environment variables to activate real checkout.' }));
      return;
    }

    setIsRedirecting(true);
    window.location.href = checkoutUrl;
  };

  const PackageCard = ({ pkg, featured = false }: { pkg: Package; featured?: boolean }) => (
    <Card className={`relative overflow-hidden transition-all duration-300 border-none ${
      featured 
        ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-soft-lg scale-105' 
        : 'bg-background/80 shadow-soft hover:shadow-soft-lg'
    }`}>
      {pkg.popular && (
        <div className="absolute top-0 right-0 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-bl-2xl flex items-center gap-1">
          <Crown className="w-3 h-3" />
          {tr({ es: 'Más popular', en: 'Most popular' })}
        </div>
      )}
      {pkg.isIntroOffer && (
        <div className="absolute top-0 right-0 bg-accent text-foreground text-xs font-semibold px-4 py-1.5 rounded-bl-2xl flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {tr({ es: 'Cliente nuevo', en: 'New client' })}
        </div>
      )}
      
      <CardHeader className="pb-4">
        <h3 className={`text-xl font-semibold ${featured ? 'text-primary-foreground' : 'text-foreground'}`}>
          {pkg.name}
        </h3>
        <p className={`text-sm mt-1 ${featured ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          {pkg.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="mb-6">
          <span className={`text-4xl font-bold ${featured ? 'text-primary-foreground' : 'text-foreground'}`}>
            ${pkg.price}
          </span>
          {pkg.isMonthly && <span className={featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>/month</span>}
        </div>

        <div className="space-y-3 mb-6">
          <div className={`flex items-center gap-2 text-sm ${featured ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${featured ? 'bg-white/20' : 'bg-accent'}`}>
              <Check className={`w-3 h-3 ${featured ? 'text-primary-foreground' : 'text-primary'}`} />
            </div>
            <span>
              {pkg.isUnlimited 
                ? tr({ es: 'Clases ilimitadas', en: 'Unlimited classes' })
                : `${pkg.classCount} ${pkg.classCount === 1 ? tr({ es: 'clase', en: 'class' }) : tr({ es: 'clases', en: 'classes' })}`
              }
            </span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${featured ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${featured ? 'bg-white/20' : 'bg-secondary'}`}>
              <Clock className={`w-3 h-3 ${featured ? 'text-primary-foreground' : 'text-primary'}`} />
            </div>
            <span>{tr({ es: 'Válido por', en: 'Valid for' })} {pkg.validityDays} {tr({ es: 'días', en: 'days' })}</span>
          </div>
          {pkg.isMonthly && (
            <div className={`flex items-center gap-2 text-sm ${featured ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${featured ? 'bg-white/20' : 'bg-muted'}`}>
                <Calendar className={`w-3 h-3 ${featured ? 'text-primary-foreground' : 'text-ring'}`} />
              </div>
              <span>{tr({ es: 'Renovación automática mensual', en: 'Auto-renews monthly' })}</span>
            </div>
          )}
        </div>

        <Button
          onClick={() => handlePurchaseClick(pkg)}
          className={`w-full font-medium py-3 rounded-full transition-all ${
            featured 
              ? 'bg-background text-foreground hover:bg-background/90 shadow-soft' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-soft-lg'
          }`}
        >
          {pkg.isIntroOffer ? tr({ es: 'Obtener oferta', en: 'Get this offer' }) : tr({ es: 'Comprar ahora', en: 'Buy now' })}
        </Button>

        <p className={`text-xs mt-3 text-center ${featured ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
          {tr({ es: 'Sujeto a términos y condiciones', en: 'Subject to terms and conditions' })}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-background/80 text-muted-foreground px-4 py-2 rounded-full text-sm mb-4 shadow-soft">
          <Star className="w-4 h-4 text-primary" />
          <span className="font-medium">{tr({ es: 'Planes de membresía', en: 'Membership plans' })}</span>
        </div>
        <h2 className="text-4xl sm:text-5xl text-foreground mb-4">
          {tr({ es: 'Elige tu plan', en: 'Choose your plan' })}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {tr({ es: 'Encuentra el paquete ideal para tu práctica de pilates. Desde clases sueltas hasta membresías ilimitadas.', en: 'Find the perfect package for your pilates practice. From single classes to unlimited memberships.' })}
        </p>
      </div>

      {/* Intro Offers */}
      {introOffers.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl text-foreground">{tr({ es: 'Ofertas de inicio', en: 'Intro offers' })}</h3>
              <p className="text-sm text-muted-foreground">{tr({ es: 'Perfectas para comenzar', en: 'Perfect to get started' })}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
            {introOffers.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      )}

      {/* Monthly Memberships */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
            <Crown className="w-5 h-5 text-ring" />
          </div>
          <div>
            <h3 className="text-2xl text-foreground">{tr({ es: 'Membresías mensuales', en: 'Monthly memberships' })}</h3>
            <p className="text-sm text-muted-foreground">{tr({ es: 'Mejor valor para práctica frecuente', en: 'Best value for regular practice' })}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {monthlyMemberships.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} featured={pkg.popular} />
          ))}
        </div>
      </div>

      {/* Class Packages */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl text-foreground">{tr({ es: 'Paquetes de clases', en: 'Class packages' })}</h3>
            <p className="text-sm text-muted-foreground">{tr({ es: 'Opciones flexibles, sin compromiso', en: 'Flexible options, no commitment' })}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {classPackages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-background/60 backdrop-blur-sm rounded-3xl p-10">
        <h3 className="text-2xl text-foreground mb-8 text-center">
          {tr({ es: 'Todos los paquetes incluyen', en: 'Every package includes' })}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Check, text: tr({ es: 'Acceso a todas las clases', en: 'Access to all classes' }), color: 'bg-accent', iconColor: 'text-primary' },
            { icon: Star, text: tr({ es: 'Instructora certificada', en: 'Certified instructor' }), color: 'bg-secondary', iconColor: 'text-primary' },
            { icon: Sparkles, text: tr({ es: 'Equipamiento premium', en: 'Premium equipment' }), color: 'bg-muted', iconColor: 'text-ring' },
            { icon: Calendar, text: tr({ es: 'Reserva fácil desde la app', en: 'Easy booking in app' }), color: 'bg-accent', iconColor: 'text-foreground' },
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
              </div>
              <span className="text-muted-foreground font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Dialog */}
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="max-w-md bg-background/95 backdrop-blur-sm rounded-3xl border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl text-foreground">{tr({ es: 'Confirmar compra', en: 'Confirm purchase' })}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {tr({ es: 'Revisa tu compra y continúa al pago seguro', en: 'Review your purchase and continue to secure checkout' })}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPackage && (
            <div className="mt-4">
              <div className="bg-secondary rounded-2xl p-5 mb-6">
                <h4 className="font-semibold text-foreground">{selectedPackage.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{selectedPackage.description}</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{tr({ es: 'Precio:', en: 'Price:' })}</span>
                    <span className="text-2xl font-bold text-foreground">${selectedPackage.price}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-muted-foreground">{tr({ es: 'Clases:', en: 'Classes:' })}</span>
                    <span className="font-medium text-foreground">
                      {selectedPackage.isUnlimited ? tr({ es: 'Ilimitadas', en: 'Unlimited' }) : selectedPackage.classCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-muted-foreground">{tr({ es: 'Vigencia:', en: 'Valid for:' })}</span>
                    <span className="font-medium text-foreground">{selectedPackage.validityDays} {tr({ es: 'días', en: 'days' })}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleConfirmPurchase}
                  disabled={isRedirecting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-full shadow-soft hover:shadow-soft-lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isRedirecting ? tr({ es: 'Redirigiendo…', en: 'Redirecting…' }) : tr({ es: 'Ir al pago', en: 'Proceed to payment' })}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPurchaseDialogOpen(false)}
                  className="w-full border-border text-muted-foreground hover:bg-secondary rounded-full"
                >
                  {tr({ es: 'Cancelar', en: 'Cancel' })}
                </Button>
              </div>

              {checkoutError && <p className="text-xs text-destructive text-center mt-4">{checkoutError}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
