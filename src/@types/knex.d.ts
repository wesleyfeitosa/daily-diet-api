import { type Knex } from 'knex';

export interface User {
	id: string;
	email: string;
	name: string;
	weight: number;
	created_at: string;
}

declare module 'knex/types/tables' {
	export interface Tables {
		users: User;
	}
}
