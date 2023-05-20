import { randomUUID } from 'node:crypto';

import { hash } from 'bcrypt';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

import { type DatabaseError, knex } from '../database';

export class CreateUserHandler {
	async handler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const createUserBodySchema = z.object({
				email: z.string().email(),
				password: z.string().min(6),
				name: z.string().max(40),
				weight: z.number(),
			});

			const resultValidation = createUserBodySchema.safeParse(request.body);

			if (!resultValidation.success) {
				return await reply.status(400).send(resultValidation.error.message);
			}

			const { email, password, name, weight } = resultValidation.data;

			const passwordHashed = await hash(password, 10);

			const [createdUser] = await knex('users')
				.insert({
					id: randomUUID(),
					email,
					password: passwordHashed,
					name,
					weight,
				})
				.returning('*');

			return await reply.status(201).send({
				id: createdUser.id,
				email: createdUser.email,
				name: createdUser.name,
				weight: createdUser.weight,
			});
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
