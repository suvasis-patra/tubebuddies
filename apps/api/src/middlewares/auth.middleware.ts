import { NextFunction, Response, Request } from "express";

import prisma from "@tubebuddies/db/prisma";
import { verifyAccessToken } from "@tubebuddies/auth/tokens";
export async function authorizeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("TOKEN IS :", token);
    const payload = verifyAccessToken(token);
    if (!payload || !payload.userId) {
      throw new Error("Access denied");
    }
    const user = await prisma.user.findFirst({ where: { id: payload.userId } });
    if (!user) throw new Error("User not found");
    req.headers["userId"] = user.id;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ message: "unauthorized user" });
    }
  }
}
