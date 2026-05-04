import { Client } from 'pg';
import { Pool } from '@neondatabase/serverless';

const str = "postgresql://neondb_owner:npg_0DHtQ4EceMVr@ep-spring-star-an47chio-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require";

const p = new Pool({ connectionString: str });
console.log("Pool options:", p.options);

const c = new Client({ connectionString: str });
console.log("Client host:", c.host);
