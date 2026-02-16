import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Booking, ClassSession, UserPackage, User, View } from '@/types';
import { generateClassSessions, packages, currentUser } from '@/data/mockData';

const createStarterPackage = (userId: string): UserPackage => {
  const starterPlan = packages.find(p => p.id === 'monthly-unlimited') ?? packages[0];
  const purchaseDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(purchaseDate.getDate() + starterPlan.validityDays);

  return {
    id: 'starter-unlimited',
    userId,
    packageId: starterPlan.id,
    purchaseDate: purchaseDate.toISOString(),
    expiryDate: expiryDate.toISOString(),
    classesRemaining: starterPlan.classCount,
    classesUsed: 0,
    isActive: true,
    package: starterPlan,
  };
};

const INITIAL_USER_PACKAGES: UserPackage[] = [createStarterPackage(currentUser.id)];

export function useAppState() {
  const [view, setView] = useState<View>('home');
  const [user, setUser] = useState<User>({
    ...currentUser,
    activePackages: INITIAL_USER_PACKAGES,
  });
  const [classSessions, setClassSessions] = useState<ClassSession[]>(generateClassSessions());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userPackages, setUserPackages] = useState<UserPackage[]>(INITIAL_USER_PACKAGES);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Obtener clases disponibles para una fecha específica
  const getClassesForDate = useCallback((date: string): ClassSession[] => {
    return classSessions.filter(session => session.date === date);
  }, [classSessions]);

  // Verificar si el usuario tiene clases disponibles
  const hasAvailableClasses = useMemo(() => {
    if (userPackages.length === 0) return false;
    return userPackages.some(pkg => 
      pkg.isActive && 
      new Date(pkg.expiryDate) > new Date() && 
      (pkg.classesRemaining > 0 || pkg.package?.isUnlimited)
    );
  }, [userPackages]);

  // Obtener clases restantes totales
  const totalClassesRemaining = useMemo(() => {
    return userPackages
      .filter(pkg => pkg.isActive && new Date(pkg.expiryDate) > new Date())
      .reduce((sum, pkg) => sum + (pkg.package?.isUnlimited ? 999 : pkg.classesRemaining), 0);
  }, [userPackages]);

  const updateSessionCapacity = useCallback((sessionId: string, delta: number): ClassSession | null => {
    let updatedSession: ClassSession | null = null;

    setClassSessions(prev => prev.map(session => {
      if (session.id !== sessionId) return session;

      const nextBookedCount = Math.min(session.maxCapacity, Math.max(0, session.bookedCount + delta));
      const nextSession = {
        ...session,
        bookedCount: nextBookedCount,
        isFull: nextBookedCount >= session.maxCapacity,
      };

      updatedSession = nextSession;
      return nextSession;
    }));

    return updatedSession;
  }, []);

  // Agendar una clase
  const bookClass = useCallback((classSessionId: string): boolean => {
    const session = classSessions.find(s => s.id === classSessionId);
    if (!session || session.bookedCount >= session.maxCapacity || session.isFull) return false;

    // Verificar si ya está agendada
    const existingBooking = bookings.find(
      b => b.classSessionId === classSessionId && b.status === 'confirmed'
    );
    if (existingBooking) return false;

    // Buscar un paquete activo con clases disponibles
    const activePackage = userPackages.find(pkg => 
      pkg.isActive && 
      new Date(pkg.expiryDate) > new Date() && 
      (pkg.classesRemaining > 0 || pkg.package?.isUnlimited)
    );

    if (!activePackage && !hasAvailableClasses) return false;

    const updatedBookedCount = Math.min(session.maxCapacity, session.bookedCount + 1);
    const updatedSession: ClassSession = {
      ...session,
      bookedCount: updatedBookedCount,
      isFull: updatedBookedCount >= session.maxCapacity,
    };

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      userId: user.id,
      classSessionId,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      classSession: updatedSession
    };

    setClassSessions(prev => prev.map(s => (
      s.id === classSessionId ? updatedSession : s
    )));
    setBookings(prev => [...prev, newBooking]);

    // Descontar clase del paquete
    if (activePackage && !activePackage.package?.isUnlimited) {
      setUserPackages(prev => prev.map(pkg => 
        pkg.id === activePackage.id 
          ? { ...pkg, classesRemaining: pkg.classesRemaining - 1, classesUsed: pkg.classesUsed + 1 }
          : pkg
      ));
    }

    return true;
  }, [classSessions, bookings, userPackages, hasAvailableClasses, user.id]);

  // Cancelar una reserva
  const cancelBooking = useCallback((bookingId: string): boolean => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.status !== 'confirmed') return false;

    // Verificar que no sea menos de 12 horas antes
    const sessionDate = new Date(`${booking.classSession?.date}T${booking.classSession?.startTime}`);
    const now = new Date();
    const hoursDiff = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff < 12) {
      return false;
    }

    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    ));

    updateSessionCapacity(booking.classSessionId, -1);

    // Reembolsar clase al paquete
    const activePackage = userPackages.find(pkg => 
      pkg.isActive && 
      new Date(pkg.expiryDate) > new Date() &&
      !pkg.package?.isUnlimited
    );

    if (activePackage) {
      setUserPackages(prev => prev.map(pkg => 
        pkg.id === activePackage.id 
          ? { ...pkg, classesRemaining: pkg.classesRemaining + 1, classesUsed: Math.max(0, pkg.classesUsed - 1) }
          : pkg
      ));
    }

    return true;
  }, [bookings, userPackages, updateSessionCapacity]);

  // Mover/reprogramar una clase
  const moveBooking = useCallback((bookingId: string, newClassSessionId: string): boolean => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.status !== 'confirmed') return false;
    if (booking.classSessionId === newClassSessionId) return false;

    const newSession = classSessions.find(s => s.id === newClassSessionId);
    if (!newSession || newSession.bookedCount >= newSession.maxCapacity || newSession.isFull) return false;

    // Verificar que no sea menos de 12 horas antes de la clase original
    const originalSessionDate = new Date(`${booking.classSession?.date}T${booking.classSession?.startTime}`);
    const now = new Date();
    const hoursDiff = (originalSessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff < 12) {
      return false;
    }

    const updatedBookedCount = Math.min(newSession.maxCapacity, newSession.bookedCount + 1);
    const updatedNewSession: ClassSession = {
      ...newSession,
      bookedCount: updatedBookedCount,
      isFull: updatedBookedCount >= newSession.maxCapacity,
    };

    setClassSessions(prev => prev.map(session => {
      if (session.id === booking.classSessionId) {
        const nextBookedCount = Math.max(0, session.bookedCount - 1);
        return {
          ...session,
          bookedCount: nextBookedCount,
          isFull: nextBookedCount >= session.maxCapacity,
        };
      }

      if (session.id === newClassSessionId) {
        return updatedNewSession;
      }

      return session;
    }));

    setBookings(prev => prev.map(b => (
      b.id === bookingId
        ? {
            ...b,
            classSessionId: newClassSessionId,
            classSession: updatedNewSession,
            bookingDate: new Date().toISOString(),
          }
        : b
    )));

    return true;
  }, [bookings, classSessions]);

  // Comprar un paquete
  const purchasePackage = useCallback((packageId: string): boolean => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return false;

    const purchaseDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(purchaseDate.getDate() + pkg.validityDays);

    const newUserPackage: UserPackage = {
      id: `upkg-${Date.now()}`,
      userId: user.id,
      packageId,
      purchaseDate: purchaseDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      classesRemaining: pkg.classCount,
      classesUsed: 0,
      isActive: true,
      package: pkg
    };

    setUserPackages(prev => [...prev, newUserPackage]);
    
    // Actualizar usuario
    setUser(prev => ({
      ...prev,
      activePackages: [...prev.activePackages, newUserPackage]
    }));

    return true;
  }, [user.id]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const packageId = params.get('packageId');

    if (paymentStatus !== 'success' || !packageId) {
      return;
    }

    const paymentReference = params.get('session_id') ?? params.get('tx') ?? packageId;
    const processedKey = `studio26-payment-${paymentReference}`;

    if (!sessionStorage.getItem(processedKey)) {
      const wasPurchased = purchasePackage(packageId);
      if (wasPurchased) {
        sessionStorage.setItem(processedKey, '1');
      }
    }

    params.delete('payment');
    params.delete('packageId');
    params.delete('session_id');
    params.delete('tx');

    const query = params.toString();
    const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', cleanUrl);
  }, [purchasePackage]);

  // Obtener reservas confirmadas del usuario
  const confirmedBookings = useMemo(() => {
    return bookings
      .filter(b => b.status === 'confirmed')
      .sort((a, b) => {
        const dateA = new Date(`${a.classSession?.date}T${a.classSession?.startTime}`);
        const dateB = new Date(`${b.classSession?.date}T${b.classSession?.startTime}`);
        return dateA.getTime() - dateB.getTime();
      });
  }, [bookings]);

  // Obtener historial de reservas
  const bookingHistory = useMemo(() => {
    return bookings
      .filter(b => b.status !== 'confirmed')
      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
  }, [bookings]);

  return {
    view,
    setView,
    user,
    classSessions,
    bookings,
    userPackages,
    selectedDate,
    setSelectedDate,
    getClassesForDate,
    hasAvailableClasses,
    totalClassesRemaining,
    bookClass,
    cancelBooking,
    moveBooking,
    purchasePackage,
    confirmedBookings,
    bookingHistory,
    packages
  };
}
