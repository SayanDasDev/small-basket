import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import defaultHook from "stoker/openapi/default-hook";

import type { AppBindings } from "@/lib/types";

import { pinoLogger } from "@/middleware/pino-logger";

import { auth } from "./auth";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(serveEmojiFavicon("🛒"));
  app.use(pinoLogger());

  app.use(
    "*",
    cors({
      origin: "http://localhost:3001", // replace with your origin
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  );

  app.use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  });

  app.on(["POST", "GET"], "/api/auth/**", (c) => {
    return auth.handler(c.req.raw);
  });

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
