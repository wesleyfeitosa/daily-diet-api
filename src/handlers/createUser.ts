import { randomUUID } from 'node:crypto';

import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

import { type DatabaseError, knex } from '../database';

export class CreateUserHandler {
	async handler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const createUserBodySchema = z.object({
				email: z.string().email(),
				name: z.string().max(40),
				weight: z.number(),
			});

			const resultValidation = createUserBodySchema.safeParse(request.body);

			if (!resultValidation.success) {
				return await reply.status(400).send(resultValidation.error.message);
			}

			const { email, name, weight } = resultValidation.data;

			const [createdUser] = await knex('users').insert({
				id: randomUUID(),
				email,
				name,
				weight,
			}).returning('*');

			return await reply.status(201).send(createdUser);
		} catch (error) {
			const databaseError = error as DatabaseError;

			if (databaseError.code === 'SQLITE_CONSTRAINT') {
				return reply.status(409).send(databaseError);
			}

			return reply.status(500).send(databaseError);
		}
	}
}

export const createUserHandlerInstance = new CreateUserHandler();
