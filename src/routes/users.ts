import { type FastifyInstance } from 'fastify';

import { authenticateUserHandlerInstance } from '../handlers/authenticateUser';
import { createUserHandlerInstance } from '../handlers/createUser';
import { listMealsByUsersHandlerInstance } from '../handlers/listMealsByUser';
import { listUsersHandlerInstance } from '../handlers/listUsers';
import { ensureAuthenticated } from '../middleware/ensureAutheticated';

export async function usersRoutes(app: FastifyInstance) {
	app.post('/', createUserHandlerInstance.handler);
	app.get('/', { preHandler: ensureAuthenticated }, listUsersHandlerInstance.handler);
	app.post('/login', authenticateUserHandlerInstance.handler);
	app.get('/:userId/meals', { preHandler: ensureAuthenticated }, listMealsByUsersHandlerInstance.handler);
}
