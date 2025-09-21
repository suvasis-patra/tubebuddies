import jwt, { JwtPayload } from "jsonwebtoken";

type TJWTClaims = {
  userId: string;
  username: string;
};

export const generateAccessToken = (payload: TJWTClaims) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "24h",
  });
  return accessToken;
};

export const generateRefreshToken = (payload: TJWTClaims) => {
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "1w",
  });
  return refreshToken;
};

export const verifyAccessToken = (token: string) => {
  const payload = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!
  ) as JwtPayload;
  return payload;
};

export const verifyRefreshToken = (token: string) => {
  const payload = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET!
  ) as JwtPayload;
  return payload;
};
