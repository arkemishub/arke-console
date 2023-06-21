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
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { NextPage } from "next";
import { FormConfigProvider, RenderProps } from "@arkejs/form";
import { Autocomplete, Checkbox, Input, Json } from "@arkejs/ui";
import { useEffect, useState } from "react";
import useClient from "@/arke/useClient";
import { TUnit } from "@arkejs/client";

type NextPageWithAuth = NextPage & {
  auth?: boolean;
};

type AppPropsWithAuth = AppProps & {
  Component: NextPageWithAuth;
};

const inter = Inter({
  subsets: ["latin"],
});

function AutocompleteLink({
  reference,
  onChange,
  ...props
}: RenderProps & { reference: any }) {
  const client = useClient();
  const [values, setValues] = useState<TUnit[]>([]);

  useEffect(() => {
    // getAll: arke / group (id: se é gruppo o arke)
    // filter_keys [OR]
    // params: load_links: true => getAll
    if (reference?.arke_id === "group") {
      // TODO: implement getAll by group and add filters with filter_keys
      // client.unit.getAll(reference.id).then((res) => {
      client.api.get(`/group/${reference.id}/unit`).then((res) => {
        setValues(res.data.content.items);
      });
    }
    if (reference?.arke_id === "arke") {
      client.unit.getAll(reference.id).then((res) => {
        setValues(res.data.content.items);
      });
    }
  }, []);

  return (
    <Autocomplete
      {...props}
      onChange={onChange}
      getDisplayValue={(value) =>
        `[${value.arke_id}] ${value.label ?? value.id}`
      }
      values={values}
      value={values.find((item) => item.id === props.value)}
    />
  );
}

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
      <SessionProvider session={session} basePath="/next/api/auth">
        <FormConfigProvider
          components={{
            dict: (props) => {
              return (
                <Json
                  label={props.label}
                  value={JSON.stringify(props.value)}
                  onChange={(value) => props.onChange(JSON.parse(value))}
                />
              );
            },
            integer: (props) => (
              <Input
                {...props}
                type="number"
                fullWidth
                onChange={(e) => props.onChange(e.target.value)}
              />
            ),
            float: (props) => (
              <Input
                {...props}
                type="number"
                step="0.01"
                fullWidth
                onChange={(e) => props.onChange(e.target.value)}
              />
            ),
            date: (props) => (
              <Input
                {...props}
                type="date"
                fullWidth
                onChange={(e) => props.onChange(e.target.value)}
              />
            ),
            string: (props) => {
              if (props.values && props.values.length > 0)
                return (
                  <Autocomplete
                    {...props}
                    onChange={(value) => props.onChange(value.value)}
                    getDisplayValue={(value) => value.label}
                    value={props.values.filter(
                      (item: { value: string }) => item.value === props.value
                    )}
                  />
                );
              return (
                <Input
                  {...props}
                  type="text"
                  fullWidth
                  onChange={(e) => props.onChange(e.target.value)}
                />
              );
            },
            boolean: (props) => (
              <Checkbox
                {...props}
                checked={props.value}
                onChange={(e) => props.onChange(e.target.checked)}
              />
            ),
            list: (props) => (
              <Json
                label={props.label}
                value={JSON.stringify(props.value)}
                onChange={(value) => props.onChange(JSON.parse(value))}
              />
            ),
            link: (props) => (
              <AutocompleteLink
                {...props}
                // @ts-ignore - todo: fix form types
                reference={props.ref}
                // @ts-ignore - todo: fix form types
                onChange={(value) => props.onChange(value.id)}
              />
            ),
            default: (props: RenderProps & { type: string }) => <></>,
          }}
        >
          <Component {...pageProps} />
        </FormConfigProvider>
      </SessionProvider>
    </main>
  );
}
