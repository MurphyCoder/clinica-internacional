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
import ui from "@/redux/slices/auth";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

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
    <main>
      {/* <div className="flex flex-col items-center">
        <Image
          src="/assets/logo.png"
          alt="Clinica Internacional"
          width={400}
          height={200}
        />

        {user && (
          <div className="flex flex-col items-center">
            <h2 className="mt-2 text-2xl font-bold">Bienvenido</h2>
            <p className="mt-4 text-lg">Usuario: {user?.email}</p>
            <button
              onClick={async () => {
                try {
                  await auth.signOut();
                  setUser(null);
                } catch (error) {
                  console.log("Error al cerrar sesión", error);
                }
              }}
              className="rounded-lg bg-red-500 p-2 text-white"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
        <h1 className="mt-8 text-4xl font-bold">
          ¡Bienvenido a Clinica Internacional!
        </h1>
        <p className="mt-4 text-lg">
          Prueba de Frontend para Clinica Internacional
        </p>
      </div> */}

      <section className="tems-center flex h-screen justify-center">
        <div className="bg-primary-500 hidden md:col-span-1 md:flex md:h-full md:w-full md:items-center md:justify-center">
          <Image
            src="/assets/ilustrations/woman_login.webp"
            alt="Doctor"
            width={500}
            height={500}
          />
        </div>
        <div className="col-span-2 flex h-full w-full flex-col items-center justify-center space-y-2">
          <div className="flex flex-col items-center space-y-2">
            <Image
              src="/assets/logo.png"
              alt="Clinica Internacional"
              width={200}
              height={200}
            />
            <h1 className="mt-8 text-xl font-bold">
              ¡Bienvenido a Clinica Internacional!
            </h1>
          </div>
          <h1 className="mb-4 text-3xl font-bold">Iniciar Sesión</h1>
          <LoginForm />
          <div className="mt-4 flex flex-row items-center gap-2">
            <p>¿No tienes cuenta?</p>
            <Link href="/register" className="text-primary-500">
              Regístrate
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
