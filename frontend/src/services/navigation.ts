import type { NavigateFunction } from 'react-router-dom';

class NavigationService {
  private navigate: NavigateFunction | null = null;

  setNavigate(navigateFn: NavigateFunction): void {
    this.navigate = navigateFn;
  }

  navigateTo(path: string): void {
    if (this.navigate) {
      this.navigate(path);
    } else {
      window.location.href = path;
    }
  }

  isInitialized(): boolean {
    return this.navigate !== null;
  }
}

export const navigationService = new NavigationService();
