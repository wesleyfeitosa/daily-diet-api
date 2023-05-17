import { type FastifyRequest, type FastifyReply } from 'fastify';

import { type DatabaseError, knex } from '../database';

export class ListUsersHandler {
	async handler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const usersFinded = await knex('users').select();

			return await reply.status(200).send(usersFinded);
		} catch (error) {
			const databaseError = error as DatabaseError;

			if (databaseError.code === 'SQLITE_CONSTRAINT') {
				return reply.status(409).send(databaseError);
			}

			return reply.status(500).send(databaseError);
		}
	}
}

export const listUsersHandlerInstance = new ListUsersHandler();
