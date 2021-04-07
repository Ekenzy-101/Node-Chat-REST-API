import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import _ from "lodash";

import { User } from "../models";
import { validateLogin, validateRegister } from "../middlewares/validation";
import { cookieOptions } from "../utils/cookies";
import { getValidationErrors } from "../utils/validation";
import { ACCESS_TOKEN_COOKIE_NAME } from "../config";

const router = Router();

interface LoginBody {
  email: string;
  password: string;
}

interface LoginRequest extends Request<any, any, LoginBody> {}

interface RegisterBody extends LoginBody {
  name: string;
}
interface RegisterRequest extends Request<any, any, RegisterBody> {}

router.get("/me", async (req: LoginRequest, res: Response) => {
  return res.send(req.user);
});

router.post(
  "/login",
  validateLogin,
  async (req: LoginRequest, res: Response) => {
    const errors = getValidationErrors(req);
    if (Object.keys(errors).length) return res.status(400).send(errors);

    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).send({ message: "Invalid Email or Password" });

    const isValid = bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(400).send({ message: "Invalid Email or Password" });

    const token = user.generateAccessToken();
    const response = _.pick(user, ["id", "name", "email", "image"]);

    return res
      .cookie(ACCESS_TOKEN_COOKIE_NAME, token, cookieOptions)
      .send(response);
  }
);

router.post(
  "/register",
  validateRegister,
  async (req: RegisterRequest, res: Response) => {
    const errors = getValidationErrors(req);
    if (Object.keys(errors).length) return res.status(400).send(errors);

    const { email, password, name } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).send({ email: "Email already exist" });

    const hashedPassword = await bcrypt.hash(password, 15);

    user = await User.create({ email, name, password: hashedPassword });
    const token = user.generateAccessToken();

    const response = _.pick(user, ["id", "name", "email", "image"]);

    return res
      .status(201)
      .cookie(ACCESS_TOKEN_COOKIE_NAME, token, cookieOptions)
      .send(response);
  }
);

export default router;
