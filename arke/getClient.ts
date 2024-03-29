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

import { Client, HTTPStatusCode, TToken } from "@arkejs/client";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { getCookie } from "cookies-next";
import { getCookieName } from "@/utils/auth";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { redirect } from "next/navigation";

const getServerUrl = () => {
  if (
    typeof window == "undefined" &&
    process.env.NEXT_PUBLIC_ARKE_SERVER_SSR_URL
  ) {
    return process.env.NEXT_PUBLIC_ARKE_SERVER_SSR_URL;
  }

  return process.env.NEXT_PUBLIC_ARKE_SERVER_URL;
};

const getProjectId = (context?: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
  query?: any;
}) => {
  const project = context?.query?.project ?? "arke_system";
  return (
    (project ||
      getCookie("arke_project", {
        req: context?.req,
        res: context?.res,
      })?.toString()) ??
    ""
  );
};

export const getClient = (context?: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
  query?: NextParsedUrlQuery;
}): Client => {
  const serverUrl = getServerUrl();
  return new Client({
    serverUrl,
    project: getProjectId(context),
    getSession: async () => {
      if (typeof window === "undefined" && context) {
        return getToken({
          req: context?.req,
          cookieName: `${getCookieName()}.session-token`,
        });
      }
      return getSession() as Promise<TToken>;
    },
    httpClientConfig: (api) => {
      api.interceptors.request.use((config) => config);
      api.interceptors.response.use(
        (config) => {
          return config;
        },
        (err) => {
          if (typeof window !== "undefined") {
            const event = new CustomEvent("arke_client_reject", {
              detail: err,
            });
            window.dispatchEvent(event);
          }
          return Promise.reject(err);
        }
      );
      return api;
    },
  });
};
