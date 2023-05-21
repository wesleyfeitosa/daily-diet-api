import { type FastifyInstance } from 'fastify';

import { createMealHandlerInstance } from '../handlers/createMeal';
import { deleteMealHandlerInstance } from '../handlers/deleteMeal';
import { findMealHandlerInstance } from '../handlers/findMeal';
import { listMealsByUsersHandlerInstance } from '../handlers/listMealsByUser';
import { updateMealHandlerInstance } from '../handlers/updateMeal';
import { ensureAuthenticated } from '../middleware/ensureAutheticated';

export async function mealsRoutes(app: FastifyInstance) {
	app.post('/', { preHandler: ensureAuthenticated }, createMealHandlerInstance.handler);
	app.get('/', { preHandler: ensureAuthenticated }, listMealsByUsersHandlerInstance.handler);
	app.put('/:mealId', { preHandler: ensureAuthenticated }, updateMealHandlerInstance.handler);
	app.delete('/:mealId', { preHandler: ensureAuthenticated }, deleteMealHandlerInstance.handler);
	app.get('/:mealId', { preHandler: ensureAuthenticated }, findMealHandlerInstance.handler);
}
