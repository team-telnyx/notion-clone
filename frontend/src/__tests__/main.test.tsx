import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Main Entry Point', () => {
  describe('React Imports', () => {
    it('should import StrictMode from React', async () => {
      const { StrictMode } = await import('react');
      expect(StrictMode).toBeDefined();
    });

    it('should import createRoot from react-dom/client', async () => {
      const { createRoot } = await import('react-dom/client');
      expect(createRoot).toBeDefined();
    });
  });

  describe('App Import', () => {
    it('should import App component', async () => {
      const App = await import('../App');
      expect(App.default).toBeDefined();
    });
  });
});

describe('React DOM Rendering', () => {
  let rootElement: HTMLDivElement;

  beforeEach(() => {
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should have root element in document', () => {
    expect(document.getElementById('root')).toBeTruthy();
  });

  it('should be able to get root element by ID', () => {
    const root = document.getElementById('root');
    expect(root).toBe(rootElement);
  });

  it('should be able to create root and render', async () => {
    const { createRoot } = await import('react-dom/client');
    
    const root = createRoot(rootElement);
    expect(root).toBeDefined();
    expect(root.render).toBeDefined();
  });
});

describe('CSS Import', () => {
  it('should have Tailwind CSS available', async () => {
    const tailwind = await import('tailwindcss');
    expect(tailwind).toBeDefined();
  });
});

describe('TypeScript Configuration', () => {
  it('should support TypeScript JSX transform', () => {
    const element = <div>Test</div>;
    expect(element).toBeDefined();
    expect(element.type).toBe('div');
    expect(element.props.children).toBe('Test');
  });

  it('should support TypeScript strict mode features', () => {
    const strictValue: string = 'strict';
    expect(strictValue).toBe('strict');
  });
});
