import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/lib/siteConfig';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      minStayNights: settingsMap.min_stay_nights ? Number(settingsMap.min_stay_nights) : siteConfig.capacity.minStayNights,
      priceLowSeason: settingsMap.price_low_season ? Number(settingsMap.price_low_season) : siteConfig.pricing.lowSeason.pricePerNight,
      priceHighSeason: settingsMap.price_high_season ? Number(settingsMap.price_high_season) : siteConfig.pricing.highSeason.pricePerNight,
      pricePeakSeason: settingsMap.price_peak_season ? Number(settingsMap.price_peak_season) : siteConfig.pricing.peakSeason.pricePerNight,
      ifaAmount: settingsMap.ifa_amount ? Number(settingsMap.ifa_amount) : siteConfig.ifa.pricePerPersonPerNight,
      peakDates: settingsMap.peak_dates_json ? JSON.parse(settingsMap.peak_dates_json) : null,
    });
  } catch (error) {
    console.error('Hiba a publikus beállítások lekérésekor:', error);
    return NextResponse.json({
      minStayNights: siteConfig.capacity.minStayNights,
      priceLowSeason: siteConfig.pricing.lowSeason.pricePerNight,
      priceHighSeason: siteConfig.pricing.highSeason.pricePerNight,
      pricePeakSeason: siteConfig.pricing.peakSeason.pricePerNight,
      ifaAmount: siteConfig.ifa.pricePerPersonPerNight,
      peakDates: null,
    });
  }
}
