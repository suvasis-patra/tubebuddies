import { Request, Response } from "express";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@tubebuddies/auth/tokens";
import prisma from "@tubebuddies/db/prisma";
import { ZUserLogin, ZUserRegister } from "@tubebuddies/schemas/user";

import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { hashPassword, verifyPassword } from "../utils";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const validateData = ZUserRegister.safeParse(req.body);
    if (!validateData.success) {
      console.log("Invalid data!", validateData.error);
      throw new ApiError(400, "Invalid data!");
    }
    if (validateData.data.authType === "standard") {
      const { email, password, username } = validateData.data;
      const existingUser = await prisma.user.findFirst({ where: { email } });
      if (existingUser) {
        throw new ApiError(401, "User already exist");
      }
      const hashedPassword = await hashPassword(password);
      if (hashedPassword) {
        const response = await prisma.user.create({
          data: { email, password: hashedPassword, username },
        });
        res
          .status(201)
          .json(
            new ApiResponse<{ userId: string }>(
              201,
              { userId: response.id },
              "Registered successfully!"
            )
          );
      }
    }
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const validatedFields = ZUserLogin.safeParse(req.body);
  if (!validatedFields.success) {
    throw new ApiError(401, validatedFields.error.message);
  }
  if (validatedFields.data.authType === "standard") {
    const { email, password } = validatedFields.data;
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user || !user.password || !user.username) {
      throw new ApiError(404, "User not found!");
    }
    const isPasswordCorrect = await verifyPassword({
      password,
      hashedPassword: user.password,
    });
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Unauthorized user");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const accessToken = generateAccessToken({
      userId: user.id,
      username: user.username,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username,
    });
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse<{ userId: string }>(
          200,
          { userId: user.id },
          "Logged in successfully!"
        )
      );
  }
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new ApiError(400, "Token is required!");
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new ApiError(403, "Invalid or expired refresh token!");
    }

    const payload = verifyRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      username: payload.username,
    });
    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .json(new ApiResponse(200, {}, "Access token refreshed!"));
  }
);

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(203).json(new ApiResponse(203, {}, "Logged out successfully!"));
});
