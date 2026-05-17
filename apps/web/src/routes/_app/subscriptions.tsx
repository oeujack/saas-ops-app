import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useSubscriptions,
  useSubscriptionStats,
  useCreateSubscription,
  useUpdateSubscription,
  useDeleteSubscription,
  type Subscription,
} from '@/hooks/use-subscriptions';
import { formatCurrency } from '@/lib/utils';

export const Route = createFileRoute('/_app/subscriptions')({
  component: SubscriptionsPage,
});

const CATEGORIES = [
  'productivity',
  'communication',
  'design',
  'security',
  'analytics',
  'devtools',
  'hr',
  'finance',
  'sales',
  'other',
] as const;

const STATUSES = ['active', 'cancelled', 'paused', 'trial'] as const;
const BILLING_CYCLES = ['monthly', 'annual', 'quarterly'] as const;

const STATUS_BADGE: Record<string, 'success' | 'destructive' | 'secondary' | 'warning'> = {
  active: 'success',
  trial: 'warning',
  paused: 'secondary',
  cancelled: 'destructive',
};

function monthlyAmount(sub: Subscription): number {
  if (sub.billingCycle === 'annual') return Math.round(sub.amount / 12);
  if (sub.billingCycle === 'quarterly') return Math.round(sub.amount / 3);
  return sub.amount;
}

const SubscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  category: z.enum(CATEGORIES),
  status: z.enum(STATUSES),
  amountBrl: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  billingCycle: z.enum(BILLING_CYCLES),
  seats: z.coerce.number().int().positive().optional().or(z.literal('')),
  renewalDate: z.string().optional(),
  notes: z.string().optional(),
});

type SubscriptionFormData = z.infer<typeof SubscriptionSchema>;

function SubscriptionFormModal({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Subscription | null;
}) {
  const create = useCreateSubscription();
  const update = useUpdateSubscription();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(SubscriptionSchema),
    defaultValues: editing
      ? {
          name: editing.name,
          vendor: editing.vendor,
          category: editing.category as (typeof CATEGORIES)[number],
          status: editing.status,
          amountBrl: editing.amount / 100,
          billingCycle: editing.billingCycle,
          seats: editing.seats ?? undefined,
          renewalDate: editing.renewalDate ? editing.renewalDate.slice(0, 10) : '',
          notes: editing.notes ?? '',
        }
      : { status: 'active', billingCycle: 'monthly' },
  });

  const onSubmit = (data: SubscriptionFormData) => {
    const dto = {
      name: data.name,
      vendor: data.vendor,
      category: data.category,
      status: data.status,
      amount: Math.round(data.amountBrl * 100),
      billingCycle: data.billingCycle,
      seats: data.seats ? Number(data.seats) : undefined,
      renewalDate: data.renewalDate || undefined,
      notes: data.notes || undefined,
    };

    if (editing) {
      update.mutate(
        { id: editing.id, dto },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
          },
        },
      );
    } else {
      create.mutate(dto, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      });
    }
  };

  const isPending = create.isPending || update.isPending;
  const error = create.error ?? update.error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Subscription' : 'Add Subscription'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" placeholder="Slack" {...register('name')} />
              {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vendor">Vendor *</Label>
              <Input id="vendor" placeholder="Slack Technologies" {...register('vendor')} />
              {errors.vendor && <p className="text-destructive text-xs">{errors.vendor.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select id="category" {...register('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select id="status" {...register('status')}>
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="amountBrl">Amount (R$) *</Label>
              <Input
                id="amountBrl"
                type="number"
                step="0.01"
                min="0"
                placeholder="99.90"
                {...register('amountBrl')}
              />
              {errors.amountBrl && (
                <p className="text-destructive text-xs">{errors.amountBrl.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <Select id="billingCycle" {...register('billingCycle')}>
                {BILLING_CYCLES.map((b) => (
                  <option key={b} value={b} className="capitalize">
                    {b}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="seats">Seats</Label>
              <Input id="seats" type="number" min="1" placeholder="30" {...register('seats')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="renewalDate">Renewal Date</Label>
              <Input id="renewalDate" type="date" {...register('renewalDate')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" placeholder="Optional notes…" {...register('notes')} />
          </div>

          {error && <p className="text-destructive text-sm">{error.message}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : editing ? 'Save changes' : 'Add subscription'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubscriptionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);

  const { data: subscriptions = [], isLoading } = useSubscriptions();
  const { data: stats } = useSubscriptionStats();
  const deleteSubscription = useDeleteSubscription();

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(sub: Subscription) {
    setEditing(sub);
    setModalOpen(true);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteSubscription.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground text-sm">Manage all your SaaS subscriptions</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add subscription
        </Button>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalMonthlySpend)}</p>
              <p className="text-muted-foreground text-xs">
                {stats.activeCount} active subscriptions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Renewing Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.renewingSoonCount}</p>
              <p className="text-muted-foreground text-xs">in the next 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Trials</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.trialCount}</p>
              <p className="text-muted-foreground text-xs">active trials</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Monthly</TableHead>
                <TableHead>Renewal</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground py-12 text-center">
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && subscriptions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground py-12 text-center">
                    No subscriptions yet. Add your first one!
                  </TableCell>
                </TableRow>
              )}
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{sub.name}</p>
                      <p className="text-muted-foreground text-xs">{sub.vendor}</p>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{sub.category}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE[sub.status] ?? 'secondary'} className="capitalize">
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{sub.billingCycle}</TableCell>
                  <TableCell>{formatCurrency(monthlyAmount(sub))}</TableCell>
                  <TableCell>
                    {sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString('pt-BR') : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit"
                        onClick={() => openEdit(sub)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        onClick={() => setDeleteTarget(sub)}
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SubscriptionFormModal
        key={editing?.id ?? 'new'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete subscription?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteSubscription.isPending}
              onClick={handleDelete}
            >
              {deleteSubscription.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
