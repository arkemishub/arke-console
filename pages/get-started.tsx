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
import { Autocomplete, Button, Input } from "@arkejs/ui";
import React, { useCallback, useState } from "react";
import { BaseParameter, TBaseParameter, TUnit } from "@arkejs/client";
import useClient from "@/arke/useClient";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { getClient } from "@/arke/getClient";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { cleanId } from "../utils/helper";
import toast from "react-hot-toast";

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

function GetStarted({ projects }: { projects: TUnit[] }) {
  const router = useRouter();

  const client = useClient();

  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    const res = await client.unit.create("arke_project", {
      ...data,
      id: (data.label as string).trim().replace(/\/+$/, "-"),
      type: "postgres_schema",
    });
    onSelectProject(res.data.content);
  }, []);

  const onSelectProject = (project: TUnit) => {
    setCookie("arke_project", project.id);
    router.push("/");
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
        <h1 className="text-center text-5xl font-semibold">
          Configure your project
        </h1>
        <p className="mx-auto max-w-lg text-center text-neutral-400"></p>
        <p className="mx-auto max-w-lg text-center text-neutral-400">
          Select an existing project
        </p>
        <div className="mx-auto w-full max-w-xl">
          <Autocomplete
            placeholder="Choose project"
            onChange={onSelectProject}
            getDisplayValue={(item) => item.label ?? ""}
            values={projects}
          />
        </div>

        <p className="mx-auto max-w-lg text-center text-neutral-400">
          or create a new one
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
                      onChange={(e) =>
                        props.onChange(
                          cleanId(e.target.value, () =>
                            toast.error(
                              "The entered character is not allowed, it has been replaced with _"
                            )
                          )
                        )
                      }
                      pattern="^[a-z0-9_-]+$"
                      placeholder="Project name"
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
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const client = getClient(context);

    const response = await client.unit.getAll("arke_project", {});

    return {
      props: {
        projects:
          response?.data?.content?.items?.filter(
            (item) => item.id !== "arke_system"
          ) ?? [],
      },
    };
  }
);

export default GetStarted;
