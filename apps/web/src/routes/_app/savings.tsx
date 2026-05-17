import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/savings')({
  component: () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Savings</h1>
      <p className="text-muted-foreground">Coming in Sprint 3.</p>
    </div>
  ),
});
