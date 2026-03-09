import { db as knex, closeConnection } from '../src/db/knex';

const EXPECTED_TABLES = ['users', 'workspaces', 'workspace_members', 'pages', 'blocks'];
const EXPECTED_INDEXES = [
  { table: 'users', index: 'idx_users_email' },
  { table: 'workspaces', index: 'idx_workspaces_owner_id' },
  { table: 'workspace_members', index: 'idx_workspace_members_user_id' },
  { table: 'pages', index: 'idx_pages_workspace_id' },
  { table: 'pages', index: 'idx_pages_parent_id' },
  { table: 'pages', index: 'idx_pages_created_by' },
  { table: 'blocks', index: 'idx_blocks_page_id' },
  { table: 'blocks', index: 'idx_blocks_parent_id' },
  { table: 'blocks', index: 'idx_blocks_position' },
];

async function verifyMigrations() {
  console.log('Verifying database migrations...\n');
  let hasErrors = false;

  const existingTables = await knex.raw(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `);
  const tableNames = existingTables.rows.map((r: { table_name: string }) => r.table_name);

  console.log('Tables:');
  for (const table of EXPECTED_TABLES) {
    const exists = tableNames.includes(table);
    console.log(`  ${exists ? '✓' : '✗'} ${table}`);
    if (!exists) hasErrors = true;
  }

  const existingIndexes = await knex.raw(`
    SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public'
  `);
  const indexMap = new Map(
    existingIndexes.rows.map((r: { tablename: string; indexname: string }) => [r.indexname, r.tablename])
  );

  console.log('\nIndexes:');
  for (const { table, index } of EXPECTED_INDEXES) {
    const exists = indexMap.get(index) === table;
    console.log(`  ${exists ? '✓' : '✗'} ${index} on ${table}`);
    if (!exists) hasErrors = true;
  }

  console.log('\n' + '='.repeat(40));
  if (hasErrors) {
    console.log('VERIFICATION FAILED: Some migrations may not have run.');
    process.exit(1);
  }
  console.log('VERIFICATION PASSED: All migrations applied successfully.');
  process.exit(0);
}

verifyMigrations()
  .catch((err) => {
    console.error('Verification failed:', err);
    process.exit(1);
  })
  .finally(() => closeConnection());
