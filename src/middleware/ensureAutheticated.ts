import { type FastifyReply, type FastifyRequest } from 'fastify';
import { verify } from 'jsonwebtoken';

import { env } from '../env';

export async function ensureAuthenticated(request: FastifyRequest, reply: FastifyReply) {
	const authToken = request.headers.authorization;

	if (!authToken) {
		return reply.status(401).send({ statusCode: 401, message: 'Token not provided' });
	}

	const [, token] = authToken.split(' ');

	try {
		verify(token, env.JWT_SECRET);
	} catch (error) {
		return reply.status(401).send({ statusCode: 401, message: 'Invalid token' });
	}
}
