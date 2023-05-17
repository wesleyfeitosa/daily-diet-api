import { type FastifyInstance } from 'fastify';

import { createMealHandlerInstance } from '../handlers/createMeal';

export async function mealsRoutes(app: FastifyInstance) {
	app.post('/', createMealHandlerInstance);
}
