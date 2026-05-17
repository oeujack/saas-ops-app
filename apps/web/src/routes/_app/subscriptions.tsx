import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/subscriptions')({
  component: () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Subscriptions</h1>
      <p className="text-muted-foreground">Coming in Sprint 2.</p>
    </div>
  ),
});
