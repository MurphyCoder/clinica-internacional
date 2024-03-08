"use client";
import appFirebase from "@/utils/credentials_firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdVideocam, MdLogout } from "react-icons/md";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const PageVideoCall = () => {
  const [user, setUser] = useState(null) as any;
  const router = useRouter();
  console.log("🚀 ~ PageVideoCall ~ user:", user);

  const auth = getAuth(appFirebase);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Cookies.remove("authTokensEmail");
      router.push("/login");
    } catch (error) {
      console.log("Error al deslogear usuario", error);
    }
  };

  // onAuthStateChanged para saber si el usuario está logeado
  useEffect(() => {
    const auth = getAuth(appFirebase);
    const db = getFirestore(appFirebase);

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        console.log("Usuario logeado", uid, firebaseUser.email);
        setUser(firebaseUser);

        // Obtener los datos del usuario desde Firestore
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Datos del usuario:", userData);
          // Actualizar el estado del usuario con los datos obtenidos
          setUser(userData);
        } else {
          console.log("No se encontraron datos para el usuario");
        }
      } else {
        console.log("Usuario no logeado");
        Cookies.remove("authTokensEmail");
        router.push("/login");
        setUser(null);
      }
    });
  }, []);
  // Obtener los datos del usuario logeado que esta en firebase users, hacer la consulta a la base de datos

  return (
    <section className="bg-slate-100">
      <div className="flex h-screen flex-col items-center justify-center space-y-4">
        <div
          className="focus:border-primary-300 w-96
          space-y-4
          rounded-lg
          bg-slate-50
          p-8
          text-center
          shadow-lg
        "
        >
          <div className="my-2 hidden md:block">
            <Image
              src="/assets/logo.png"
              alt="clinica"
              width={300}
              height={300}
            />
          </div>

          <Image
            src="/assets/ilustrations/avatar.png"
            className="mx-auto h-24 w-24 rounded-full"
            alt="avatar"
            width={96}
            height={96}
          />

          <h1 className="text-primary-500 text-xl font-bold">
            ¡Hola, {user?.full_name || "Usuario"}!
            <p className="text-sm font-normal text-gray-500">{user?.email}</p>
          </h1>

          <p className="text-gray-600">Bienvenido a la videollamada.</p>
          <p className="text-sm text-gray-600">
            Para unirte a la videollamada, haz clic en el siguiente botón:
          </p>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-center md:space-x-4 md:space-y-0">
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 p-2 text-sm text-white"
            >
              Cerrar Sesión <MdLogout className="ml-2 inline-block text-2xl" />
            </button>

            <Link
              href={user?.group ? `/videocall/${user?.group}` : "#"}
              className="bg-primary-500
              rounded-lg
              p-2
              text-center
              text-sm
              text-white
              "
            >
              Unirse a la videollamada{" "}
              <MdVideocam className="ml-2 inline-block text-2xl" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageVideoCall;
