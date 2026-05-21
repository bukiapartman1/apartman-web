import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ReviewForm from './ReviewForm';
import styles from './ertekeles.module.css';

export const metadata = {
  title: "Harmónia Apartman | Értékelés",
  description: "Mondja el véleményét a nálunk eltöltött időről.",
};

export default async function ErtekelesPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  if (!params.id) {
    notFound();
  }

  // Megkeressük a foglalást az adatbázisban a Review kapcsolattal együtt
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { review: true }
  });

  // Ha a foglalás nem létezik, vagy iCal importált foglalás, akkor 404
  if (!booking || booking.status === 'IMPORTED') {
    notFound();
  }

  return (
    <main className={styles.container}>
      <ReviewForm booking={booking} />
    </main>
  );
}
