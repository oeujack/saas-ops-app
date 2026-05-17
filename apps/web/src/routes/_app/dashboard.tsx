import { createFileRoute } from '@tanstack/react-router';
import { AlertTriangle, CreditCard, RefreshCw, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { useSubscriptionStats } from '@/hooks/use-subscriptions';

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: stats, isLoading } = useSubscriptionStats();

  const kpis = [
    {
      title: 'Monthly Spend',
      value: stats?.totalMonthlySpend ?? 0,
      isCurrency: true,
      icon: CreditCard,
      description: `${stats?.activeCount ?? 0} active subscriptions`,
    },
    {
      title: 'Savings Opportunities',
      value: 0,
      isCurrency: true,
      icon: TrendingUp,
      description: 'coming soon',
    },
    {
      title: 'Renewals (30 days)',
      value: stats?.renewingSoonCount ?? 0,
      isCurrency: false,
      icon: RefreshCw,
      description: 'renewing soon',
    },
    {
      title: 'Trials',
      value: stats?.trialCount ?? 0,
      isCurrency: false,
      icon: AlertTriangle,
      description: 'active trials',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Your SaaS spending overview for{' '}
          {new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '—' : kpi.isCurrency ? formatCurrency(kpi.value) : kpi.value}
              </div>
              <p className="text-muted-foreground mt-1 text-xs">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground text-base font-semibold">
              Upcoming Renewals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!stats?.renewingSoon?.length ? (
              <p className="text-muted-foreground py-6 text-center text-sm">
                {isLoading ? 'Loading…' : 'No renewals in the next 30 days.'}
              </p>
            ) : (
              <div className="space-y-3">
                {stats.renewingSoon.map((sub) => (
                  <div
                    key={sub.id}
                    className="border-border flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded text-xs font-bold">
                        {sub.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{sub.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {sub.seats ? `${sub.seats} seats · ` : ''}
                          {sub.renewalDate
                            ? new Date(sub.renewalDate).toLocaleDateString('pt-BR')
                            : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(sub.amount)}</p>
                      <Badge variant="warning" className="mt-1 capitalize">
                        {sub.billingCycle}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground text-base font-semibold">
              Top Savings Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { tool: 'Zoom', action: '12 unused licenses', savings: 42_000, severity: 'high' },
                {
                  tool: 'Figma',
                  action: 'Downgrade to Starter',
                  savings: 75_000,
                  severity: 'medium',
                },
                {
                  tool: 'Adobe CC',
                  action: '3 former employees',
                  savings: 18_900,
                  severity: 'high',
                },
                { tool: 'Notion', action: 'Negotiate annual', savings: 24_000, severity: 'low' },
              ].map((opp) => (
                <div
                  key={opp.tool}
                  className="border-border flex items-center justify-between rounded-md border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        opp.severity === 'high'
                          ? 'destructive'
                          : opp.severity === 'medium'
                            ? 'warning'
                            : 'secondary'
                      }
                    >
                      {opp.severity}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">{opp.tool}</p>
                      <p className="text-muted-foreground text-xs">{opp.action}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600">
                    -{formatCurrency(opp.savings)}/yr
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
