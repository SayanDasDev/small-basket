import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { createRouter } from "@/lib/create-app";

const router = createRouter()
  .openapi(createRoute({
    tags: ["index"],
    method: "get",
    path: "/",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema("Welcome to Small Basket!"),
        "Small Basket API welcome message",
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        createMessageObjectSchema("You are not logged in"),
        "Unauthorized",
      ),
    },
  }), (c) => {
    const session = c.get("session");

    if (!session) {
      return c.json({
        message: "Not logged In",
      }, 401);
    }

    return c.json({
      message: "Welcome to Small Basket!",
    });
  });

export default router;
