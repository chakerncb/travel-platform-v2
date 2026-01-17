import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: number;
      name?: string | null;
      email?: string | null;
      // image?: string | null;
      role?: string;
      roles?: string[];
      accessToken?: string;
    },
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    token?: string;
    roles?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    roles?: string[];
  }
}