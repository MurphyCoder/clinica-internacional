import { useState } from "react";
import { AuthFormLogin, authFormLoginSchema } from "@/models/FormLogin";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import appFirebase from "@/utils/credentials_firebase";

const loginForm = () => {
  const auth = getAuth(appFirebase);
  const db = getFirestore(appFirebase);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormLogin>({
    resolver: yupResolver(authFormLoginSchema),
  });

  const handleFormSubmit = async (data: AuthFormLogin) => {
    console.log(data);
    setErrorMessage(null);
    setLoading(true);
    const { email, password } = data;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Signed in
      const user = userCredential.user;
      console.log("Usuario logeado", user);
      reset();
    } catch (error: any) {
      console.log("Error al iniciar sesión", error);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      {errorMessage && (
        <p className="rounded-md bg-red-400 px-3 py-2 text-center text-white">
          {errorMessage}
        </p>
      )}

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex w-full max-w-md flex-col space-y-2"
      >
        <div>
          <input
            type="email"
            placeholder="Correo Electrónico"
            className=" w-full rounded-lg border border-gray-300 p-2"
            {...register("email")}
          />
          {errors.email ? (
            <span className=" px-2 text-sm text-red-700 ">
              {errors.email.message}
            </span>
          ) : (
            <></>
          )}
        </div>
        <div>
          <input
            {...register("password")}
            placeholder="Contraseña"
            type="password"
            className=" w-full rounded-lg border border-gray-300 p-2"
          />
          {errors.password ? (
            <span className=" px-2 text-sm text-red-700 ">
              {errors.password.message}
            </span>
          ) : (
            <></>
          )}
        </div>
        <button
          className="bg-primary-500 rounded-lg p-2 text-white disabled:opacity-50"
          disabled={loading}
        >
          Iniciar Sesión
        </button>
      </form>
    </>
  );
};

export default loginForm;
