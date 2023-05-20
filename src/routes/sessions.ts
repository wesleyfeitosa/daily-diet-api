import { type FastifyInstance } from 'fastify';

import { authenticateUserHandlerInstance } from '../handlers/authenticateUser';

export async function sessionsRoutes(app: FastifyInstance) {
	app.post('/login', authenticateUserHandlerInstance.handler);
}
