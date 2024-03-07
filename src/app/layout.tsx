import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/redux/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clinica Internacional - Prueba de Frontend",
  description: "Prueba de Frontend para Clinica Internacional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (typeof window !== "undefined") {
    // client-side-only code
  }

  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>

        <footer className="bg-black py-2 text-center text-sm text-white shadow-lg">
          <p>
            <a
              href="https://www.linkedin.com/in/murphycoder/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Brayan Murphy Crespo Espinoza
            </a>{" "}
            &copy; 2024
          </p>
        </footer>
      </body>
    </html>
  );
}
