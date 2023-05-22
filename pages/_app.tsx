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
import {TUnit} from "@arkejs/client";

type NextPageWithAuth = NextPage & {
  auth?: boolean;
};

type AppPropsWithAuth = AppProps & {
  Component: NextPageWithAuth;
};

const inter = Inter({
  subsets: ["latin"],
});

function AutocompleteLink(props: RenderProps) {
  const client = useClient();
  const { id } = props;
  const [values, setValues] = useState<TUnit[]>([]);

  function onChange(value) {
    console.log(value);
    props.onChange(value);
  }

  useEffect(() => {
    client.unit.getAll(id).then((res) => {
      setValues(res.data.content.items);
    });
  }, []);

  return (
    <Autocomplete
      {...props}
      onChange={onChange}
      renderLabel={(value) => value.label}
      values={props.values}
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
            string: (props) => {
              if (props.values && props.values.length > 0)
                return (
                  <Autocomplete
                    {...props}
                    onChange={(value) => props.onChange(value)}
                    renderLabel={(value) => value.label}
                    values={props.values}
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
            link: (props) => <AutocompleteLink {...props}/>,
            default: (props: RenderProps & { type: string }) => (
              <div className="text-red-500">Field {props.type} not found</div>
            ),
          }}
        >
          <Component {...pageProps} />
        </FormConfigProvider>
      </SessionProvider>
    </main>
  );
}
