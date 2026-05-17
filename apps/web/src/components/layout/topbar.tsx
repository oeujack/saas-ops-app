import { Bell, Moon, Sun, SunMoon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/theme.store';

export function Topbar() {
  const { theme, setTheme } = useThemeStore();

  function cycleTheme() {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  }

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : SunMoon;

  return (
    <header className="border-border bg-background flex h-16 items-center justify-between border-b px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={cycleTheme} aria-label="Toggle theme">
          <ThemeIcon className="h-4 w-4" />
        </Button>
        <div className="bg-primary text-primary-foreground ml-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
          JS
        </div>
      </div>
    </header>
  );
}
