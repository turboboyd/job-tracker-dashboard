import * as Yup from "yup";

export type AuthMode = "signin" | "signup";

export type AuthFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  source: string;
  agree: boolean;
};

export const authInitialValues: AuthFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  source: "",
  agree: false,
};

const email = Yup.string()
  .trim()
  .email("Введите корректный email")
  .required("Email обязателен");

const password = Yup.string()
  .min(6, "Минимум 6 символов")
  .required("Пароль обязателен");

export function getAuthSchema(
  mode: AuthMode
): Yup.ObjectSchema<AuthFormValues> {
  if (mode === "signin") {
    return Yup.object({
      firstName: Yup.string().default(""),
      lastName: Yup.string().default(""),
      email,
      password,
      confirmPassword: Yup.string().default(""),
      source: Yup.string().default(""),
      agree: Yup.boolean().default(false),
    });
  }

  return Yup.object({
    firstName: Yup.string().trim().required("Имя обязательно"),
    lastName: Yup.string().trim().required("Фамилия обязательна"),
    email,
    password,
    confirmPassword: Yup.string()
      .required("Подтвердите пароль")
      .oneOf([Yup.ref("password")], "Пароли не совпадают"),
    source: Yup.string().required("Выберите вариант"),
    agree: Yup.boolean()
      .oneOf([true], "Нужно согласиться с условиями")
      .defined(),
  });
}
