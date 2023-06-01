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

import { Client, TToken } from "@arkejs/client";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import * as process from "process";

const getServerUrl = () => {
  if (
    typeof window == "undefined" &&
    process.env.NEXT_PUBLIC_ARKE_SERVER_SSR_URL
  ) {
    return process.env.NEXT_PUBLIC_ARKE_SERVER_SSR_URL;
  }

  return process.env.NEXT_PUBLIC_ARKE_SERVER_URL;
};

export const getClient = (context?: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}): Client => {
  const serverUrl = getServerUrl();
  return new Client({
    serverUrl,
    project: process.env.NEXT_PUBLIC_ARKE_PROJECT,
    getSession: async () => {
      if (typeof window === "undefined" && context) {
        return getToken({ req: context?.req });
      }
      return getSession() as Promise<TToken>;
    },
  });
};
