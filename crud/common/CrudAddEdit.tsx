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

import React, { ReactNode, useCallback, useState } from "react";
import useClient from "@/arke/useClient";
import { Field, Form } from "@arkejs/form";
import { TBaseParameter, TResponse, TUnit } from "@arkejs/client";
import { Button, Dialog, Spinner } from "@arkejs/ui";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { containsFile } from "@/utils/file";

export interface CrudProps {
  unitId?: string;
  arkeId: string;
  open: string | boolean | undefined;
  title: ReactNode;
  onClose(): void;
  onSubmit(data: TResponse<TUnit>): void;
  include?: string[];
  exclude?: string[];
}

let didInit = false;

export function CrudAddEdit(props: CrudProps) {
  const [prevOpen, setPrevOpen] = useState(props.open);
  const client = useClient();
  const [fields, setFields] = useState<TBaseParameter[]>([]);
  const [loading, setLoading] = useState(true);
  const { arkeId, open, title, unitId, onClose, onSubmit, include } = props;
  const router = useRouter();
  const {
    query: { project },
  } = router;

  const onFormSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const formData = new FormData();
      if (containsFile(data)) {
        Object.keys(data).map((key) => {
          formData.append(key, data[key] as Blob);
        });
      }
      const payload = containsFile(data) ? formData : data;
      const promise = !unitId
        ? client.unit.create(arkeId, payload)
        : client.unit.edit(arkeId, unitId as string, payload);
      promise.then(
        (res) => onSubmit(res),
        (err) =>
          err.response.data.messages.forEach((item: { message: string }) =>
            console.error(item.message)
          )
      );
    },
    [arkeId, client, unitId]
  );

  const loadStruct = useCallback(() => {
    setFields([]);
    const exclude = [
      "id",
      "active",
      "arke_id",
      "type",
      "metadata",
      "inserted_at",
      "updated_at",
      "parameters",
      "persistence",
    ].filter((item) => !include?.includes(item));

    const promise = unitId
      ? client.unit.struct(arkeId, unitId, { params: { exclude } })
      : client.arke.struct(arkeId, { params: { exclude } });
    promise.then((res) => {
      setFields(
        res.data.content.parameters.map((item) => {
          item.refLink = item.ref;
          return item;
        })
      );
      setLoading(false);
      if (res.data.content.parameters.length === 0) {
        toast.error(
          "You have to assign at least one parameter to create a unit",
          {
            id: "error_unit_no_parameters",
          }
        );
        void router.push(`/${project}/arke/${arkeId}#parameters`);
      }
    });
  }, [unitId, arkeId, client]);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setLoading(true);
      loadStruct();

      if (!didInit) {
        didInit = true;
      }
    }
  }

  return (
    <Dialog open={!!open} title={title} onClose={onClose}>
      {fields.length > 0 ? (
        <Form
          fields={fields as Field[]}
          onSubmit={onFormSubmit}
          style={{ height: "100%" }}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div className="grid gap-4">
                {fields.map((field) => (
                  <Form.Field
                    key={field.id as string}
                    id={field.id as string}
                  />
                ))}
              </div>
              <div className="mt-4 flex gap-4">
                <Button
                  disabled={loading}
                  className="w-full bg-neutral"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  disabled={loading}
                  color="primary"
                  className="w-full"
                  type="submit"
                >
                  Confirm
                </Button>
              </div>
            </>
          )}
        </Form>
      ) : (
        <Spinner />
      )}
    </Dialog>
  );
}
