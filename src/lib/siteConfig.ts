/**
 * Harmónia Apartman - Központi Weboldal Konfiguráció és Árazási Rendszer
 */

export interface HolidayPeriod {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  active: boolean;
}

export const defaultHungarianHolidays: HolidayPeriod[] = [
  // 2026 Hosszú hétvégék és ünnepek
  { id: 'h-2026-easter', name: 'Húsvét 2026 (4 napos)', startDate: '2026-04-03', endDate: '2026-04-06', active: true },
  { id: 'h-2026-may1', name: 'Május 1. 2026 (3 napos)', startDate: '2026-05-01', endDate: '2026-05-03', active: true },
  { id: 'h-2026-pentecost', name: 'Pünkösd 2026 (3 napos)', startDate: '2026-05-23', endDate: '2026-05-25', active: true },
  { id: 'h-2026-aug20', name: 'Augusztus 20. 2026 (4 napos)', startDate: '2026-08-20', endDate: '2026-08-23', active: true },
  { id: 'h-2026-oct23', name: 'Október 23. 2026 (3 napos)', startDate: '2026-10-23', endDate: '2026-10-25', active: true },
  { id: 'h-2026-xmas', name: 'Karácsony & Szilveszter 2026/2027', startDate: '2026-12-23', endDate: '2027-01-03', active: true },
  
  // 2027 Hosszú hétvégék és ünnepek
  { id: 'h-2027-mar15', name: 'Március 15. 2027 (3 napos)', startDate: '2027-03-13', endDate: '2027-03-15', active: true },
  { id: 'h-2027-easter', name: 'Húsvét 2027 (4 napos)', startDate: '2027-03-26', endDate: '2027-03-29', active: true },
  { id: 'h-2027-pentecost', name: 'Pünkösd 2027 (3 napos)', startDate: '2027-05-15', endDate: '2027-05-17', active: true },
  { id: 'h-2027-aug20', name: 'Augusztus 20. 2027 (3 napos)', startDate: '2027-08-20', endDate: '2027-08-22', active: true },
  { id: 'h-2027-nov1', name: 'Mindenszentek 2027 (3 napos)', startDate: '2027-10-30', endDate: '2027-11-01', active: true },
  { id: 'h-2027-xmas', name: 'Karácsony & Szilveszter 2027/2028', startDate: '2027-12-23', endDate: '2028-01-03', active: true },
];

export const siteConfig = {
  name: 'Harmónia Apartman Bükfürdő',
  shortName: 'Harmónia Apartman',
  tagline: 'Prémium pihenés és feltöltődés a termálfürdő szomszédságában',
  description: 'Exkluzív, modern berendezésű apartman Bükfürdő szívében. Teljesen felszerelt konyha, klíma, ingyenes Wi-Fi, privát parkoló és csendes terasz a tökéletes kikapcsolódáshoz.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://apartman-web.vercel.app',
  
  // Szálláshely & Kapcsolattartási adatok
  contact: {
    address: '9737 Bükfürdő, Termál krt. 12.',
    city: 'Bükfürdő',
    zip: '9737',
    country: 'Magyarország',
    phone: '+36 30 123 4567',
    email: 'rekalaca@gmail.com',
    owner: 'Teszt János E.V.',
    taxNumber: '12345678-1-18',
    ntak: 'EG26000001 (Magánszálláshely)',
  },

  // Banki adatok átutalásos fizetéshez
  bank: {
    bankName: 'OTP Bank',
    accountName: 'Teszt János E.V.',
    accountNumber: '11773000-12345678-00000000',
    iban: 'HU42 1177 3000 1234 5678 0000 0000',
    swift: 'OTPVHUHB',
  },

  // Kapacitás
  capacity: {
    maxAdults: 4,
    maxChildren: 3,
    maxTotalGuests: 5,
    minStayNights: 2,
  },

  // Helyi Idegenforgalmi Adó (IFA)
  ifa: {
    pricePerPersonPerNight: 600, // Ft
    freeUnderAge: 18,
  },

  // Szezonális árak (apartman / éj alapár)
  pricing: {
    lowSeason: {
      name: 'Elő- és Utószezon',
      pricePerNight: 28000,
      minNights: 2,
      period: 'Január 2 – Május 31. & Szeptember 16 – December 20.',
    },
    highSeason: {
      name: 'Nyári Főszezon',
      pricePerNight: 35000,
      minNights: 3,
      period: 'Június 1 – Szeptember 15.',
    },
    peakSeason: {
      name: 'Kiemelt Ünnepi Időszak',
      pricePerNight: 40000,
      minNights: 3,
      period: 'Kiemelt magyarországi ünnepek, Hosszú hétvégék, Dec 21 – Jan 1.',
    },
    discounts: [
      { minNights: 7, percentage: 10, label: '7 éjszakától 10% kedvezmény' },
      { minNights: 14, percentage: 15, label: '14 éjszakától 15% kedvezmény' },
    ],
  },

  includedServices: [
    { icon: 'wifi', title: 'Nagysebességű Wi-Fi', desc: 'Korlátlan, gyors internet az egész apartmanban' },
    { icon: 'parking', title: 'Zárt, Privát Parkoló', desc: 'Díjmentes és biztonságos parkolási lehetőség az udvarban' },
    { icon: 'climate', title: 'Egyedileg szabályozható Klíma', desc: 'Hűtő-fűtő klímaberendezés a maximális kényelemért' },
    { icon: 'kitchen', title: 'Teljesen felszerelt Konyha', desc: 'Hűtő, főzőlap, mikró, Nespresso kávéfőző, vízforraló, edények' },
    { icon: 'linen', title: 'Prémium Ágynemű & Törölközők', desc: 'Szállodai minőségű textíliák és bekészítés' },
    { icon: 'coffee', title: 'Kávé & Tea Bekészítés', desc: 'Díjmentes üdvözlő kávékapszulák és válogatott teák' },
    { icon: 'cleaning', title: 'Végtakarítás', desc: 'Nincsenek rejtett költségek, a végtakarítást az ár tartalmazza' },
    { icon: 'baby', title: 'Bababarát Felszerelések', desc: 'Kérésre etetőszék, utazóágy és babakád díjmentesen' },
  ],
};

