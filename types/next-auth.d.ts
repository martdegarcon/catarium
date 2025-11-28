import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    login: string;
    email: string;
    language: string;
  }

  interface Session {
    user: {
      id: string;
      login: string;
      email: string;
      language: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    login: string;
    language: string;
  }
}
