import { type FastifyInstance } from 'fastify';

import { createUserHandlerInstance } from '../handlers/createUser';
import { getUserMetricsHandlerInstance } from '../handlers/getUserMetrics';
import { listUsersHandlerInstance } from '../handlers/listUsers';
import { ensureAuthenticated } from '../middleware/ensureAutheticated';

export async function usersRoutes(app: FastifyInstance) {
	app.post('/', createUserHandlerInstance.handler);
	app.get('/', { preHandler: ensureAuthenticated }, listUsersHandlerInstance.handler);
	app.get('/metrics', { preHandler: ensureAuthenticated }, getUserMetricsHandlerInstance.handler);
}
