import { env } from 'cloudflare:workers';
const testEnv = env as Env & { TEST_SCHEMA: string };
await testEnv.DB.batch(testEnv.TEST_SCHEMA.split(';').filter((sql) => sql.trim()).map((sql) => testEnv.DB.prepare(sql)));
