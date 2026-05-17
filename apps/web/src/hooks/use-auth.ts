import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth.store';
import type { AuthOrg, AuthUser } from '@/store/auth.store';

interface AuthResponse {
  token: string;
  user: AuthUser;
  org: AuthOrg;
}

interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto {
  orgName: string;
  name: string;
  email: string;
  password: string;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: LoginDto) => api.post<AuthResponse>('/auth/login', dto),
    onSuccess: ({ token, user, org }) => {
      setAuth(token, user, org);
      void router.navigate({ to: '/dashboard' });
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: RegisterDto) => api.post<AuthResponse>('/auth/register', dto),
    onSuccess: ({ token, user, org }) => {
      setAuth(token, user, org);
      void router.navigate({ to: '/dashboard' });
    },
  });
}

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get<{ user: AuthUser; org: AuthOrg }>('/auth/me'),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    logout();
    queryClient.clear();
    void router.navigate({ to: '/login' });
  };
}
