import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

import { type DatabaseError, knex } from '../database';

export class UpdateMealHandler {
	async handler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const userId = request.user.id;

			const updateMealBodySchema = z.object({
				name: z.string().max(40),
				description: z.string().max(320),
				mealTime: z.coerce.date(),
				isOnDiet: z.boolean(),
			});

			const updateMealParamSchema = z.object({
				mealId: z.string().uuid(),
			});

			const resultBodyValidation = updateMealBodySchema.safeParse(request.body);
			const resultParamsValidation = updateMealParamSchema.safeParse(request.params);

			if (!resultBodyValidation.success) {
				return await reply.status(400).send(resultBodyValidation.error.message);
			}

			if (!resultParamsValidation.success) {
				return await reply.status(400).send(resultParamsValidation.error.message);
			}

			const userFinded = await knex('users').select().where({ id: userId }).first();

			if (!userFinded) {
				return await reply.status(404).send({ statusCode: 404, message: 'User not found' });
			}

			const { description, isOnDiet, mealTime, name } = resultBodyValidation.data;
			const { mealId } = resultParamsValidation.data;

			const [updatedMeal] = await knex('meals')
				.where({ id: mealId })
				.update({
					name,
					description,
					is_on_diet: isOnDiet,
					meal_time: mealTime.toISOString(),
				})
				.returning('*');

			return await reply.status(200).send(updatedMeal);
		} catch (error) {
			const databaseError = error as DatabaseError;

			if (databaseError.code === 'SQLITE_CONSTRAINT') {
				return reply.status(409).send(databaseError);
			}

			return reply.status(500).send(databaseError);
		}
	}
}

export const updateMealHandlerInstance = new UpdateMealHandler();
