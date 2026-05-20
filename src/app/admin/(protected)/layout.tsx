import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './admin.module.css';
import AdminSidebar from './AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('adminAuth')?.value === 'true';

  if (!isAdmin) {
    redirect('/admin/login');
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
