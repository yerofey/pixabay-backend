import { config } from 'dotenv';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import feedRoutes from './routes/feed.js';

config();

const fastify = Fastify({ logger: true });

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
const port = process.env.PORT || 3030;

await fastify.register(cors, {
	origin: (origin, cb) => {
		if (!origin || allowedOrigins.includes(origin)) {
			cb(null, true);
		} else {
			cb(new Error('Not allowed by CORS'), false);
		}
	},
});

fastify.register(feedRoutes, { prefix: '/feed' });

const start = async () => {
	try {
		await fastify.listen({ port: Number(port), host: '0.0.0.0' });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
