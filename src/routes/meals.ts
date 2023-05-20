import { type FastifyInstance } from 'fastify';

import { createMealHandlerInstance } from '../handlers/createMeal';
import { ensureAuthenticated } from '../middleware/ensureAutheticated';

export async function mealsRoutes(app: FastifyInstance) {
	app.post('/', { preHandler: ensureAuthenticated }, createMealHandlerInstance.handler);
}
