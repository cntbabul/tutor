import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const str = "postgresql://neondb_owner:npg_0DHtQ4EceMVr@ep-spring-star-an47chio-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({ connectionString: str });
pool.query("SELECT 1").then(console.log).catch(console.error);
