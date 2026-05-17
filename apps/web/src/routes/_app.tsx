import { createFileRoute, redirect } from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/app-layout';
import { useAuthStore } from '@/store/auth.store';

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ location }) => {
    if (!useAuthStore.getState().token) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }
  },
  component: AppLayout,
});
