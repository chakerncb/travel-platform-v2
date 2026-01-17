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
        async signIn({ user, account, profile }) {
            // For OAuth providers (Google, GitHub), register/login in backend
            if (account && (account.provider === 'google' || account.provider === 'github')) {
                try {
                    const apiUrl = process.env.API_URL || 'http://localhost:8000/api';
                    
                    const response = await fetch(`${apiUrl}/oauth/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            provider: account.provider,
                            provider_id: account.providerAccountId,
                        }),
                    });

                    if (!response.ok) {
                        console.error('Failed to register OAuth user in backend');
                        return false; // Prevent sign-in if backend registration fails
                    }

                    const data = await response.json();
                    
                    if (data.status && data.token) {
                        // Store the backend token in the user object
                        (user as ExtendedUser).token = data.token;
                        return true;
                    } else {
                        console.error('Backend registration failed:', data.message);
                        return false;
                    }
                } catch (error) {
                    console.error('Error during OAuth backend registration:', error);
                    return false; // Prevent sign-in on error
                }
            }
            
            // Allow credentials provider sign-in
            return true;
        },
        async jwt({ token, user, account }) {
            const extendedToken = token as ExtendedJWT;
            
            if (user) {
                // For both credentials and OAuth providers (now both have backend tokens)
                if ((user as ExtendedUser).token) {
                    extendedToken.accessToken = (user as ExtendedUser).token;
                    
                    try {
                        const decoded = jwt.decode((user as ExtendedUser).token as string) as { 
                            given_name?: string;
                            role?: string;
                            email?: string;
                        };
                        
                        if (decoded?.given_name) {
                            extendedToken.name = decoded.given_name;
                        }
                        if (decoded?.role) {
                            extendedToken.role = decoded.role;
                        }
                    } catch (error) {
                        console.error('Error decoding token:', error);
                    }
                }
                
                // Fallback for name if not in token
                if (!extendedToken.name && user.name) {
                    extendedToken.name = user.name;
                }
                
                // Default role if not set
                if (!extendedToken.role) {
                    extendedToken.role = 'user';
                }
            }
            return extendedToken;
        },        
        async session({ session, token }) {
            const extendedSession = session as ExtendedSession;
            extendedSession.accessToken = (token as ExtendedJWT).accessToken;
            
            session.user = session.user || {};
            
            if (token.name) {
                session.user.name = token.name;
            }
            
            if ((token as ExtendedJWT).role) {
                session.user.role = (token as ExtendedJWT).role;
            }
            
            return extendedSession;
        },
    },
};