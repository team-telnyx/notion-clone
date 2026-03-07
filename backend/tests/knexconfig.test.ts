import knexConfig from '../knexfile';

describe('Knex Configuration', () => {
  test('should have development configuration', () => {
    expect(knexConfig.development).toBeDefined();
    expect(knexConfig.development).toHaveProperty('client');
    expect(knexConfig.development).toHaveProperty('connection');
  });

  test('should use postgresql client', () => {
    expect(knexConfig.development.client).toBe('pg');
  });

  test('should have migrations directory configured', () => {
    expect(knexConfig.development.migrations).toBeDefined();
    expect(knexConfig.development.migrations?.directory).toBe('./migrations');
  });

  test('should read database config from environment', () => {
    const config = knexConfig.development.connection as { 
      host?: string; 
      port?: number; 
      database?: string;
    };
    
    expect(config.host).toBeDefined();
    expect(config.port).toBeDefined();
    expect(config.database).toBeDefined();
  });

  test('should have default values for database configuration', () => {
    const config = knexConfig.development.connection as { 
      host: string; 
      port: number; 
      database: string;
    };
    
    expect(config.host).toBe('pgbot-main-18.internal');
    expect(config.port).toBe(5432);
    expect(config.database).toBe('notion_clone');
  });
});
