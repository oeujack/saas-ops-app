import { createFileRoute } from '@tanstack/react-router';
import { ArrowDown, ArrowUp, AlertTriangle, CreditCard, RefreshCw, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercent } from '@/lib/utils';

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
});

const MOCK_KPIS = [
  {
    title: 'Monthly Spend',
    value: 4_782_00,
    change: 8.3,
    trend: 'up' as const,
    icon: CreditCard,
    description: 'vs. last month',
  },
  {
    title: 'Savings Opportunities',
    value: 1_240_00,
    change: null,
    trend: null,
    icon: TrendingUp,
    description: '4 recommendations',
  },
  {
    title: 'Renewals (30 days)',
    value: 6,
    isCurrency: false,
    change: null,
    trend: null,
    icon: RefreshCw,
    description: 'Next: Slack on Jun 2',
  },
  {
    title: 'Active Alerts',
    value: 3,
    isCurrency: false,
    change: null,
    trend: null,
    icon: AlertTriangle,
    description: '2 unused licenses',
  },
];

const MOCK_UPCOMING_RENEWALS = [
  { name: 'Slack', amount: 180_000, date: '2026-06-02', seats: 30, status: 'active' as const },
  { name: 'Notion', amount: 96_000, date: '2026-06-15', seats: 20, status: 'active' as const },
  { name: 'Figma', amount: 225_000, date: '2026-07-01', seats: 15, status: 'review' as const },
  { name: 'Zoom', amount: 149_900, date: '2026-07-10', seats: 50, status: 'active' as const },
];

function KpiCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
  isCurrency = true,
}: {
  title: string;
  value: number;
  change: number | null;
  trend: 'up' | 'down' | null;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  isCurrency?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{isCurrency ? formatCurrency(value) : value}</div>
        <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
          {change !== null && trend && (
            <span
              className={
                trend === 'up'
                  ? 'text-destructive flex items-center'
                  : 'flex items-center text-emerald-600'
              }
            >
              {trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {formatPercent(change)}
            </span>
          )}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
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
        {MOCK_KPIS.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
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
            <div className="space-y-3">
              {MOCK_UPCOMING_RENEWALS.map((renewal) => (
                <div
                  key={renewal.name}
                  className="border-border flex items-center justify-between rounded-md border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded text-xs font-bold">
                      {renewal.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{renewal.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {renewal.seats} seats · {new Date(renewal.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(renewal.amount)}</p>
                    <Badge
                      variant={renewal.status === 'review' ? 'warning' : 'success'}
                      className="mt-1"
                    >
                      {renewal.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
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
