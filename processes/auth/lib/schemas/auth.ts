import { z } from "zod";
import type { Dictionary } from "@/types/dictionary";

export type LoginFormData = {
  login: string;
  password: string;
};

export type RegisterFormData = {
  login: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordFormData = {
  login: string;
};

export type NewPasswordFormData = {
  password: string;
  confirmPassword: string;
};

export const createLoginSchema = (dict: Dictionary) =>
  z.object({
  login: z.string().min(2, {
      message: dict.validation.login.minLength,
  }),
  password: z.string().min(6, {
      message: dict.validation.password.minLength,
  }),
});

export const createRegisterSchema = (dict: Dictionary) =>
  z
  .object({
    login: z
      .string()
      .min(2, {
          message: dict.validation.login.minLength,
      })
      .max(20, {
          message: dict.validation.login.maxLength,
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
          message: dict.validation.login.pattern,
      }),
    email: z.string().email({
        message: dict.validation.email.invalid,
    }),
    password: z
      .string()
      .min(6, {
          message: dict.validation.password.minLength,
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
          message: dict.validation.password.complexity,
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
      message: dict.validation.password.mismatch,
    path: ["confirmPassword"],
  });

export const createResetPasswordSchema = (dict: Dictionary) =>
  z.object({
  login: z.string().min(2, {
      message: dict.validation.login.required,
  }),
});

export const createNewPasswordSchema = (dict: Dictionary) =>
  z
  .object({
    password: z
      .string()
      .min(6, {
          message: dict.validation.password.minLength,
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
          message: dict.validation.password.complexity,
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
      message: dict.validation.password.mismatch,
    path: ["confirmPassword"],
  });
