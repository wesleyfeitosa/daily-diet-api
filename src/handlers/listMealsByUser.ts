import { type FastifyRequest, type FastifyReply } from 'fastify';
import { z } from 'zod';

import { type DatabaseError, knex } from '../database';

export class ListMealsByUsersHandler {
	async handler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const listMealsByUserParamSchema = z.object({
				userId: z.string().uuid(),
			});

			const resultValidation = listMealsByUserParamSchema.safeParse(request.params);

			if (!resultValidation.success) {
				return await reply.status(400).send(resultValidation.error.message);
			}

			const { userId } = resultValidation.data;

			const userFinded = await knex('users').select().where({ id: userId }).first();

			if (!userFinded) {
				return await reply.status(404).send({ statusCode: 404, message: 'User not found' });
			}

			const mealsFinded = await knex('meals').select().where({ user_id: userId });

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
