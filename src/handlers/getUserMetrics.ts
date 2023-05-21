import { type FastifyReply, type FastifyRequest } from 'fastify';

import { type DatabaseError, knex } from '../database';

interface UserMealsGrouped {
	day: string;
	total: number;
}

function isSameDay(date1: string, date2: string) {
	const day1 = new Date(date1).toISOString().split('T')[0];
	const day2 = new Date(date2).toISOString().split('T')[0];

	return day1 === day2;
}

export class GetUserMetricsHandler {
	async handler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const userId = request.user.id;

			const userFinded = await knex('users').select().where({ id: userId }).first();

			if (!userFinded) {
				return await reply.status(404).send({ statusCode: 404, message: 'User not found' });
			}

			const userMealsGroupedByDate: UserMealsGrouped[] = await knex('meals')
				.where({ user_id: userId })
				.orderBy('meal_time')
				.select(knex.raw('DATE(meal_time) as day, COUNT(*) as total'))
				.groupByRaw('DATE(meal_time)');

			const userMeals = await knex('meals').where({ user_id: userId }).orderBy('meal_time').select();

			let dietStreak = 0;
			let dailyDietStreak = 0;
			const mealsOnDiet = userMeals.filter((meal) => meal.is_on_diet).length;
			const mealsOutDiet = userMeals.filter((meal) => !meal.is_on_diet).length;
			const mealsTotal = userMeals.length;

			userMealsGroupedByDate.forEach((userMealsDate) => {
				const mealsByDay = userMeals.filter((meal) => isSameDay(meal.meal_time, userMealsDate.day));

				if (mealsByDay.every((meal) => meal.is_on_diet)) {
					dailyDietStreak++;
					dietStreak = dailyDietStreak > dietStreak ? dailyDietStreak : dietStreak;
				} else {
					dailyDietStreak = 0;
				}
			});

			return await reply.status(200).send({
				mealsTotal,
				mealsOnDiet,
				mealsOutDiet,
				dietStreak,
				userMealsGroupedByDate,
			});
		} catch (error) {
			const databaseError = error as DatabaseError;

			if (databaseError.code === 'SQLITE_CONSTRAINT') {
				return reply.status(409).send(databaseError);
			}

			return reply.status(500).send(databaseError);
		}
	}
}

export const getUserMetricsHandlerInstance = new GetUserMetricsHandler();
