import { randomUUID } from 'node:crypto';
import redis from '../utils/redis.js';
import { buildFeedAsync } from '../services/feedBuilder.js';

export default async function feedRoutes(fastify) {
	fastify.post('/', async (req, reply) => {
		const { query } = req.body;
		if (!query) return reply.code(400).send({ error: 'Query is required' });

		const feedId = randomUUID();
		await redis.set(feedId, JSON.stringify({ status: 'loading', data: [] }));

		buildFeedAsync(feedId, query);

		return { id: feedId };
	});

	fastify.get('/:id', async (req, reply) => {
		const data = await redis.get(req.params.id);
		if (!data) return reply.code(404).send({ error: 'Feed not found' });

		return JSON.parse(data);
	});
}
