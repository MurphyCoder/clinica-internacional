"use client";
import { Container } from "@/components/shared/Container";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/LoadingScreen";

export default function Home() {
  // redirigir a la ruta /login porque esa es la página de inicio
  const router = useRouter();
  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <main>
      <Container className="flex h-screen items-center justify-center">
        <LoadingScreen />
      </Container>
    </main>
  );
}
