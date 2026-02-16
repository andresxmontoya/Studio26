import { Calendar, Package, User, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { View } from '@/types';
import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  totalClasses: number;
}

export function Navigation({ currentView, onViewChange, totalClasses }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, toggleLocale, tr } = useI18n();

  const navItems: { view: View; label: string; icon: React.ElementType }[] = [
    { view: 'home', label: tr({ es: 'Inicio', en: 'Home' }), icon: Home },
    { view: 'schedule', label: tr({ es: 'Horario', en: 'Schedule' }), icon: Calendar },
    { view: 'packages', label: tr({ es: 'Paquetes', en: 'Packages' }), icon: Package },
    { view: 'my-bookings', label: tr({ es: 'Mis clases', en: 'My classes' }), icon: Calendar },
    { view: 'account', label: tr({ es: 'Cuenta', en: 'Account' }), icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onViewChange('home')}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft group-hover:shadow-soft-lg transition-shadow">
              <span className="text-foreground font-bold text-lg">26</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-xl tracking-wide text-foreground">STUDIO 26</h1>
              <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase -mt-1">Pilates</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onViewChange(item.view)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  currentView === item.view
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Classes Badge & Book Button */}
          <div className="flex items-center gap-3">
            {totalClasses > 0 && (
              <div className="hidden sm:flex items-center gap-2 bg-accent text-muted-foreground px-3 py-1.5 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse-soft"></span>
                {totalClasses === 999
                  ? tr({ es: 'Ilimitadas', en: 'Unlimited' })
                  : `${totalClasses} ${tr({ es: 'clases', en: 'classes' })}`}
              </div>
            )}
            <Button
              variant="outline"
              onClick={toggleLocale}
              className="hidden sm:inline-flex rounded-full px-3 h-9"
            >
              {locale.toUpperCase()}
            </Button>
            <Button
              onClick={() => onViewChange('schedule')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 rounded-full shadow-soft hover:shadow-soft-lg transition-all"
            >
              {tr({ es: 'Reservar', en: 'Book now' })}
            </Button>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  toggleLocale();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 text-muted-foreground hover:bg-accent"
              >
                {tr({ es: 'Idioma', en: 'Language' })}: {locale.toUpperCase()}
              </button>
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => {
                    onViewChange(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                    currentView === item.view
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
