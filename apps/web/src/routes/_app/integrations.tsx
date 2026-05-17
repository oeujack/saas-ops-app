import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/integrations')({
  component: () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Integrations</h1>
      <p className="text-muted-foreground">Coming in Sprint 3.</p>
    </div>
  ),
});
