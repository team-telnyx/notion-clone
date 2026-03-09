import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('name', 255);
    table.text('avatar_url');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('email', 'idx_users_email');
  });

  await knex.schema.createTable('workspaces', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.text('description');
    table.uuid('owner_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('owner_id', 'idx_workspaces_owner_id');
  });

  await knex.schema.createTable('workspace_members', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('workspace_id').notNullable().references('id').inTable('workspaces').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('role', 50).notNullable().defaultTo('member');
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.unique(['workspace_id', 'user_id']);
    table.index('user_id', 'idx_workspace_members_user_id');
  });

  await knex.schema.createTable('pages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title', 255).notNullable().defaultTo('Untitled');
    table.jsonb('content').defaultTo('{}');
    table.uuid('workspace_id').notNullable().references('id').inTable('workspaces').onDelete('CASCADE');
    table.uuid('parent_id').references('id').inTable('pages').onDelete('CASCADE');
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('workspace_id', 'idx_pages_workspace_id');
    table.index('parent_id', 'idx_pages_parent_id');
    table.index('created_by', 'idx_pages_created_by');
  });

  await knex.schema.createTable('blocks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('page_id').notNullable().references('id').inTable('pages').onDelete('CASCADE');
    table.uuid('parent_id').references('id').inTable('blocks').onDelete('CASCADE');
    table.string('type', 50).notNullable();
    table.jsonb('content').defaultTo('{}');
    table.integer('position').notNullable().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('page_id', 'idx_blocks_page_id');
    table.index('parent_id', 'idx_blocks_parent_id');
    table.index(['page_id', 'position'], 'idx_blocks_position');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('blocks');
  await knex.schema.dropTableIfExists('pages');
  await knex.schema.dropTableIfExists('workspace_members');
  await knex.schema.dropTableIfExists('workspaces');
  await knex.schema.dropTableIfExists('users');
}
