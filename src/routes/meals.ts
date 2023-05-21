import { type FastifyInstance } from 'fastify';

import { createMealHandlerInstance } from '../handlers/createMeal';
import { listMealsByUsersHandlerInstance } from '../handlers/listMealsByUser';
import { updateMealHandlerInstance } from '../handlers/updateMeal';
import { ensureAuthenticated } from '../middleware/ensureAutheticated';

export async function mealsRoutes(app: FastifyInstance) {
	app.post('/', { preHandler: ensureAuthenticated }, createMealHandlerInstance.handler);
	app.get('/', { preHandler: ensureAuthenticated }, listMealsByUsersHandlerInstance.handler);
	app.put('/:mealId', { preHandler: ensureAuthenticated }, updateMealHandlerInstance.handler);
}
