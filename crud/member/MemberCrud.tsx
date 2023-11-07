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
import { Button, Dialog, Spinner, Input, Select, Alert } from "@arkejs/ui";
import { TResponse, TUnit } from "@arkejs/client";
import useStruct from "@/hooks/useStruct";
import useClient from "@/arke/useClient";
import toast from "react-hot-toast";

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
  const [memberType, setMemberType] = useState<string>(arkeId ?? "");
  const [memberTypeList, setMemberTypeList] = useState<string[]>([]);
  const { parameters, loading } = useStruct(memberType, id);

  useEffect(() => {
    client.group.get("arke_auth_member").then((res) => {
      setMemberTypeList(res.data.content.arke_list as string[]);
    });
  }, []);

  const fields = [
    ...parameters.map((item) => ({ ...item, id: `member.${item.id}` })),
    {
      id: "member_type",
      required: true,
      values: memberTypeList.map((item) => ({ label: item, value: item })),
      type: "string",
      label: "Tipologia di utente",
      value: memberType,
    },
    !id && {
      ...{
        id: "member.password",
        required: true,
        type: "string",
        label: "Password",
        value: "",
      },
    },
  ];

  const { formProps } = useForm({
    // @ts-ignore
    fields,
  });

  async function handleOnSubmit(data: Record<string, any>) {
    const arkeId = data.member_type;
    const password = data.member.password;
    delete data.member.password;
    delete data.member_type;

    const payload = {
      ...data.member,
      arke_system_user: {
        password: password,
        username: data.member.email,
        email: data.member.email,
      },
    };
    // create or edit member
    try {
      const response = id
        ? await client.unit.edit(arkeId as string, id, payload)
        : await client.unit.create(arkeId as string, payload);
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
      open={!!open}
      title={title}
      onClose={handleOnClose}
      disableBackdropClose
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
              {memberType && (
                <>
                  {fields
                    // TODO: fix type
                    .filter((item: any) => item.id !== "member_type")
                    .map((field: any) => (
                      <Form.Field key={field.id} id={field.id} />
                    ))}
                </>
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
