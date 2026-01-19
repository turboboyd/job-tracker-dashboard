import * as Yup from "yup";

export type LoginFormValues = {
  email: string;
  password: string;
};

export const loginValidationSchema: Yup.ObjectSchema<LoginFormValues> = Yup.object({
  email: Yup.string()
    .trim()
    .email("Введите корректный email")
    .required("Email обязателен"),
  password: Yup.string()
    .min(6, "Минимум 6 символов")
    .required("Пароль обязателен"),
});
