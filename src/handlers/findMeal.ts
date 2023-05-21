import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

import { type DatabaseError, knex } from '../database';

export class FindMealHandler {
	async handler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const userId = request.user.id;

			const updateMealParamSchema = z.object({
				mealId: z.string().uuid(),
			});

			const resultParamsValidation = updateMealParamSchema.safeParse(request.params);

			if (!resultParamsValidation.success) {
				return await reply.status(400).send(resultParamsValidation.error.message);
			}

			const userFinded = await knex('users').select().where({ id: userId }).first();

			if (!userFinded) {
				return await reply.status(404).send({ statusCode: 404, message: 'User not found' });
			}

			const { mealId } = resultParamsValidation.data;

			const [findedMeal] = await knex('meals').where({ id: mealId }).select();

			if (!findedMeal) {
				return await reply.status(404).send({ statusCode: 404, message: 'Meal not found' });
			}

			return await reply.status(200).send(findedMeal);
		} catch (error) {
			const databaseError = error as DatabaseError;

			if (databaseError.code === 'SQLITE_CONSTRAINT') {
				return reply.status(409).send(databaseError);
			}

			return reply.status(500).send(databaseError);
		}
	}
}

export const findMealHandlerInstance = new FindMealHandler();
