import { execSync } from 'node:child_process';

import { faker } from '@faker-js/faker';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, it, expect } from 'vitest';

import { type LoginResponse } from './types';
import { app } from '../src/app';

describe('Sessions routes', () => {
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

	it('should be able to login with an user', async () => {
		const mockEmail = faker.internet.email();
		const mockPassword = faker.internet.password();
		await request(app.server).post('/users').send({
			email: mockEmail,
			password: mockPassword,
			name: 'Wesley Feitosa',
			weight: 70.2,
		});
		const loginResponse: LoginResponse = await request(app.server)
			.post('/sessions/login')
			.send({
				email: mockEmail,
				password: mockPassword,
			})
			.expect(200);

		expect(loginResponse.body).toEqual(
			expect.objectContaining({
				userAutheticated: true,
			}),
		);
	});
});
