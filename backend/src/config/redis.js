const Redis = require('ioredis');
require('dotenv').config();

const redisOptions = {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableReadyCheck: true,

  retryStrategy: (times) => {
    return Math.min(times * 250, 2000);
  },
};

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, redisOptions)
  : new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT || 6379),
      ...redisOptions,
    });

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

redis.on('ready', () => {
  console.log('Redis is ready');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error.message);
});

redis.on('reconnecting', () => {
  console.log('Redis reconnecting...');
});

module.exports = redis;
