import { type FastifyRequest, type FastifyReply } from 'fastify';

import { type DatabaseError, knex } from '../database';

export class ListMealsByUsersHandler {
	async handler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const userId = request.user.id;

			const userFinded = await knex('users').select().where({ id: userId }).first();

			if (!userFinded) {
				return await reply.status(404).send({ statusCode: 404, message: 'User not found' });
			}

			const mealsFinded = await knex('meals').select().where({ user_id: userId }).orderBy('meal_time');

			return await reply.status(200).send(mealsFinded);
		} catch (error) {
			const databaseError = error as DatabaseError;

			if (databaseError.code === 'SQLITE_CONSTRAINT') {
				return reply.status(409).send(databaseError);
			}

			return reply.status(500).send(databaseError);
		}
	}
}

export const listMealsByUsersHandlerInstance = new ListMealsByUsersHandler();
