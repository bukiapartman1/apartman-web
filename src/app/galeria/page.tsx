import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

export default function GaleriaPage() {
  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <Gallery />
      </div>
      <Footer />
    </main>
  );
}
