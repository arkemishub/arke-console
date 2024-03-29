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

import "@/styles/globals.css";
import "@/styles/prism.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { NextPage } from "next";
import AppFormConfigProvider from "@/components/AppFormConfigProvider/AppFormConfigProvider";
import dynamic from "next/dynamic";
import AppTableConfigProvider from "@/components/Table/AppTableConfigProvider";
import ApiToast from "@/components/ApiToast/ApiToast";

const Toaster = dynamic(
  () => import("react-hot-toast").then((mod) => mod.Toaster),
  { ssr: false }
);

type NextPageWithAuth = NextPage & {
  auth?: boolean;
};

type AppPropsWithAuth = AppProps & {
  Component: NextPageWithAuth;
};

const inter = Inter({
  subsets: ["latin"],
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuth) {
  return (
    <main className="flex min-h-screen flex-col bg-background font-sans text-background-contrast">
      <style global jsx>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
        }
      `}</style>
      <Toaster
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#1D1F29",
            color: "#fff",
          },
        }}
      />
      <ApiToast>
        <SessionProvider session={session} basePath="/next/api/auth">
          <AppTableConfigProvider>
            <AppFormConfigProvider>
              <Component {...pageProps} />
            </AppFormConfigProvider>
          </AppTableConfigProvider>
        </SessionProvider>
      </ApiToast>
    </main>
  );
}
