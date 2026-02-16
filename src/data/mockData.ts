import type { ClassType, Instructor, ClassSession, Package, User } from '@/types';

export const classTypes: ClassType[] = [
  {
    id: 'reformer',
    name: 'Studio 26 Reformer',
    duration: 50,
    description: 'Our signature high-intensity pilates reformer method',
    color: '#4a6fa5'
  },
  {
    id: 'cardio',
    name: 'Studio 26 Cardio',
    duration: 50,
    description: 'Combines pilates with cardiovascular exercise for maximum calorie burn',
    color: '#5a7fb5'
  },
  {
    id: 'strength',
    name: 'Studio 26 Strength',
    duration: 50,
    description: 'Focused on building strength and muscle toning',
    color: '#6a8fc5'
  }
];

export const instructors: Instructor[] = [
  { id: 'natalia-assouline', name: 'Natalia Assouline', image: '/instructors/natalia.jpg' }
];

// Generate classes for the next 2 weeks
export const generateClassSessions = (): ClassSession[] => {
  const sessions: ClassSession[] = [];
  const today = new Date();
  const classType = classTypes[0]; // Studio 26 Reformer
  const instructorId = instructors[0].id;
  const availableTimeSlots = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '17:00', '18:00', '19:00'];
  
  // Generate for the next 14 days
  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    
    // Monday to Saturday only
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) continue; // Sunday closed
    
    availableTimeSlots.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const endHours = hours + Math.floor((minutes + 50) / 60);
      const endMinutes = (minutes + 50) % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

      const maxCapacity = 8;
      const bookedCount = Math.floor(Math.random() * 4);

      sessions.push({
        id: `${dateStr}-${time}-${instructorId}`,
        classTypeId: classType.id,
        instructorId,
        date: dateStr,
        startTime: time,
        endTime,
        maxCapacity,
        bookedCount,
        isFull: bookedCount >= maxCapacity
      });
    });
  }
  
  return sessions.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });
};

export const packages: Package[] = [
  // Intro Offers
  {
    id: 'intro-single',
    name: 'Oferta inicio clase individual',
    description: 'Perfecta para probar nuestra experiencia por primera vez',
    classCount: 1,
    price: 19,
    validityDays: 30,
    isIntroOffer: true,
    isMonthly: false,
    isUnlimited: false
  },
  {
    id: 'intro-3pack',
    name: 'Oferta inicio - paquete de 3 clases',
    description: 'La mejor forma de vivir el método Studio 26',
    classCount: 3,
    price: 62,
    validityDays: 30,
    isIntroOffer: true,
    isMonthly: false,
    isUnlimited: false
  },
  // Monthly Memberships
  {
    id: 'monthly-4',
    name: '4 clases mensuales',
    description: '4 clases al mes con renovación automática',
    classCount: 4,
    price: 99,
    validityDays: 30,
    isIntroOffer: false,
    isMonthly: true,
    isUnlimited: false
  },
  {
    id: 'monthly-8',
    name: '8 clases mensuales',
    description: '8 clases al mes con renovación automática',
    classCount: 8,
    price: 189,
    validityDays: 30,
    isIntroOffer: false,
    isMonthly: true,
    isUnlimited: false
  },
  {
    id: 'monthly-12',
    name: '12 clases mensuales',
    description: '12 clases al mes con renovación automática',
    classCount: 12,
    price: 229,
    validityDays: 30,
    isIntroOffer: false,
    isMonthly: true,
    isUnlimited: false
  },
  {
    id: 'monthly-unlimited',
    name: 'Mensual ilimitado',
    description: 'Clases ilimitadas durante todo el mes',
    classCount: 999,
    price: 279,
    validityDays: 30,
    isIntroOffer: false,
    isMonthly: true,
    isUnlimited: true,
    popular: true
  },
  // Class Packages
  {
    id: 'pack-single',
    name: 'Clase individual',
    description: 'Una clase individual sin compromiso',
    classCount: 1,
    price: 35,
    validityDays: 30,
    isIntroOffer: false,
    isMonthly: false,
    isUnlimited: false
  },
  {
    id: 'pack-5',
    name: 'Paquete de 5 clases',
    description: 'Paquete de 5 clases',
    classCount: 5,
    price: 139,
    validityDays: 60,
    isIntroOffer: false,
    isMonthly: false,
    isUnlimited: false
  },
  {
    id: 'pack-10',
    name: 'Paquete de 10 clases',
    description: 'Paquete de 10 clases',
    classCount: 10,
    price: 290,
    validityDays: 180,
    isIntroOffer: false,
    isMonthly: false,
    isUnlimited: false
  },
  {
    id: 'pack-20',
    name: 'Paquete de 20 clases',
    description: 'Paquete de 20 clases - Mejor valor',
    classCount: 20,
    price: 499,
    validityDays: 180,
    isIntroOffer: false,
    isMonthly: false,
    isUnlimited: false
  }
];

export const currentUser: User = {
  id: 'user-1',
  name: 'Maria Garcia',
  email: 'maria@example.com',
  phone: '+1 (555) 123-4567',
  credits: 0,
  activePackages: []
};
