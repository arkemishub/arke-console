/**
 * Copyright 2023 Arkemis S.r.l.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Client, HTTPStatusCode } from "@arkejs/client";
import { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";
import { getClient } from "@/arke/getClient";

const refreshToken = async (client: Client, token: JWT): Promise<JWT> => {
  return new Promise((resolve) =>
    client.auth
      .refreshToken(token.refresh_token as string)
      .then((res) => resolve({ ...token, ...res.data }))
      .catch((e) => {
        resolve({ ...token, error: "RefreshTokenError" });
      })
  );
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials) {
          const client = getClient({ req, res });
          const authRes = await client.auth.signIn(
            {
              username: credentials.username,
              password: credentials.password,
            },
            "credentials"
          );

          // If no error and we have user data, return it
          if (authRes.status === HTTPStatusCode.OK && authRes.data.content) {
            return { ...authRes.data.content };
          }
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ];
  const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith("https://");
  const cookiePrefix = useSecureCookies ? "__Secure-" : "";

  return await NextAuth(req, res, {
    callbacks: {
      async redirect({ url, baseUrl }) {
        if (url.startsWith(baseUrl)) return url;
        // Allows relative callback URLs
        else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
        return baseUrl;
      },
      async jwt({ token, user }) {
        if (user) {
          return {
            user: {
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              image: "",
              project: user.project,
            },
            access_token: user.access_token,
            refresh_token: user.refresh_token,
          };
        }

        const client = getClient({ req, res });
        try {
          await client.auth.verifyToken(token.access_token);
          return token;
        } catch (e) {
          console.log(e);
          return await refreshToken(client, token);
        }
      },
      async session({ session, token }) {
        session.user = token.user;
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        return session;
      },
    },
    providers,
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/login",
      signOut: "/logout",
      error: "/login", // ErrorPage code passed in query string as ?error=
      verifyRequest: "/auth/verify-request", // (used for check email message)
      newUser: "/auth/new-org", // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    session: { strategy: "jwt" },
    cookies: {
      sessionToken: {
        name: `${cookiePrefix}arke-console-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: useSecureCookies,
        },
      },
      callbackUrl: {
        name: `${cookiePrefix}arke-console-auth.callback-url`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: useSecureCookies,
        },
      },
      csrfToken: {
        // Default to __Host- for CSRF token for additional protection if using useSecureCookies
        // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
        name: `${
          useSecureCookies ? "__Host-" : ""
        }arke-console-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: useSecureCookies,
        },
      },
      pkceCodeVerifier: {
        name: `${cookiePrefix}arke-console-auth.pkce.code_verifier`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: useSecureCookies,
          maxAge: 60 * 15, // 15 minutes in seconds
        },
      },
      state: {
        name: `${cookiePrefix}arke-console-auth.state`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: useSecureCookies,
          maxAge: 60 * 15, // 15 minutes in seconds
        },
      },
      nonce: {
        name: `${cookiePrefix}arke-console-auth.nonce`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: useSecureCookies,
        },
      },
    },
  });
}
