import 'dotenv/config';
import { createClient } from "@libsql/client";

// auth constant
export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});




