import { type Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.table('meals', (table) => {
		table.uuid('user_id');
		table.foreign('user_id').references('users.id');
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.table('meals', (table) => {
		table.dropForeign('user_id');
		table.dropColumn('user_id');
	});
}
