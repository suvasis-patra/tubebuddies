import { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  error: ApiError | Error,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json(error);
    return;
  }
  res.status(500).json(new ApiError(500, "Internal server error"));
};
