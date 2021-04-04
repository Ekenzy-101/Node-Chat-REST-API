import { body } from "express-validator";

export const validateCompany = [
  body("name").notEmpty(),
  body("firstname").notEmpty(),
  body("lastname").notEmpty(),
  body("address").notEmpty(),
  body("city").notEmpty(),
  body("state").notEmpty(),
  body("phone").notEmpty(),
  body("zip").isNumeric(),
  body("email").isEmail(),
];

export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be up to 6 characters"),
];

export const validateRegister = [
  ...validateLogin,
  body("name").notEmpty().withMessage("Name is required"),
];
