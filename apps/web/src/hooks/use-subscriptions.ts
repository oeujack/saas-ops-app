import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export interface Subscription {
  id: string;
  orgId: string;
  name: string;
  vendor: string;
  category: string;
  status: 'active' | 'cancelled' | 'paused' | 'trial';
  amount: number;
  billingCycle: 'monthly' | 'annual' | 'quarterly';
  seats: number | null;
  renewalDate: string | null;
  ownerId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStats {
  totalMonthlySpend: number;
  activeCount: number;
  trialCount: number;
  cancelledCount: number;
  renewingSoonCount: number;
  renewingSoon: Subscription[];
}

export interface CreateSubscriptionDto {
  name: string;
  vendor: string;
  category: string;
  status?: string;
  amount: number;
  billingCycle: string;
  seats?: number;
  renewalDate?: string;
  notes?: string;
  ownerId?: string;
}

export type UpdateSubscriptionDto = Partial<CreateSubscriptionDto>;

const KEYS = {
  list: (params?: Record<string, string>) => ['subscriptions', params ?? {}] as const,
  stats: () => ['subscriptions', 'stats'] as const,
  detail: (id: string) => ['subscriptions', id] as const,
};

export function useSubscriptions(params?: { status?: string; category?: string }) {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.category) query.set('category', params.category);
  const qs = query.toString();

  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => api.get<Subscription[]>(`/subscriptions${qs ? `?${qs}` : ''}`),
  });
}

export function useSubscriptionStats() {
  return useQuery({
    queryKey: KEYS.stats(),
    queryFn: () => api.get<SubscriptionStats>('/subscriptions/stats'),
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateSubscriptionDto) => api.post<Subscription>('/subscriptions', dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSubscriptionDto }) =>
      api.patch<Subscription>(`/subscriptions/${id}`, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/subscriptions/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}
