import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.string('session_id').unique().notNullable()
    table.string('name').notNullable()
    table.string('email').unique().notNullable()
    table.timestamps(true, true) // Adds created_at and updated_at columns
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
