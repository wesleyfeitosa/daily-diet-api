import { execSync } from 'node:child_process';

import { faker } from '@faker-js/faker';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, it, expect } from 'vitest';

import { type CreateMealResponse, type LoginResponse } from './types';
import { app } from '../src/app';

describe('Meals routes', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(() => {
		execSync('npm run knex migrate:latest');
	});

	afterEach(() => {
		execSync('npm run knex migrate:rollback --all');
	});

	it('should be able to create a new meal', async () => {
		const mockEmail = faker.internet.email();
		const mockPassword = faker.internet.password();
		await request(app.server).post('/users').send({
			email: mockEmail,
			password: mockPassword,
			name: 'Wesley Feitosa',
			weight: 70.2,
		});
		const loginResponse: LoginResponse = await request(app.server).post('/sessions/login').send({
			email: mockEmail,
			password: mockPassword,
		});
		await request(app.server)
			.post('/meals')
			.set('Authorization', `Bearer ${loginResponse.body.token}`)
			.send({
				name: 'Merenda',
				description: 'Doce de leite',
				mealTime: '2023-05-16T12:47:25.975Z',
				isOnDiet: false,
			})
			.expect(201);
	});

	it('should be able to list all meals of the user', async () => {
		const mockEmail = faker.internet.email();
		const mockPassword = faker.internet.password();
		await request(app.server).post('/users').send({
			email: mockEmail,
			password: mockPassword,
			name: 'Daiane Sousa',
			weight: 62.2,
		});
		const loginResponse: LoginResponse = await request(app.server).post('/sessions/login').send({
			email: mockEmail,
			password: mockPassword,
		});
		await request(app.server).post('/meals').set('Authorization', `Bearer ${loginResponse.body.token}`).send({
			name: 'Merenda',
			description: 'Doce de leite',
			mealTime: '2023-05-16T12:47:25.975Z',
			isOnDiet: false,
		});
		await request(app.server).post('/meals').set('Authorization', `Bearer ${loginResponse.body.token}`).send({
			name: 'Merenda',
			description: 'Doce de leite',
			mealTime: '2023-05-17T12:47:25.975Z',
			isOnDiet: false,
		});
		await request(app.server).post('/meals').set('Authorization', `Bearer ${loginResponse.body.token}`).send({
			name: 'Merenda',
			description: 'Doce de leite',
			mealTime: '2023-05-18T12:47:25.975Z',
			isOnDiet: false,
		});
		const mealsByUser = await request(app.server)
			.get('/meals')
			.set('Authorization', `Bearer ${loginResponse.body.token}`);

		expect(mealsByUser.statusCode).toEqual(200);
		expect(mealsByUser.body).toEqual([
			expect.objectContaining({
				name: 'Merenda',
				description: 'Doce de leite',
				meal_time: '2023-05-16T12:47:25.975Z',
				is_on_diet: 0,
			}),
			expect.objectContaining({
				name: 'Merenda',
				description: 'Doce de leite',
				meal_time: '2023-05-17T12:47:25.975Z',
				is_on_diet: 0,
			}),
			expect.objectContaining({
				name: 'Merenda',
				description: 'Doce de leite',
				meal_time: '2023-05-18T12:47:25.975Z',
				is_on_diet: 0,
			}),
		]);
	});

	it('should be able to edit a specific meal', async () => {
		const mockEmail = faker.internet.email();
		const mockPassword = faker.internet.password();
		await request(app.server).post('/users').send({
			email: mockEmail,
			password: mockPassword,
			name: 'Wesley Feitosa',
			weight: 70.2,
		});
		const loginResponse: LoginResponse = await request(app.server).post('/sessions/login').send({
			email: mockEmail,
			password: mockPassword,
		});
		const createdMeal: CreateMealResponse = await request(app.server)
			.post('/meals')
			.set('Authorization', `Bearer ${loginResponse.body.token}`)
			.send({
				name: 'Merenda',
				description: 'Doce de leite',
				mealTime: '2023-05-16T12:47:25.975Z',
				isOnDiet: false,
			});
		await request(app.server)
			.put(`/meals/${createdMeal.body.id}`)
			.set('Authorization', `Bearer ${loginResponse.body.token}`)
			.send({
				name: 'Almoço',
				description: 'Feijoada',
				mealTime: '2023-05-18T12:47:25.975Z',
				isOnDiet: false,
			});
		const findMealResponse = await request(app.server)
			.get(`/meals/${createdMeal.body.id}`)
			.set('Authorization', `Bearer ${loginResponse.body.token}`);

		expect(findMealResponse.statusCode).toEqual(200);
		expect(findMealResponse.body).toEqual(
			expect.objectContaining({
				name: 'Almoço',
				description: 'Feijoada',
				meal_time: '2023-05-18T12:47:25.975Z',
				is_on_diet: 0,
			}),
		);
	});

	it('should be able to delete a specific meal', async () => {
		const mockEmail = faker.internet.email();
		const mockPassword = faker.internet.password();
		await request(app.server).post('/users').send({
			email: mockEmail,
			password: mockPassword,
			name: 'Wesley Feitosa',
			weight: 70.2,
		});
		const loginResponse: LoginResponse = await request(app.server).post('/sessions/login').send({
			email: mockEmail,
			password: mockPassword,
		});
		const createdMeal: CreateMealResponse = await request(app.server)
			.post('/meals')
			.set('Authorization', `Bearer ${loginResponse.body.token}`)
			.send({
				name: 'Merenda',
				description: 'Doce de leite',
				mealTime: '2023-05-16T12:47:25.975Z',
				isOnDiet: false,
			});
		await request(app.server)
			.delete(`/meals/${createdMeal.body.id}`)
			.set('Authorization', `Bearer ${loginResponse.body.token}`);
		const findMealResponse = await request(app.server)
			.get(`/meals/${createdMeal.body.id}`)
			.set('Authorization', `Bearer ${loginResponse.body.token}`);

		expect(findMealResponse.statusCode).toEqual(404);
		expect(findMealResponse.body).toEqual({ message: 'Meal not found', statusCode: 404 });
	});

	it('should be able to find a specific meal', async () => {
		const mockEmail = faker.internet.email();
		const mockPassword = faker.internet.password();
		await request(app.server).post('/users').send({
			email: mockEmail,
			password: mockPassword,
			name: 'Wesley Feitosa',
			weight: 70.2,
		});
		const loginResponse: LoginResponse = await request(app.server).post('/sessions/login').send({
			email: mockEmail,
			password: mockPassword,
		});
		const createdMeal: CreateMealResponse = await request(app.server)
			.post('/meals')
			.set('Authorization', `Bearer ${loginResponse.body.token}`)
			.send({
				name: 'Merenda',
				description: 'Doce de leite',
				mealTime: '2023-05-16T12:47:25.975Z',
				isOnDiet: false,
			});
		const findMealResponse = await request(app.server)
			.get(`/meals/${createdMeal.body.id}`)
			.set('Authorization', `Bearer ${loginResponse.body.token}`);

		expect(findMealResponse.statusCode).toEqual(200);
		expect(findMealResponse.body).toEqual(
			expect.objectContaining({
				name: 'Merenda',
				description: 'Doce de leite',
				meal_time: '2023-05-16T12:47:25.975Z',
				is_on_diet: 0,
			}),
		);
	});
});
