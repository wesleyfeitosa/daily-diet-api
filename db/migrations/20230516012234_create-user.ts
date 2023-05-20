import { type Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('users', (table) => {
		table.uuid('id').primary();
		table.string('email').unique().notNullable();
		table.string('password').notNullable();
		table.string('name').notNullable();
		table.float('weight').notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('users');
}
