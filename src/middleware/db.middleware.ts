import { prisma } from "#/lib/db/prisma";
import { createMiddleware } from "@tanstack/react-start";

export const dbMiddleware = createMiddleware({ type: "function" }).server(
  ({ next }) => {
    return next({
      context: {
        db: prisma,
      },
    });
  },
);