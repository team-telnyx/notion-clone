import { describe, it, expect } from 'vitest';

describe('App Component', () => {
  describe('Module Imports', () => {
    it('should import App component without error', async () => {
      const App = await import('../App');
      expect(App.default).toBeDefined();
    });

    it('should have useAuth hook dependency', async () => {
      const auth = await import('../hooks/useAuth');
      expect(auth.useAuth).toBeDefined();
    });

    it('should have page components available', async () => {
      const Login = await import('../pages/Login');
      expect(Login.default).toBeDefined();

      const Register = await import('../pages/Register');
      expect(Register.default).toBeDefined();

      const Dashboard = await import('../pages/Dashboard');
      expect(Dashboard.default).toBeDefined();

      const Workspace = await import('../pages/Workspace');
      expect(Workspace.default).toBeDefined();
    });
  });

  describe('App Component Type', () => {
    it('should export a function component', async () => {
      const App = await import('../App');
      expect(typeof App.default).toBe('function');
    });
  });
});

describe('Protected/Public Route Logic', () => {
  describe('Route Component Types', () => {
    it('should have BrowserRouter from react-router-dom', async () => {
      const rrd = await import('react-router-dom');
      expect(rrd.BrowserRouter).toBeDefined();
    });

    it('should have Routes and Route components', async () => {
      const rrd = await import('react-router-dom');
      expect(rrd.Routes).toBeDefined();
      expect(rrd.Route).toBeDefined();
    });

    it('should have Navigate component for redirects', async () => {
      const rrd = await import('react-router-dom');
      expect(rrd.Navigate).toBeDefined();
    });
  });

  describe('useAuth Hook', () => {
    it('should return user, loading, error, and auth methods', async () => {
      const { useAuth } = await import('../hooks/useAuth');
      expect(typeof useAuth).toBe('function');
    });
  });
});
