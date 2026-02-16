import { useState } from 'react';
import type { Booking, UserPackage } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Calendar, Clock, User, XCircle, AlertCircle, Package, ChevronRight, Heart } from 'lucide-react';
import { instructors } from '@/data/mockData';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/I18nProvider';

interface MyBookingsSectionProps {
  confirmedBookings: Booking[];
  bookingHistory: Booking[];
  userPackages: UserPackage[];
  onCancelBooking: (bookingId: string) => boolean;
  onMoveBooking: (bookingId: string, newClassSessionId: string) => boolean;
  classSessions: import('@/types').ClassSession[];
}

export function MyBookingsSection({
  confirmedBookings,
  bookingHistory,
  userPackages,
  onCancelBooking
}: MyBookingsSectionProps) {
  const { tr, locale } = useI18n();
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  
  const formatTime = (timeStr: string) => timeStr;

  const getDaysUntil = (dateStr: string, timeStr: string) => {
    const sessionDate = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    const diffMs = sessionDate.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 0) return tr({ es: 'Pasada', en: 'Past' });
    if (diffHours < 24) return locale === 'es' ? `En ${diffHours} horas` : `In ${diffHours} hours`;
    return locale === 'es' ? `En ${diffDays} días` : `In ${diffDays} days`;
  };

  const canCancel = (dateStr: string, timeStr: string) => {
    const sessionDate = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    const diffHours = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 12;
  };

  const handleCancel = (booking: Booking) => {
    const session = booking.classSession;
    if (!session) {
      toast.error(tr({ es: 'No se pudo cancelar la reserva', en: 'Unable to cancel booking' }));
      return;
    }

    const { date, startTime } = session;

    if (!canCancel(date, startTime)) {
      toast.warning(tr({ es: 'No puedes cancelar con menos de 12 horas de anticipación', en: 'You cannot cancel with less than 12 hours notice' }));
      return;
    }

    const success = onCancelBooking(booking.id);
    if (success) {
      toast.success(tr({ es: 'Clase cancelada correctamente', en: 'Class cancelled successfully' }));
      setBookingToCancel(null);
      return;
    }

    toast.error(tr({ es: 'No se pudo cancelar esta reserva.', en: 'Unable to cancel this booking.' }));
    setBookingToCancel(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-white/80 text-[#8b7355] px-4 py-2 rounded-full text-sm mb-4 shadow-soft">
          <Heart className="w-4 h-4 text-[#c9a8c5]" />
          <span className="font-medium">{tr({ es: 'Mi Studio', en: 'My Studio' })}</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl text-[#5c4a3d] mb-3">
          {tr({ es: 'Mis clases', en: 'My classes' })}
        </h2>
        <p className="text-[#8b7355] max-w-xl mx-auto">
          {tr({ es: 'Gestiona tus reservas y sigue tu progreso en pilates', en: 'Manage your bookings and track your pilates journey' })}
        </p>
      </div>

      {/* Active Packages */}
      {userPackages.length > 0 && (
        <div className="mb-10">
          <h3 className="font-serif text-xl text-[#5c4a3d] mb-5 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#f5e8e8] rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-[#d4a574]" />
            </div>
            {tr({ es: 'Tus paquetes activos', en: 'Your active packages' })}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {userPackages.filter(pkg => pkg.isActive).map(pkg => (
              <Card key={pkg.id} className="bg-gradient-to-br from-[#d4a574] to-[#c49a6c] border-none shadow-soft-lg">
                <CardContent className="p-6 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-serif font-semibold">{pkg.package?.name}</p>
                      <p className="text-sm text-white/70">
                        {tr({ es: 'Comprado', en: 'Purchased' })} {new Date(pkg.purchaseDate).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="font-serif text-4xl font-bold">
                          {pkg.package?.isUnlimited ? '∞' : pkg.classesRemaining}
                        </p>
                        <p className="text-sm text-white/70">
                          {pkg.package?.isUnlimited ? tr({ es: 'Ilimitadas', en: 'Unlimited' }) : tr({ es: 'clases restantes', en: 'classes left' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/70">{tr({ es: 'Vence', en: 'Expires' })}</p>
                        <p className="font-medium">{new Date(pkg.expiryDate).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/20">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all"
                        style={{ 
                          width: pkg.package?.isUnlimited 
                            ? '100%' 
                            : `${(pkg.classesUsed / (pkg.classesUsed + pkg.classesRemaining)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-white/70 mt-2">
                      {pkg.classesUsed} {pkg.classesUsed === 1 ? tr({ es: 'clase usada', en: 'class used' }) : tr({ es: 'clases usadas', en: 'classes used' })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-8 bg-white/60 p-1 rounded-full">
          <TabsTrigger value="upcoming" className="rounded-full data-[state=active]:bg-[#d4a574] data-[state=active]:text-white">
            <Calendar className="w-4 h-4 mr-2" />
            {tr({ es: 'Próximas', en: 'Upcoming' })}
            {confirmedBookings.length > 0 && (
              <span className="ml-2 bg-[#d4a574]/20 text-[#d4a574] text-xs px-2 py-0.5 rounded-full">
                {confirmedBookings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-full data-[state=active]:bg-[#d4a574] data-[state=active]:text-white">
            <Clock className="w-4 h-4 mr-2" />
            {tr({ es: 'Historial', en: 'History' })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {confirmedBookings.length === 0 ? (
            <div className="text-center py-20 bg-white/60 rounded-3xl">
              <div className="w-20 h-20 bg-[#f5f0e8] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-[#d4a574]" />
              </div>
              <h3 className="font-serif text-xl text-[#5c4a3d] mb-2">{tr({ es: 'No tienes clases programadas', en: 'No classes scheduled' })}</h3>
              <p className="text-[#8b7355] mb-6">{tr({ es: 'Reserva tu primera clase y comienza tu camino', en: 'Book your first class and start your journey' })}</p>
              <Button 
                onClick={() => window.dispatchEvent(new CustomEvent('changeView', { detail: 'schedule' }))}
                className="bg-[#d4a574] hover:bg-[#c49a6c] text-white rounded-full px-6"
              >
                {tr({ es: 'Ver horario', en: 'View schedule' })}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {confirmedBookings.map((booking) => {
                const session = booking.classSession;
                if (!session) return null;
                
                const instructor = instructors.find(i => i.id === session.instructorId);
                const canCancelBooking = canCancel(session.date, session.startTime);
                const timeUntil = getDaysUntil(session.date, session.startTime);
                
                return (
                  <Card key={booking.id} className="overflow-hidden border-l-4 border-l-[#d4a574] border-none shadow-soft hover:shadow-soft-lg transition-all bg-white/80">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-5">
                          <div className="bg-[#f5e8e8] rounded-xl p-4 text-center min-w-[80px]">
                            <p className="font-serif text-2xl font-bold text-[#d4a574]">
                              {new Date(session.date).getDate()}
                            </p>
                            <p className="text-sm text-[#d4a574] uppercase">
                              {new Date(session.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { month: 'short' })}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-serif text-lg font-semibold text-[#5c4a3d]">
                              Studio 26 Reformer
                            </h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-[#8b7355]">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatTime(session.startTime)} - {formatTime(session.endTime)}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {instructor?.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <span className={`text-xs px-3 py-1 rounded-full ${
                                timeUntil === tr({ es: 'Pasada', en: 'Past' })
                                  ? 'bg-[#f0f0f0] text-[#8b7355]' 
                                  : 'bg-[#e8f0e8] text-[#5a7a5a]'
                              }`}>
                                {timeUntil}
                              </span>
                              <span className="text-xs px-3 py-1 rounded-full bg-[#f5e8e8] text-[#d4a574]">
                                {tr({ es: 'Confirmada', en: 'Confirmed' })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {!canCancelBooking && timeUntil !== tr({ es: 'Pasada', en: 'Past' }) && (
                            <div className="flex items-center gap-2 text-[#d4a574] text-sm bg-[#faf5f5] px-3 py-2 rounded-full">
                              <AlertCircle className="w-4 h-4" />
                              <span>{tr({ es: 'No se puede cancelar', en: 'Cannot cancel' })}</span>
                            </div>
                          )}
                          {canCancelBooking && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setBookingToCancel(booking)}
                              className="border-[#e8d5d5] text-[#c9a8a8] hover:bg-[#faf5f5] rounded-full"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              {tr({ es: 'Cancelar', en: 'Cancel' })}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {bookingHistory.length === 0 ? (
            <div className="text-center py-20 bg-white/60 rounded-3xl">
              <div className="w-20 h-20 bg-[#f5f0e8] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-[#d4a574]" />
              </div>
              <h3 className="font-serif text-xl text-[#5c4a3d] mb-2">{tr({ es: 'Aún no hay historial', en: 'No history yet' })}</h3>
              <p className="text-[#8b7355]">{tr({ es: 'Tus clases completadas aparecerán aquí', en: 'Your completed classes will appear here' })}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookingHistory.map((booking) => {
                const session = booking.classSession;
                if (!session) return null;
                
                const instructor = instructors.find(i => i.id === session.instructorId);
                
                return (
                  <Card key={booking.id} className="overflow-hidden opacity-70 border-none shadow-soft bg-white/60">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-5">
                        <div className="bg-[#f0f0f0] rounded-xl p-4 text-center min-w-[80px]">
                          <p className="font-serif text-2xl font-bold text-[#8b7355]">
                            {new Date(session.date).getDate()}
                          </p>
                          <p className="text-sm text-[#a08060] uppercase">
                            {new Date(session.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { month: 'short' })}
                          </p>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-serif text-lg font-semibold text-[#5c4a3d]">
                              Studio 26 Reformer
                            </h4>
                            <span className={`text-xs px-3 py-1 rounded-full ${
                              booking.status === 'cancelled' 
                                ? 'bg-[#faf5f5] text-[#c9a8a8]' 
                                : 'bg-[#e8f0e8] text-[#5a7a5a]'
                            }`}>
                              {booking.status === 'cancelled'
                                ? tr({ es: 'Cancelada', en: 'Cancelled' })
                                : tr({ es: 'Completada', en: 'Completed' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-[#8b7355]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {instructor?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={Boolean(bookingToCancel)} onOpenChange={(open) => !open && setBookingToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tr({ es: '¿Cancelar reserva de clase?', en: 'Cancel class booking?' })}</AlertDialogTitle>
            <AlertDialogDescription>
              {tr({ es: 'Solo puedes cancelar con más de 12 horas de anticipación. Esto reembolsará tu crédito cuando corresponda.', en: 'You can only cancel with 12+ hours notice. This will refund your class credit when applicable.' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tr({ es: 'Mantener reserva', en: 'Keep booking' })}</AlertDialogCancel>
            <AlertDialogAction onClick={() => bookingToCancel && handleCancel(bookingToCancel)}>{tr({ es: 'Confirmar cancelación', en: 'Confirm cancel' })}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
