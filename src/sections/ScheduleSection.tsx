import { useState, useMemo } from 'react';
import type { ClassSession, Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
import { Clock, User, CheckCircle, AlertCircle, Move, X, CalendarDays } from 'lucide-react';
import { instructors } from '@/data/mockData';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/I18nProvider';

interface ScheduleSectionProps {
  classSessions: ClassSession[];
  bookings: Booking[];
  hasAvailableClasses: boolean;
  totalClassesRemaining: number;
  onBookClass: (classSessionId: string) => boolean;
  onCancelBooking: (bookingId: string) => boolean;
  onMoveBooking: (bookingId: string, newClassSessionId: string) => boolean;
}

export function ScheduleSection({
  classSessions,
  bookings,
  hasAvailableClasses,
  totalClassesRemaining,
  onBookClass,
  onCancelBooking,
  onMoveBooking
}: ScheduleSectionProps) {
  const { tr, locale } = useI18n();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [bookingToMove, setBookingToMove] = useState<Booking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const weekDates = useMemo(() => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  const classesForDate = useMemo(() => {
    return classSessions.filter(session => session.date === selectedDate);
  }, [classSessions, selectedDate]);

  const isClassBooked = (classSessionId: string) => {
    return bookings.some(
      b => b.classSessionId === classSessionId && b.status === 'confirmed'
    );
  };

  const getBookingForClass = (classSessionId: string) => {
    return bookings.find(
      b => b.classSessionId === classSessionId && b.status === 'confirmed'
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = locale === 'es'
      ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = locale === 'es'
      ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      full: date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    };
  };

  const handleBook = (classSessionId: string) => {
    if (!hasAvailableClasses) {
      toast.error(tr({ es: 'Necesitas comprar un paquete de clases primero', en: 'You need to purchase a class package first' }));
      return;
    }

    const success = onBookClass(classSessionId);
    if (success) {
      toast.success(tr({ es: 'Clase reservada correctamente', en: 'Class booked successfully' }));
      return;
    }

    toast.error(tr({ es: 'No se pudo reservar esta clase. Prueba otro horario.', en: 'Unable to book this class. Try another time slot.' }));
  };

  const handleCancel = () => {
    if (!bookingToCancel) {
      return;
    }

    const success = onCancelBooking(bookingToCancel.id);
    if (success) {
      toast.success(tr({ es: 'Clase cancelada. Tu crédito fue reembolsado.', en: 'Class cancelled. Your credit has been refunded.' }));
      setBookingToCancel(null);
      return;
    }

    toast.error(tr({ es: 'No se pudo cancelar la clase (política de 12h o reserva inválida).', en: 'Unable to cancel this class (12h policy or invalid booking).' }));
    setBookingToCancel(null);
  };

  const handleMoveClick = (booking: Booking) => {
    setBookingToMove(booking);
    setMoveDialogOpen(true);
  };

  const handleMoveConfirm = (newClassSessionId: string) => {
    if (bookingToMove) {
      const success = onMoveBooking(bookingToMove.id, newClassSessionId);
      if (success) {
        toast.success(tr({ es: 'Clase reprogramada correctamente', en: 'Class moved successfully' }));
        setMoveDialogOpen(false);
        setBookingToMove(null);
        return;
      }

      toast.error(tr({ es: 'No se pudo mover la clase (política de 12h o cupo no disponible).', en: 'Unable to move class (12h policy or slot unavailable).' }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-background/80 text-muted-foreground px-4 py-2 rounded-full text-sm mb-4 shadow-soft">
          <CalendarDays className="w-4 h-4" />
          <span className="font-medium">{tr({ es: 'Horario de clases', en: 'Class schedule' })}</span>
        </div>
        <h2 className="text-4xl sm:text-5xl text-foreground mb-3">
          {tr({ es: 'Reserva tu sesión', en: 'Book your session' })}
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {tr({ es: 'Elige la fecha y hora que mejor te acomode. Cada clase dura 50 minutos de movimiento consciente.', en: 'Select a date and time that works for you. Each class is 50 minutes of mindful movement.' })}
        </p>
      </div>

      {/* Classes Alert */}
      {!hasAvailableClasses ? (
        <div className="mb-8 p-5 bg-secondary border border-border rounded-2xl flex items-center gap-4 text-muted-foreground">
          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-ring" />
          </div>
          <div>
            <p className="font-medium">{tr({ es: 'No tienes clases disponibles', en: 'No classes available' })}</p>
            <p className="text-sm">{tr({ es: 'Compra un paquete para comenzar a reservar', en: 'Purchase a package to start booking' })}</p>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-5 bg-accent border border-border rounded-2xl flex items-center gap-4 text-foreground">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <p className="font-medium">
            {tr({ es: 'Tienes', en: 'You have' })} {totalClassesRemaining === 999 ? tr({ es: 'clases ilimitadas', en: 'unlimited classes' }) : `${totalClassesRemaining} ${tr({ es: 'clases', en: 'classes' })}`} {tr({ es: 'disponibles', en: 'available' })}
          </p>
        </div>
      )}

      {/* Date Navigation */}
      <div className="mb-10">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {weekDates.map((date) => {
            const formatted = formatDate(date);
            const isSelected = date === selectedDate;
            const isToday = date === new Date().toISOString().split('T')[0];
            
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 w-20 h-28 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-soft-lg'
                    : 'bg-background text-muted-foreground hover:bg-secondary shadow-soft'
                }`}
              >
                <span className="text-xs font-medium uppercase tracking-wider">{formatted.day}</span>
                <span className="text-3xl font-semibold my-1">{formatted.date}</span>
                <span className="text-xs">{formatted.month}</span>
                {isToday && (
                  <span className={`text-[10px] mt-2 px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20' : 'bg-primary/10 text-foreground'
                  }`}>
                    {tr({ es: 'Hoy', en: 'Today' })}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date */}
      <div className="mb-8">
        <h3 className="text-2xl text-foreground">
          {formatDate(selectedDate).full}
        </h3>
        <p className="text-muted-foreground">{classesForDate.length} {tr({ es: 'clases disponibles', en: 'classes available' })}</p>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-4">
        {classesForDate.length === 0 ? (
          <div className="text-center py-20 bg-white/60 rounded-3xl">
            <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-primary" />
            </div>
            <p className="text-muted-foreground">{tr({ es: 'No hay clases disponibles para esta fecha', en: 'No classes available for this date' })}</p>
          </div>
        ) : (
          classesForDate.map((session) => {
            const instructor = instructors.find(i => i.id === session.instructorId);
            const isBooked = isClassBooked(session.id);
            const booking = getBookingForClass(session.id);
            const spotsLeft = session.maxCapacity - session.bookedCount;
            
            return (
              <Card 
                key={session.id} 
                className={`overflow-hidden transition-all duration-300 border-none shadow-soft hover:shadow-soft-lg ${
                  isBooked ? 'bg-accent' : 'bg-background/80'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-5">
                      <div className="text-center min-w-[80px] bg-secondary rounded-xl p-3">
                        <p className="text-xl font-semibold text-foreground">{session.startTime}</p>
                        <p className="text-sm text-muted-foreground">{session.endTime}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">Studio 26 Reformer</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <User className="w-4 h-4" />
                          <span>{instructor?.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{tr({ es: '50 minutos', en: '50 minutes' })}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        {session.isFull ? (
                          <span className="text-ring font-medium text-sm">{tr({ es: 'Clase llena', en: 'Class full' })}</span>
                        ) : (
                          <>
                            <span className={`font-medium text-sm ${spotsLeft <= 2 ? 'text-primary' : 'text-foreground'}`}>
                              {spotsLeft} {spotsLeft === 1 ? tr({ es: 'cupo', en: 'spot' }) : tr({ es: 'cupos', en: 'spots' })}
                            </span>
                            <p className="text-xs text-muted-foreground">{tr({ es: 'disponibles', en: 'available' })}</p>
                          </>
                        )}
                      </div>
                      
                      {isBooked && booking ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveClick(booking)}
                            className="border-primary text-foreground hover:bg-primary hover:text-primary-foreground rounded-full"
                          >
                            <Move className="w-4 h-4 mr-1" />
                            {tr({ es: 'Mover', en: 'Move' })}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setBookingToCancel(booking)}
                            className="border-ring text-ring hover:bg-secondary rounded-full"
                          >
                            <X className="w-4 h-4 mr-1" />
                            {tr({ es: 'Cancelar', en: 'Cancel' })}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleBook(session.id)}
                          disabled={session.isFull || !hasAvailableClasses}
                          className={`${
                            session.isFull || !hasAvailableClasses
                                ? 'bg-muted cursor-not-allowed'
                                : 'bg-primary hover:bg-primary/90'
                              } text-primary-foreground rounded-full px-6`}
                        >
                            {session.isFull ? tr({ es: 'Lleno', en: 'Full' }) : tr({ es: 'Reservar', en: 'Book' })}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Move Dialog */}
      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-sm rounded-3xl border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl text-foreground">{tr({ es: 'Mover clase', en: 'Move class' })}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {tr({ es: 'Selecciona un nuevo horario para tu clase del', en: 'Select a new time for your class on' })} {bookingToMove?.classSession && formatDate(bookingToMove.classSession.date).full}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground mb-4">{tr({ es: 'Clases disponibles para mover:', en: 'Available classes to move to:' })}</p>
            {classSessions
              .filter(s => 
                s.id !== bookingToMove?.classSessionId && 
                !s.isFull && 
                new Date(s.date + 'T' + s.startTime) > new Date()
              )
              .slice(0, 10)
              .map(session => {
                const instructor = instructors.find(i => i.id === session.instructorId);
                const formatted = formatDate(session.date);
                
                return (
                  <Card key={session.id} className="cursor-pointer hover:border-primary transition-all border-none shadow-soft hover:shadow-soft-lg bg-background/80">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[60px] bg-secondary rounded-xl p-2">
                            <p className="font-semibold text-foreground">{session.startTime}</p>
                            <p className="text-xs text-muted-foreground">{formatted.day} {formatted.date}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{instructor?.name}</p>
                            <p className="text-sm text-muted-foreground">{session.maxCapacity - session.bookedCount} {tr({ es: 'cupos', en: 'spots' })}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleMoveConfirm(session.id)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                        >
                          {tr({ es: 'Seleccionar', en: 'Select' })}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(bookingToCancel)} onOpenChange={(open) => !open && setBookingToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tr({ es: '¿Cancelar reserva de clase?', en: 'Cancel class booking?' })}</AlertDialogTitle>
            <AlertDialogDescription>
              {tr({ es: 'Esta acción cancelará tu reserva y reembolsará el crédito de clase cuando corresponda.', en: 'This action will cancel your reservation and refund the class credit if applicable.' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tr({ es: 'Mantener reserva', en: 'Keep booking' })}</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>{tr({ es: 'Confirmar cancelación', en: 'Confirm cancel' })}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
