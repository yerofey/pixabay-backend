import redis from '../utils/redis.js';
import { fetchImages } from './pixabay.js';

export async function buildFeedAsync(feedId, query) {
	try {
		const [regular, graffiti] = await Promise.all([
			fetchImages(query),
			fetchImages(`${query} graffiti`),
		]);

		const feed = [];

		for (let i = 0; i < 10; i++) {
			feed.push({
				regular:
					regular.error || !regular[i] ? { state: 'loading' } : regular[i],
				graffiti:
					graffiti.error || !graffiti[i] ? { state: 'loading' } : graffiti[i],
			});
		}

		await redis.set(feedId, JSON.stringify({ status: 'ready', data: feed }));
	} catch (err) {
		await redis.set(
			feedId,
			JSON.stringify({ status: 'error', error: err.message })
		);
	}
}
