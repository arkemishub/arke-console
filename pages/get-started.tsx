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

import { GetServerSideProps } from "next";
import { withAuth } from "@/server/withAuth";
import { Form, FormField } from "@arkejs/form";
import { Button, Input } from "@arkejs/ui";
import React, { useCallback, useState } from "react";
import { BaseParameter, TBaseParameter } from "@arkejs/client";
import useClient from "@/arke/useClient";
import { CopyIcon } from "@/components/Icon";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

const fields: Array<TBaseParameter & Record<string, unknown>> = [
  {
    id: "label",
    type: BaseParameter.String,
    placeholder: "Project Name",
  },
  {
    id: "description",
    type: BaseParameter.String,
    placeholder: "Project Description",
  },
];

function GetStarted() {
  const [projectId, setProjectId] = useState("");

  const client = useClient();

  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    const res = await client.unit.create("arke_project", {
      ...data,
      id: (data.label as string).trim().replace(/\/+$/, "-"),
      type: "postgres_schema",
    });
    setProjectId(`NEXT_PUBLIC_ARKE_PROJECT=${res.data.content.id}`);
  }, []);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(projectId);
  };

  return (
    <div className="mx-auto flex h-screen w-full max-w-7xl flex-col gap-8 py-4">
      <div className="relative">
        <div className="flex items-center px-2 py-4">
          <Image src="/logo.png" alt="logo" height={30} width={30} />
          <p className="ml-2 font-semibold">ARKE</p>
          <p className="ml-2 border-l border-l-neutral pl-2 text-neutral-400">
            Console
          </p>
        </div>
        <div className="absolute bottom-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
      <div className="mb-12 flex grow flex-col justify-center gap-12">
        <div className="mx-auto flex gap-2">
          <span
            className={twMerge(
              "h-6 w-6 rounded-full bg-primary",
              projectId && "opacity-20"
            )}
          />
          <span
            className={twMerge(
              "h-6 w-6 rounded-full bg-primary",
              !projectId && "opacity-20"
            )}
          />
        </div>

        {!projectId ? (
          <>
            <h1 className="text-center text-5xl font-semibold">
              Create your project
            </h1>
            <p className="mx-auto max-w-lg text-center text-neutral-400">
              NEXT_PUBLIC_ARKE_PROJECT variable is not configured. Follow the
              steps below to create your first project.
            </p>
            <Form fields={fields} onSubmit={handleSubmit}>
              {() => (
                <div className="mx-auto max-w-xl">
                  <div className="grid gap-6">
                    <FormField
                      id="label"
                      render={(props) => (
                        <Input
                          {...props}
                          className="w-full"
                          onChange={(e) => props.onChange(e.target.value)}
                          pattern="^[a-z0-9_-]+$"
                          required
                          helperText="Insert a lowercase name, allowed characters: alphanumeric, underscore and hyphen"
                        />
                      )}
                    />
                    <FormField id="description" />
                  </div>
                  <div className="mt-8 flex gap-4">
                    <Button className="w-full" color="primary" type="submit">
                      Create
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </>
        ) : (
          <>
            <h1 className="text-center text-5xl font-semibold">
              Connect your console
            </h1>

            <p className="text-center text-neutral-400">
              Connect your console to your new project by adding following
              variable to your .env file:
            </p>

            <div className="relative mx-auto w-full max-w-lg">
              <Input
                disabled
                value={projectId}
                className="w-full !cursor-default bg-neutral-900 opacity-100"
              />
              <Button
                onClick={handleCopyToClipboard}
                className="absolute right-0 top-0 bg-neutral"
              >
                <CopyIcon />
              </Button>
            </div>

            <Link href="/" className="btn btn--primary mx-auto">
              I pasted it in my env file, get me in!
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(() => {
  return { props: {} };
});

export default GetStarted;
