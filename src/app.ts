import fastify from 'fastify';

import { mealsRoutes } from './routes/meals';
import { usersRoutes } from './routes/users';

export const app = fastify();

app.addHook('preHandler', async (request) => {
	console.log(`[${request.method} - ${request.url}]`);
});

void app.register(usersRoutes, {
	prefix: '/users',
});
void app.register(mealsRoutes, {
	prefix: '/meals',
});