export interface CustomSettingsOverride {
  priceLowSeason?: number;
  priceHighSeason?: number;
  pricePeakSeason?: number;
  ifaAmount?: number;
  peakDates?: HolidayPeriod[];
}

/**
 * Segédfüggvény a szezon és éjszakánkénti ár meghatározásához adott dátumra
 */
export function getNightPriceForDate(date: Date, override?: CustomSettingsOverride): number {
  const lowPrice = override?.priceLowSeason || siteConfig.pricing.lowSeason.pricePerNight;
  const highPrice = override?.priceHighSeason || siteConfig.pricing.highSeason.pricePerNight;
  const peakPrice = override?.pricePeakSeason || siteConfig.pricing.peakSeason.pricePerNight;

  const dateStr = date.toISOString().split('T')[0];
  const holidays = override?.peakDates || defaultHungarianHolidays;

  // 1. Ellenőrizzük, hogy a nap beletartozik-e valamelyik aktív kiemelt ünnepnapba
  const isHoliday = holidays.some(h => h.active && dateStr >= h.startDate && dateStr <= h.endDate);
  if (isHoliday) {
    return peakPrice;
  }

  // 2. Karácsony / Szilveszter fix időszak
  const month = date.getMonth();
  const day = date.getDate();
  if ((month === 11 && day >= 21) || (month === 0 && day <= 3)) {
    return peakPrice;
  }

  // 3. Nyári főszezon: Június 1 - Szeptember 15.
  if ((month >= 5 && month <= 7) || (month === 8 && day <= 15)) {
    return highPrice;
  }

  // 4. Elő- és utószezon alapár
  return lowPrice;
}

export interface PriceCalculationResult {
  nights: number;
  baseRoomPrice: number;
  discountAmount: number;
  discountPercentage: number;
  roomPriceAfterDiscount: number;
  ifaPerNightPerPerson: number;
  ifaTotal: number;
  totalPrice: number;
  depositAmount: number;
  remainingAmount: number;
  averageNightPrice: number;
}

/**
 * Dinamikus kalkuláció: Éjszakák + Felnőttek + Szezon + IFA + Kedvezmények
 */
export function calculateStayPrice(
  startDate: Date,
  endDate: Date,
  adultsCount: number = 2,
  childrenCount: number = 0,
  override?: CustomSettingsOverride
): PriceCalculationResult {
  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / msPerDay));

  let baseRoomPrice = 0;
  const curDate = new Date(startDate.getTime());
  for (let i = 0; i < nights; i++) {
    baseRoomPrice += getNightPriceForDate(curDate, override);
    curDate.setDate(curDate.getDate() + 1);
  }

  let discountPercentage = 0;
  if (nights >= 14) {
    discountPercentage = 15;
  } else if (nights >= 7) {
    discountPercentage = 10;
  }

  const discountAmount = Math.round(baseRoomPrice * (discountPercentage / 100));
  const roomPriceAfterDiscount = baseRoomPrice - discountAmount;

  const ifaPerNightPerPerson = override?.ifaAmount || siteConfig.ifa.pricePerPersonPerNight;
  const ifaTotal = adultsCount * nights * ifaPerNightPerPerson;

  const totalPrice = roomPriceAfterDiscount + ifaTotal;
  const depositAmount = Math.round(totalPrice * 0.3);
  const remainingAmount = totalPrice - depositAmount;
  const averageNightPrice = Math.round(roomPriceAfterDiscount / nights);

  return {
    nights,
    baseRoomPrice,
    discountAmount,
    discountPercentage,
    roomPriceAfterDiscount,
    ifaPerNightPerPerson,
    ifaTotal,
    totalPrice,
    depositAmount,
    remainingAmount,
    averageNightPrice,
  };
}
