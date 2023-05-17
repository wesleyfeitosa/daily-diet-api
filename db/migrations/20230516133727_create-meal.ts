import { type Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('meals', table => {
		table.uuid('id').primary();
		table.string('name').notNullable();
		table.text('description').notNullable();
		table.timestamp('meal_time').notNullable();
		table.boolean('is_on_diet').notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
		table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('meals');
}

