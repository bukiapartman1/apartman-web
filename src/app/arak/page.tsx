import Footer from '@/components/Footer';

export default function ArakPage() {
  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '0 20px' }}>
        <h1 style={{ fontSize: '3rem', color: '#c5a880', marginBottom: '20px' }}>Áraink</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Az oldal kialakítás alatt...</p>
      </div>
      <Footer />
    </main>
  );
}
