import { type FastifyInstance } from 'fastify';

import { createUserHandlerInstance } from '../handlers/createUser';

export async function usersRoutes(app: FastifyInstance) {
	app.post('/', createUserHandlerInstance);
}
