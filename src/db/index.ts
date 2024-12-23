import { drizzle } from "drizzle-orm/node-postgres";

import env from "@/env";

import * as schema from "./schema";

const db = drizzle({ connection: env.DB_URL, casing: "snake_case", schema });

export default db;
