import { useState } from "react";
import { AuthForm, authFormSchema } from "@/models/Form";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import appFirebase from "@/utils/credentials_firebase";
import Cookies from "js-cookie";

const RegisterForm = () => {
  const auth = getAuth(appFirebase);
  const db = getFirestore(appFirebase);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [user, setUser] = useState(null) as any;

  // onAuthStateChanged para saber si el usuario está logeado
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      const uid = user.uid;
      console.log("Usuario logeadoasdasd", uid, user.email);
      setUser(user);
    } else {
      // User is signed out
      console.log("Usuario no logeado");
      setUser(null);
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthForm>({
    resolver: yupResolver(authFormSchema),
  });

  const handleFormSubmit = async (data: AuthForm) => {
    setErrorMessage(null);
    setLoading(true);
    const { email, password, full_name } = data;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Signed in
      const user = userCredential.user;
      console.log("Usuario registrado", user);
      reset();
      // Si el usuario se logea, se guarda en la base de datos de firestore los datos del usuario
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          lastLogin: new Date(),
          group: "miachis",
          uid_agora_user: "miachis_uid_agora_user",
          full_name: full_name,
        });
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log("Error al iniciar sesión", error);
      setErrorMessage(error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("Usuario deslogeado");
      Cookies.remove("authTokensEmail");
    } catch (error) {
      console.log("Error al deslogear usuario", error);
    }
  };

  return (
    <>
      {errorMessage && (
        <p className="rounded-md bg-red-400 px-3 py-2 text-center text-white">
          {errorMessage}
        </p>
      )}

      {user && (
        <div className="flex flex-col items-center">
          <h2 className="mt-2 text-2xl font-bold">Bienvenido</h2>
          <p className="mt-4 text-lg">Usuario: {user?.email}</p>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 p-2 text-white"
          >
            Cerrar Sesión
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex w-full max-w-md flex-col space-y-2"
      >
        <div>
          <input
            type="text"
            placeholder="Nombre completo"
            className=" w-full rounded-lg border border-gray-300 p-2"
            {...register("full_name")}
          />
          {errors.full_name ? (
            <span className="px-2 text-sm text-red-700">
              {errors.full_name.message}
            </span>
          ) : (
            <></>
          )}
        </div>

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
          Registrarse
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
