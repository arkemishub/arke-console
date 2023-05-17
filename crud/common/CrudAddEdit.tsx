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
import { Form, FormField } from "@arkejs/form";
import { TBaseParameter, TResponse, TUnit } from "@arkejs/client";
import { Button, Dialog, Spinner } from "@arkejs/ui";

export interface CrudProps {
  unitId?: string;
  arkeId: string;
  open: string | boolean | undefined;
  title: ReactNode;
  onClose(): void;
  onSubmit(data: TResponse<TUnit>): void;
}

let didInit = false;

export function CrudAddEdit(props: CrudProps) {
  const [prevOpen, setPrevOpen] = useState(props.open);
  const client = useClient();
  const [fields, setFields] = useState<TBaseParameter[]>([]);
  const [loading, setLoading] = useState(true);
  const { arkeId, open, title, unitId, onClose, onSubmit } = props;

  const onFormSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const promise = !unitId
        ? client.unit.create(arkeId, data)
        : client.unit.edit(arkeId, unitId as string, data);
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
    const exclude = [
      "id",
      "active",
      "arke_id",
      "type",
      "metadata",
      "inserted_at",
      "updated_at",
      "parameters",
    ];

    const promise = unitId
      ? client.unit.struct(arkeId, unitId, { params: { exclude } })
      : client.arke.struct(arkeId, { params: { exclude } });
    promise.then((res) => {
      setFields(res.data.content.parameters);
      setLoading(false);
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
          onSubmit={onFormSubmit}
          style={{ height: "100%" }}
          fields={fields}
        >
          {({ fields }) =>
            loading ? (
              <Spinner />
            ) : (
              <>
                <div className="grid gap-4">
                  {fields.map((field) => (
                    <FormField key={field.id} id={field.id} />
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
            )
          }
        </Form>
      ) : (
        <Spinner />
      )}
    </Dialog>
  );
}
