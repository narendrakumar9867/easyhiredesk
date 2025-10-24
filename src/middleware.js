import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get("jwt")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("jwt");
    return response;
  }
}

export const config = {
  matcher: ["/hireprocess", "/hireprocess/selectionprocess", "/hireprocess/selectionprocess/rounds", "/joblists", "/joblists/jobdetails-hire-manager/:id*", "/profile"],
};