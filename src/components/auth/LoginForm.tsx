import appFirebase from "@/utils/credentials_firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import React from "react";

const LoginForm = () => {
  const auth = getAuth(appFirebase);
  const db = getFirestore(appFirebase);
  const handleLoginFirebase = async (e: any) => {
    e.preventDefault();
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value,
      );

      // Signed in
      const user = userCredential.user;
      console.log("Usuario logeado", user);
      // Si el usuario se logea, se guarda en la base de datos de firestore los datos del usuario
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          lastLogin: new Date(),
          group: "miachis",
          uid_agora_user: "miachis_uid_agora_user",
        });
      }
    } catch (error) {
      console.log("Error al iniciar sesión", error);
    }
  };

  return (
    <>
      <form className="flex w-full max-w-md flex-col">
        <input
          type="text"
          placeholder="Correo Electrónico"
          className="mb-4 w-full rounded-lg border border-gray-300 p-2"
          id="email"
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="mb-4 rounded-lg border border-gray-300 p-2"
          id="password"
        />
        <button
          type="submit"
          className="bg-primary-500 rounded-lg p-2 text-white"
          onClick={handleLoginFirebase}
        >
          Iniciar Sesión
        </button>
      </form>
    </>
  );
};

export default LoginForm;
