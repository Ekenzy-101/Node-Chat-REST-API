import { IS_PRODUCTION } from "../config";

const MILLISECONDS_IN_ONE_DAY = 1000 * 60 * 60 * 24;

export const cookieOptions = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  path: "/",
  sameSite: IS_PRODUCTION ? ("none" as const) : ("lax" as const),
  maxAge: MILLISECONDS_IN_ONE_DAY,
};
