import * as yup from "yup";

export const authFormSchema = yup.object().shape({
  email: yup
    .string()
    .email("Ingrese un correo electrónico válido")
    .required("Correo electrónico es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(12, "La contraseña debe tener máximo 12 caracteres")
    .required("Contraseña es requerida"),
  full_name: yup.string().required("Nombre completo es requerido"),
});

export interface AuthForm {
  email: string;
  password: string;
  full_name: string;
}
