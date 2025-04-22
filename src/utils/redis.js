import { config } from 'dotenv';
import Redis from 'ioredis';

config();

const redis = new Redis(process.env.REDIS_URL);

redis.on('error', (err) => {
	console.error('ioredis error:', err);
});

export default redis;
