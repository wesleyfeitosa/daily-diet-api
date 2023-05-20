import fastify from 'fastify';

declare module 'fastify' {
	export interface FastifyRequest {
		user: { id: string };
	}
}
