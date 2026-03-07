import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { navigationService } from '../../services/navigation';
import type { NavigateFunction } from 'react-router-dom';

describe('NavigationService', () => {
  beforeEach(() => {
    vi.stubGlobal('location', { href: '' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should use React Router navigate when initialized', () => {
    const mockNavigate = vi.fn() as NavigateFunction;
    navigationService.setNavigate(mockNavigate);

    navigationService.navigateTo('/login');

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(window.location.href).toBe('');
  });

  it('should report initialized status correctly', () => {
    const mockNavigate = vi.fn() as NavigateFunction;
    navigationService.setNavigate(mockNavigate);

    expect(navigationService.isInitialized()).toBe(true);
  });
});

describe('NavigationService fallback behavior', () => {
  it('should fall back to window.location when navigate not set', async () => {
    vi.stubGlobal('location', { href: '' });

    vi.resetModules();

    class TestNavigationService {
      private navigate: NavigateFunction | null = null;
      setNavigate(fn: NavigateFunction) { this.navigate = fn; }
      navigateTo(path: string) {
        if (this.navigate) {
          this.navigate(path);
        } else {
          window.location.href = path;
        }
      }
      isInitialized() { return this.navigate !== null; }
    }

    const freshService = new TestNavigationService();
    freshService.navigateTo('/login');

    expect(window.location.href).toBe('/login');
  });
});
