import { config } from 'dotenv';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import feedRoutes from './routes/feed.js';

config();

const port = process.env.PORT || 3030;
const fastify = Fastify({ logger: true });

await fastify.register(cors, {
	origin: (origin, cb) => {
		if (!origin || origin.startsWith('http://localhost')) {
			cb(null, true);
		} else {
			cb(new Error('Not allowed by CORS'), false);
		}
	},
});

fastify.register(feedRoutes, { prefix: '/feed' });

const start = async () => {
	try {
		await fastify.listen({ port, host: '0.0.0.0' });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
