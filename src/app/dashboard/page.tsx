import { auth } from '@/lib/auth-wrapper';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Redirect to role-specific dashboard
  redirect(`/dashboard/${session.user.roleSlug}`);
}
