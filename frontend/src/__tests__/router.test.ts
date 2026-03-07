import { describe, it, expect } from 'vitest';

describe('React Router Integration', () => {
  describe('Router Components', () => {
    it('should have BrowserRouter available', async () => {
      const { BrowserRouter } = await import('react-router-dom');
      expect(BrowserRouter).toBeDefined();
    });

    it('should have Routes component available', async () => {
      const { Routes } = await import('react-router-dom');
      expect(Routes).toBeDefined();
    });

    it('should have Route component available', async () => {
      const { Route } = await import('react-router-dom');
      expect(Route).toBeDefined();
    });

    it('should have Navigate component available', async () => {
      const { Navigate } = await import('react-router-dom');
      expect(Navigate).toBeDefined();
    });
  });

  describe('Router Hooks', () => {
    it('should have useParams hook available', async () => {
      const { useParams } = await import('react-router-dom');
      expect(useParams).toBeDefined();
    });

    it('should have useNavigate hook available', async () => {
      const { useNavigate } = await import('react-router-dom');
      expect(useNavigate).toBeDefined();
    });

    it('should have useLocation hook available', async () => {
      const { useLocation } = await import('react-router-dom');
      expect(useLocation).toBeDefined();
    });

    it('should have useSearchParams hook available', async () => {
      const { useSearchParams } = await import('react-router-dom');
      expect(useSearchParams).toBeDefined();
    });
  });

  describe('Route Definitions', () => {
    it('should have App component with router integration', async () => {
      const App = await import('../App');
      expect(App.default).toBeDefined();
      expect(typeof App.default).toBe('function');
    });
  });
});

describe('Protected Routes', () => {
  describe('Authentication Hook', () => {
    it('should have useAuth hook available', async () => {
      const { useAuth } = await import('../hooks/useAuth');
      expect(useAuth).toBeDefined();
      expect(typeof useAuth).toBe('function');
    });
  });

  describe('Page Components', () => {
    it('should have Login page for public access', async () => {
      const Login = await import('../pages/Login');
      expect(Login.default).toBeDefined();
    });

    it('should have Register page for public access', async () => {
      const Register = await import('../pages/Register');
      expect(Register.default).toBeDefined();
    });

    it('should have Dashboard page for protected access', async () => {
      const Dashboard = await import('../pages/Dashboard');
      expect(Dashboard.default).toBeDefined();
    });

    it('should have Workspace page for protected access', async () => {
      const Workspace = await import('../pages/Workspace');
      expect(Workspace.default).toBeDefined();
    });
  });
});
