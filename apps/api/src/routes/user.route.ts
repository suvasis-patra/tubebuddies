import { Router } from "express";

import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "../controllers/user.controller";
import { authorizeUser } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/refresh-token").post(authorizeUser, refreshToken);
router.route("/logout").post(authorizeUser, logoutUser);

export default router;
