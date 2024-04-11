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

import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Form, useForm } from "@arkejs/form";
import {
  Button,
  Dialog,
  Spinner,
  Input,
  Select,
  Alert,
  Checkbox,
} from "@arkejs/ui";
import { TResponse, TUnit } from "@arkejs/client";
import useStruct from "@/hooks/useStruct";
import useClient from "@/arke/useClient";
import toast from "react-hot-toast";
import ArkeSearch from "@/components/ArkeSearch/ArkeSearch";
import UnitSearch from "@/components/UnitSearch/UnitSearch";

export function MemberCrud({
  open,
  title,
  onClose,
  id,
  arkeId,
  onSubmit,
}: {
  open: string | boolean | undefined;
  title: ReactNode;
  onClose(): void;
  id?: string;
  arkeId?: string;
  onSubmit(data: TResponse<TUnit>): void;
}) {
  const client = useClient();
  const [memberType, setMemberType] = useState<string>(arkeId ?? "super_admin");
  const [memberTypeList, setMemberTypeList] = useState<string[]>([]);
  const { parameters, loading } = useStruct(memberType, id);
  const [existingUser, setExistingUser] = useState<boolean>(false);

  const fields = [
    ...parameters,
    {
      id: "member_type",
      required: true,
      values: memberTypeList.map((item) => ({
        label: item,
        value: item,
      })),
      type: "string",
      label: "Member typology",
      value: memberType ?? "super_admin",
    },
    ...(!id
      ? [
          {
            id: "arke_system_user.email",
            required: true,
            type: "string",
            label: "Email",
          },
          {
            id: "arke_system_user",
          },
          {
            id: "arke_system_user.password",
            required: true,
            type: "password",
            label: "Password",
          },
          {
            id: "arke_system_user.username",
            required: true,
            type: "string",
            label: "Username",
          },
        ]
      : []),
  ];

  const { formProps, methods } = useForm({
    // @ts-ignore
    fields,
  });
  const { setValue } = methods;

  useEffect(() => {
    client.group.get("arke_auth_member").then((res) => {
      setMemberTypeList(res.data.content.arke_list as string[]);
    });
  }, []);

  async function handleOnSubmit(data: Record<string, any>) {
    const arkeId = data.member_type;
    delete data.member_type;
    // create or edit member
    try {
      const response = id
        ? await client.unit.edit(arkeId as string, id, data)
        : await client.unit.create(arkeId as string, data);
      onSubmit(response);
    } catch (e: any) {
      toast.error(`Something went wrong`);
    }
  }

  const handleOnClose = useCallback(() => {
    onClose();
    setMemberType("");
  }, []);

  return (
    <Dialog
      disableBackdropClose
      open={!!open}
      title={title}
      onClose={handleOnClose}
    >
      <Form {...formProps} onSubmit={handleOnSubmit} style={{ height: "100%" }}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="grid gap-4">
              <Form.Field
                id="member_type"
                render={({ field }) => (
                  <Select
                    {...field}
                    value={memberType}
                    onChange={(val) => {
                      // @ts-ignore
                      setMemberType(val.value);
                      // @ts-ignore
                      field.onChange(val.value);
                    }}
                    disabled={!!id}
                    renderValue={(val) => val}
                    // @ts-ignore
                    renderOption={(val) => val.label}
                  />
                )}
              />
              {memberType && !id && (
                <Checkbox
                  label="Existing user"
                  checked={existingUser}
                  onChange={() => {
                    if (!existingUser) {
                      setValue("arke_system_user", "");
                    }
                    setExistingUser(!existingUser);
                  }}
                />
              )}

              {!existingUser ? (
                <>
                  {memberType && (
                    <>
                      {fields
                        .filter((item: any) => item.id !== "member_type")
                        .map((field: any) => (
                          <Form.Field {...field} key={field.id} id={field.id} />
                        ))}
                    </>
                  )}
                </>
              ) : (
                <Form.Field
                  id="arke_system_user"
                  render={(renderProps) => (
                    <UnitSearch
                      {...renderProps}
                      value={renderProps.field.value}
                      arke="user"
                      onChange={(selected) =>
                        renderProps.field.onChange(selected.id)
                      }
                      label="User"
                      placeholder="Search an user email"
                      renderValue={(selected) => selected}
                      renderOption={(selected) => selected.email}
                      config={(searchValue: string) => ({
                        headers: { "Arke-Project-Key": "arke_system" },
                        params: {
                          offset: 0,
                          limit: 5,
                          filter: `and(contains(email,${searchValue}))`,
                          order: `email;asc`,
                        },
                      })}
                    />
                  )}
                />
              )}
            </div>
            <div className="mt-4 flex gap-4">
              <Button
                className="btn-outlined w-full bg-neutral"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                className="w-full"
                disabled={loading}
                color="primary"
                type="submit"
              >
                Confirm
              </Button>
            </div>
          </>
        )}
      </Form>
    </Dialog>
  );
}
