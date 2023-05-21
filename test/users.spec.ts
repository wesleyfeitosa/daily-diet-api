import { execSync } from 'node:child_process';

import { faker } from '@faker-js/faker';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, it, expect } from 'vitest';

import { type LoginResponse } from './types';
import { app } from '../src/app';

describe('Users routes', () => {
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

	it('should be able to create a new user', async () => {
		const mockEmail = faker.internet.email();
		const mockPassword = faker.internet.password();
		await request(app.server)
			.post('/users')
			.send({
				email: mockEmail,
				password: mockPassword,
				name: 'Daiane Sousa',
				weight: 62.2,
			})
			.expect(201);
	});

	it('should be able to list all users', async () => {
		const mockEmailA = faker.internet.email();
		const mockPasswordA = faker.internet.password();
		const mockEmailB = faker.internet.email();
		const mockPasswordB = faker.internet.password();
		await request(app.server).post('/users').send({
			email: mockEmailA,
			password: mockPasswordA,
			name: 'Wesley Feitosa',
			weight: 70.2,
		});
		await request(app.server).post('/users').send({
			email: mockEmailB,
			password: mockPasswordB,
			name: 'Daiane Sousa',
			weight: 62.2,
		});
		const loginResponse: LoginResponse = await request(app.server).post('/sessions/login').send({
			email: mockEmailB,
			password: mockPasswordB,
		});
		const listUsersResponse = await request(app.server)
			.get('/users')
			.set('Authorization', `Bearer ${loginResponse.body.token}`);

		expect(listUsersResponse.body).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					email: mockEmailA,
					name: 'Wesley Feitosa',
					weight: 70.2,
				}),
				expect.objectContaining({
					email: mockEmailB,
					name: 'Daiane Sousa',
					weight: 62.2,
				}),
			]),
		);
	});

	it('should be able to returning the daily diet metrics of the users', async () => {
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
		await request(app.server).post('/meals').set('Authorization', `Bearer ${loginResponse.body.token}`).send({
			name: 'Merenda',
			description: 'Doce de leite',
			mealTime: '2023-05-16T12:47:25.975Z',
			isOnDiet: false,
		});
		await request(app.server).post('/meals').set('Authorization', `Bearer ${loginResponse.body.token}`).send({
			name: 'Merenda',
			description: 'Barra de proteína',
			mealTime: '2023-05-17T12:47:25.975Z',
			isOnDiet: true,
		});
		await request(app.server).post('/meals').set('Authorization', `Bearer ${loginResponse.body.token}`).send({
			name: 'Merenda',
			description: 'Barra de proteína',
			mealTime: '2023-05-18T12:47:25.975Z',
			isOnDiet: true,
		});
		const metricsResponse = await request(app.server)
			.get('/users/metrics')
			.set('Authorization', `Bearer ${loginResponse.body.token}`);

		expect(metricsResponse.body).toEqual(
			expect.objectContaining({
				dietStreak: 2,
				mealsOnDiet: 2,
				mealsOutDiet: 1,
				mealsTotal: 3,
			}),
		);
	});
});
