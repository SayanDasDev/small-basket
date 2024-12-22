import { serve } from "@hono/node-server";
import { Hono } from "hono";

import app from "./app";
import env from "./env";

const port = Number(env.PORT) || 3001;
// eslint-disable-next-line no-console
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
