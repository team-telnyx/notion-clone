import { describe, it, expect } from 'vitest';

describe('Project Initialization', () => {
  describe('Package Dependencies', () => {
    it('should have React as a dependency', async () => {
      const react = await import('react');
      expect(react).toBeDefined();
    });

    it('should have React DOM as a dependency', async () => {
      const reactDom = await import('react-dom');
      expect(reactDom).toBeDefined();
    });

    it('should have React Router DOM as a dependency', async () => {
      const reactRouterDom = await import('react-router-dom');
      expect(reactRouterDom).toBeDefined();
      expect(reactRouterDom.BrowserRouter).toBeDefined();
      expect(reactRouterDom.Routes).toBeDefined();
      expect(reactRouterDom.Route).toBeDefined();
    });

    it('should have axios as a dependency', async () => {
      const axios = await import('axios');
      expect(axios).toBeDefined();
    });
  });

  describe('Essential Modules', () => {
    it('should import App component without error', async () => {
      const App = await import('../App');
      expect(App.default).toBeDefined();
    });

    it('should import useAuth hook', async () => {
      const authHook = await import('../hooks/useAuth');
      expect(authHook.useAuth).toBeDefined();
    });
  });

  describe('Source Structure', () => {
    it('should have pages modules available', async () => {
      const Login = await import('../pages/Login');
      expect(Login.default).toBeDefined();

      const Register = await import('../pages/Register');
      expect(Register.default).toBeDefined();

      const Dashboard = await import('../pages/Dashboard');
      expect(Dashboard.default).toBeDefined();

      const Workspace = await import('../pages/Workspace');
      expect(Workspace.default).toBeDefined();
    });

    it('should have API modules available', async () => {
      const axios = await import('../api/axios');
      expect(axios.default).toBeDefined();
    });
  });
});
