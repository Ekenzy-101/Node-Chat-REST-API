import { Request } from "express";
import { validationResult } from "express-validator";

export const getValidationErrors = (req: Request) => {
  const customErrors: Record<string, any> = {};

  const result = validationResult(req);
  const errors = result.array();

  errors.forEach((error) => {
    customErrors[error.param] = error.msg;
  });

  return customErrors;
};
