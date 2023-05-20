import { compare } from 'bcrypt';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';

import { type DatabaseError, knex } from '../database';
import { generateTokenProviderInstance } from '../providers/generateTokenProvider';

function unauthorizedError(reply: FastifyReply) {
	return reply.status(401).send({ statusCode: 401, message: 'Email or password invalids' });
}

export class AuthenticateUserHandler {
	async handler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const createUserBodySchema = z.object({
				email: z.string().email(),
				password: z.string().min(6),
			});

			const resultValidation = createUserBodySchema.safeParse(request.body);

			if (!resultValidation.success) {
				return await reply.status(400).send(resultValidation.error.message);
			}

			const { email, password } = resultValidation.data;

			const userSelected = await knex('users').select().where({ email }).first();

			if (!userSelected) {
				return await unauthorizedError(reply);
			}

			const passwordChecked = await compare(password, userSelected.password);

			if (!passwordChecked) {
				return await unauthorizedError(reply);
			}

			const generatedToken = await generateTokenProviderInstance.execute(userSelected.id);

			return await reply.status(200).send({ userAutheticated: true, token: generatedToken });
		} catch (error) {
			const databaseError = error as DatabaseError;

			if (databaseError.code === 'SQLITE_CONSTRAINT') {
				return reply.status(409).send(databaseError);
			}

			return reply.status(500).send(databaseError);
		}
	}
}

export const authenticateUserHandlerInstance = new AuthenticateUserHandler();
