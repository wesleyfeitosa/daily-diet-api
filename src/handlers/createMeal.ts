import { randomUUID } from 'node:crypto';

import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

import { knex, type DatabaseError } from '../database';

export class CreateMealHandler {
	async handler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const createMealBodySchema = z.object({
				name: z.string().max(40),
				description: z.string().max(320),
				mealTime: z.coerce.date(),
				isOnDiet: z.boolean(),
				userId: z.string().uuid(),
			});

			const resultValidation = createMealBodySchema.safeParse(request.body);

			if (!resultValidation.success) {
				return await reply.status(400).send(resultValidation.error.message);
			}

			const { description, isOnDiet, mealTime, name, userId } = resultValidation.data;

			const userFinded = await knex('users').select().where({ id: userId }).first();

			if (!userFinded) {
				return await reply.status(404).send({ statusCode: 404, message: 'User not found' });
			}

			const [createdMeal] = await knex('meals')
				.insert({
					id: randomUUID(),
					name,
					description,
					meal_time: mealTime.toISOString(),
					is_on_diet: isOnDiet,
					user_id: userId,
				})
				.returning('*');

			return await reply.status(201).send(createdMeal);
		} catch (error) {
			const databaseError = error as DatabaseError;

			if (databaseError.code === 'SQLITE_CONSTRAINT') {
				return reply.status(409).send(databaseError);
			}

			return reply.status(500).send(databaseError);
		}
	}
}

export const createMealHandlerInstance = new CreateMealHandler();
