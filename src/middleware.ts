import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const authTokensEmail = request.cookies.get("authTokensEmail")?.value;
  console.log("🚀 ~ middleware ~ authTokensEmail:", authTokensEmail);

  // Si es del tipo admin y no tiene la cookie de autenticación, redirigir a la página de login
  if (request.nextUrl.pathname.startsWith("/videocall") && !authTokensEmail) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("authTokensEmail");
    return response;
  }

  // Si tenemos la cookie de autenticación y la página a la que se quiere acceder es la de login, redirigir a la página de admin
  if (authTokensEmail && request.nextUrl.pathname.startsWith("/login")) {
    const response = NextResponse.redirect(new URL("/videocall", request.url));
    return response;
  }

  // para la registro
  if (authTokensEmail && request.nextUrl.pathname.startsWith("/register")) {
    const response = NextResponse.redirect(new URL("/videocall", request.url));
    return response;
  }
}

// Aca se configura el middleware para que se ejecute en las rutas que se deseen, es decir, en las rutas que se deseen proteger
export const config = {
  matcher: ["/videocall(.*)", "/login", "/register"],
};
