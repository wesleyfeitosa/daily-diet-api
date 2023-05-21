import jwt from 'jsonwebtoken';

import { env } from '../env';

class GenerateTokenProvider {
	async execute(userId: string) {
		const token = jwt.sign({ sub: userId }, env.JWT_SECRET, {
			expiresIn: '1d',
		});

		return token;
	}
}

export const generateTokenProviderInstance = new GenerateTokenProvider();
