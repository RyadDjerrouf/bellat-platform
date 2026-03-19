import { format, addDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format date for delivery slots
 */
export function formatDeliveryDate(date: Date, locale: 'fr' | 'ar' = 'fr'): string {
  if (locale === 'ar') {
    return format(date, 'dd/MM/yyyy', { locale: fr }); // Using fr locale for now, can add Arabic locale later
  }
  return format(date, 'dd/MM/yyyy', { locale: fr });
}

/**
 * Format time slot for delivery
 */
export function formatTimeSlot(slot: 'morning' | 'afternoon' | 'evening', locale: 'fr' | 'ar' = 'fr'): string {
  const slots = {
    fr: {
      morning: 'Matin (8h - 12h)',
      afternoon: 'Après-midi (12h - 17h)',
      evening: 'Soir (17h - 21h)'
    },
    ar: {
      morning: 'صباحاً (8 - 12)',
      afternoon: 'بعد الظهر (12 - 17)',
      evening: 'مساءً (17 - 21)'
    }
  };
  
  return slots[locale][slot];
}

/**
 * Get tomorrow's date
 */
export function getTomorrowDate(): Date {
  return addDays(new Date(), 1);
}

/**
 * Get day after tomorrow's date
 */
export function getDayAfterTomorrowDate(): Date {
  return addDays(new Date(), 2);
}

/**
 * Generate fake order number
 */
export function generateOrderNumber(): string {
  const today = new Date();
  const dateString = format(today, 'yyyyMMdd');
  const randomNum = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `BLT-${dateString}-${randomNum}`;
}