import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/analytics')({
  component: () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  ),
});
