import { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const notFoundErrorHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const error = new ApiError(404, "Not Found!");
    next(error);
  }
);
