import { useAppState } from '@/hooks/useAppState';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/sections/HeroSection';
import { TestimonialsSection } from '@/sections/TestimonialsSection';
import { ScheduleSection } from '@/sections/ScheduleSection';
import { PackagesSection } from '@/sections/PackagesSection';
import { MyBookingsSection } from '@/sections/MyBookingsSection';
import { AccountSection } from '@/sections/AccountSection';
import type { View } from '@/types';
import { useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

function App() {
  const { tr } = useI18n();
  const {
    view,
    setView,
    user,
    classSessions,
    bookings,
    userPackages,
    hasAvailableClasses,
    totalClassesRemaining,
    bookClass,
    cancelBooking,
    moveBooking,
    purchasePackage,
    confirmedBookings,
    bookingHistory,
    packages
  } = useAppState();

  // Listen for view change events from child components
  useEffect(() => {
    const handleChangeView = (e: Event) => {
      const customEvent = e as CustomEvent<View>;
      setView(customEvent.detail);
    };
    window.addEventListener('changeView', handleChangeView);
    return () => window.removeEventListener('changeView', handleChangeView);
  }, [setView]);

  const renderView = () => {
    switch (view) {
      case 'home':
        return (
          <>
            <HeroSection onViewChange={setView} />
            <TestimonialsSection />
          </>
        );
      
      case 'schedule':
        return (
          <ScheduleSection
            classSessions={classSessions}
            bookings={bookings}
            hasAvailableClasses={hasAvailableClasses}
            totalClassesRemaining={totalClassesRemaining}
            onBookClass={bookClass}
            onCancelBooking={cancelBooking}
            onMoveBooking={moveBooking}
          />
        );
      
      case 'packages':
        return (
          <PackagesSection
            packages={packages}
            onPurchase={purchasePackage}
          />
        );
      
      case 'my-bookings':
        return (
          <MyBookingsSection
            confirmedBookings={confirmedBookings}
            bookingHistory={bookingHistory}
            userPackages={userPackages}
            onCancelBooking={cancelBooking}
            onMoveBooking={moveBooking}
            classSessions={classSessions}
          />
        );
      
      case 'account':
        return (
          <AccountSection
            user={user}
            userPackages={userPackages}
          />
        );
      
      default:
        return (
          <>
            <HeroSection onViewChange={setView} />
            <TestimonialsSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation 
        currentView={view} 
        onViewChange={setView}
        totalClasses={totalClassesRemaining}
      />
      <main>
        {renderView()}
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary text-foreground py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-foreground font-bold text-xl">26</span>
                </div>
                <div>
                  <h3 className="font-semibold text-xl">STUDIO 26</h3>
                  <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Pilates</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {tr({
                  es: 'La experiencia moderna de pilates que transforma tu cuerpo y mente mediante movimiento consciente.',
                  en: 'The modern pilates experience that transforms your body and mind through mindful movement.',
                })}
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-6">{tr({ es: 'Enlaces rápidos', en: 'Quick links' })}</h4>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li><button onClick={() => setView('schedule')} className="hover:text-foreground transition-colors">{tr({ es: 'Reservar una clase', en: 'Book a class' })}</button></li>
                <li><button onClick={() => setView('packages')} className="hover:text-foreground transition-colors">{tr({ es: 'Paquetes', en: 'Packages' })}</button></li>
                <li><button onClick={() => setView('my-bookings')} className="hover:text-foreground transition-colors">{tr({ es: 'Mis clases', en: 'My classes' })}</button></li>
                <li><button onClick={() => setView('account')} className="hover:text-foreground transition-colors">{tr({ es: 'Mi cuenta', en: 'My account' })}</button></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="font-semibold text-lg mb-6">{tr({ es: 'Contacto', en: 'Contact' })}</h4>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li>hello@studio26pilates.com</li>
                <li>+1 (555) 123-4567</li>
                <li>{tr({ es: '123 Calle Bienestar', en: '123 Wellness Street' })}</li>
                <li>{tr({ es: 'Nueva York, NY 10001', en: 'New York, NY 10001' })}</li>
              </ul>
            </div>
            
            {/* Hours */}
            <div>
              <h4 className="font-semibold text-lg mb-6">{tr({ es: 'Horario del estudio', en: 'Studio hours' })}</h4>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li className="flex justify-between"><span>{tr({ es: 'Lun - Vie', en: 'Mon - Fri' })}</span> <span>6:00 AM - 9:00 PM</span></li>
                <li className="flex justify-between"><span>{tr({ es: 'Sábado', en: 'Saturday' })}</span> <span>7:00 AM - 2:00 PM</span></li>
                <li className="flex justify-between"><span>{tr({ es: 'Domingo', en: 'Sunday' })}</span> <span>{tr({ es: 'Cerrado', en: 'Closed' })}</span></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom */}
          <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">&copy; 2025 Studio 26 Pilates. {tr({ es: 'Todos los derechos reservados.', en: 'All rights reserved.' })}</p>
            <div className="flex gap-6 text-muted-foreground text-sm">
              <a href="#" className="hover:text-foreground transition-colors">{tr({ es: 'Política de privacidad', en: 'Privacy policy' })}</a>
              <a href="#" className="hover:text-foreground transition-colors">{tr({ es: 'Términos del servicio', en: 'Terms of service' })}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
