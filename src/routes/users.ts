import { type FastifyInstance } from 'fastify';

import { createUserHandlerInstance } from '../handlers/createUser';
import { listMealsByUsersHandlerInstance } from '../handlers/listMealsByUser';
import { listUsersHandlerInstance } from '../handlers/listUsers';

export async function usersRoutes(app: FastifyInstance) {
	app.post('/', createUserHandlerInstance);
	app.get('/', listUsersHandlerInstance);
	app.get('/:userId/meals', listMealsByUsersHandlerInstance);
}
