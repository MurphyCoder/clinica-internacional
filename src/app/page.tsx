"use client";
import { Container } from "@/components/shared/Container";
import Image from "next/image";
// firebase
import appFirebase from "@/utils/credentials_firebase";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import "firebase/firestore";
// firestore
import { useState } from "react";
import ui from "@/redux/slices/ui";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

export default function Home() {
  const [user, setUser] = useState(null) as any;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      const uid = user.uid;
      console.log("Usuario logeado", uid, user.email);
      setUser(user);
    } else {
      // User is signed out
      console.log("Usuario no logeado");
      setUser(null);
    }
  });

  const handleLoginFirebase = async (e: any) => {
    e.preventDefault();
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
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
    <main>
      <div className="flex flex-col items-center">
        <Image
          src="/assets/logo.png"
          alt="Clinica Internacional"
          width={400}
          height={200}
        />

        {user && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mt-2">Bienvenido</h2>
            <p className="text-lg mt-4">Usuario: {user?.email}</p>
            <button
              onClick={async () => {
                try {
                  await auth.signOut();
                  setUser(null);
                } catch (error) {
                  console.log("Error al cerrar sesión", error);
                }
              }}
              className="bg-red-500 text-white p-2 rounded-lg"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
        <h1 className="text-4xl font-bold mt-8">
          ¡Bienvenido a Clinica Internacional!
        </h1>
        <p className="text-lg mt-4">
          Prueba de Frontend para Clinica Internacional
        </p>
      </div>

      {/* inicio de sesion */}
      <Container>
        <div className="flex flex-col items-center ">
          <h2 className="text-2xl font-bold mt-2">Iniciar Sesión</h2>
          <form className="flex flex-col mt-4 max-w-4xl">
            <input
              type="text"
              placeholder="Correo Electrónico"
              className="p-2 border border-gray-300 rounded-lg mb-4 w-full"
              id="email"
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="p-2 border border-gray-300 rounded-lg mb-4"
              id="password"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-lg"
              onClick={handleLoginFirebase}
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </Container>
      <footer className="text-center text-gray-400 text-sm">
        <p>
          <a
            href=" https://www.linkedin.com/in/eduardo-alejandro-ramirez-ramirez-2b9a3b1a6/" // 👈 Update this link
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Brayan Murphy Crespo Espinoza
          </a>{" "}
          &copy; 2024
        </p>
      </footer>
    </main>
  );
}
