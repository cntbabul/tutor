
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function test() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("Connection successful:", result);
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

test();
