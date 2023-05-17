import { type Knex } from 'knex';

export interface User {
	id: string;
	email: string;
	name: string;
	weight: number;
	created_at: string;
}

export interface Meal {
	id: string;
	name: string;
	description: string;
	meal_time: string;
	is_on_diet: boolean;
	user_id: string;
	created_at: string;
	updated_at: string;
}

declare module 'knex/types/tables' {
	export interface Tables {
		users: User;
		meals: Meal;
	}
}
