import { type FastifyInstance } from 'fastify';

import { createUserHandlerInstance } from '../handlers/createUser';
import { listUsersHandlerInstance } from '../handlers/listUsers';
import { ensureAuthenticated } from '../middleware/ensureAutheticated';

export async function usersRoutes(app: FastifyInstance) {
	app.post('/', createUserHandlerInstance.handler);
	app.get('/', { preHandler: ensureAuthenticated }, listUsersHandlerInstance.handler);
}
