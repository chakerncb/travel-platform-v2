import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { NextAuthOptions } from 'next-auth';
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";
import jwt from 'jsonwebtoken';

interface ExtendedUser extends User {
    token?: string;
}
interface ExtendedSession extends Session {
    accessToken?: string;
    user: {
        name?: string | null;
        email?: string | null;
        role?: string;
    };
}
interface ExtendedJWT extends JWT {
    accessToken?: string;
    role?: string;
}



export const authConfig: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "user@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const apiUrl = process.env.API_URL || 'http://localhost:8000/api';
                
                const res = await fetch(`${apiUrl}/login`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" },
                });
                
                if (!res.ok) {
                    return null;
                }
                
                const response = await res.json();
                
                // Laravel backend returns: { status, message, token, User }
                if (response && response.status && response.token) {
                    const authUser = { 
                        id: response.User.id || response.User.email,
                        email: response.User.email,
                        name: `${response.User.f_name} ${response.User.l_name}`.trim(),
                        token: response.token
                    };
                    return authUser as ExtendedUser;
                }
                return null;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 60 * 30, // 30 minutes
        updateAge: 60 * 30 , // Update session every 30 minutes
    },
    callbacks: {        
        async jwt({ token, user }) {
            const extendedToken = token as ExtendedJWT;
            if (user) {
                extendedToken.accessToken = (user as ExtendedUser).token; // Store token in the JWT
                
                // If the token exists, attempt to decode it and extract the name
                if ((user as ExtendedUser).token) {
                    try {
                        const decoded = jwt.decode((user as ExtendedUser).token as string) as { 
                            given_name?: string;
                            role?: string;
                            email?: string;
                        };
                        
                        // Use given_name from token if available
                        if (decoded?.given_name) {
                            extendedToken.name = decoded.given_name;
                        }
                        // Use role from token if available
                        if (decoded?.role) {
                            extendedToken.role = decoded.role;
                        }
                        
                    } catch (error) {
                        console.error('Error decoding token for name:', error);
                    }
                }
            }
            return extendedToken;
        },        
        async session({ session, token }) {
            const extendedSession = session as ExtendedSession;
            extendedSession.accessToken = (token as ExtendedJWT).accessToken; // Make token available in the session
            
            // Initialize session.user if it doesn't exist
            session.user = session.user || {};
            
            // Make sure the name from the token is passed to the session
            if (token.name) {
                session.user.name = token.name;
            }
            
            // Add the role to the session user object
            if ((token as ExtendedJWT).role) {
                session.user.role = (token as ExtendedJWT).role;
            }
            
            return extendedSession;
        },
    },
};