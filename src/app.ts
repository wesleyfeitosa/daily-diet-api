import fastify from 'fastify';

import { usersRoutes } from './routes/users';

export const app = fastify();

app.addHook('preHandler', async request => {
	console.log(`[${request.method} - ${request.url}]`);
});

void app.register(usersRoutes, {
	prefix: '/users',
});
