import * as z from "zod";

export enum AuthType {
  STANDARD = "standard",
  GOOGLE = "google",
}

const StandardRegister = z
  .object({
    authType: z.literal(AuthType.STANDARD),
    email: z.email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    username: z.string().min(3).max(30),
  })
  .strict();

const GoogleRegister = z
  .object({
    authType: z.literal(AuthType.GOOGLE),
    email: z.email({ message: "Invalid email address" }),
    googleId: z.string({ message: "Google ID is required" }),
    username: z.string().min(3).max(30).optional(),
  })
  .strict();

export const ZUserRegister = z.discriminatedUnion("authType", [
  StandardRegister,
  GoogleRegister,
]);

const StandardLogin = z
  .object({
    authType: z.literal(AuthType.STANDARD),
    email: z.email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .strict();

const GoogleLogin = z
  .object({
    authType: z.literal(AuthType.GOOGLE),
    googleId: z.string({ message: "Google ID is required" }),
  })
  .strict();

export const ZUserLogin = z.discriminatedUnion("authType", [
  StandardLogin,
  GoogleLogin,
]);
