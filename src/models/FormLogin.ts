import * as yup from "yup";

export const authFormLoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Ingrese un correo electrónico válido")
    .required("Correo electrónico es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(12, "La contraseña debe tener máximo 12 caracteres")
    .required("Contraseña es requerida"),
});

export interface AuthFormLogin {
  email: string;
  password: string;
}
