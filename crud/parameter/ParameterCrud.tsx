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
import { Field, Form } from "@arkejs/form";
import { Button, Dialog, Select, Spinner } from "@arkejs/ui";
import { TBaseParameter, TResponse, TUnit } from "@arkejs/client";
import useClient from "@/arke/useClient";
import toast from "react-hot-toast";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";

export function ParameterAdd({
  open,
  title,
  onClose,
  onSubmit,
}: {
  open: string | boolean | undefined;
  title: ReactNode;
  onClose(): void;
  arkeId?: string;
  onSubmit(data: TResponse<TUnit>): void;
}) {
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<TBaseParameter[] | undefined>(undefined);
  const [parameterTypes, setParameterTypes] = useState<TUnit[]>([]);
  const [selectedType, setSelectedType] = useState<TUnit | undefined>(
    undefined
  );

  const client = useClient();

  useEffect(() => {
    setFields([]);
    setSelectedType(undefined);
    if (open) {
      setLoading(true);

      client.group.getAllArke("parameter").then((res) => {
        setParameterTypes(res.data.content.items);
        setLoading(false);
      });
    }
  }, [open]);

  const onFormSubmit = useCallback(
    (data: Record<string, unknown>) => {
      if (selectedType) {
        const parsed = Object.entries(data).reduce(
          (acc: Record<string, unknown>, [key, value]) => {
            let parsedValue = value;
            if (
              fields?.find((f) => f.id === key)?.type === "dict" &&
              typeof value == "string"
            )
              parsedValue = JSON.parse(value);
            acc[key] = parsedValue;
            return acc;
          },
          {}
        );

        client.unit
          .create(selectedType.id, { ...parsed, type: selectedType.id })
          .then((res) => {
            onSubmit(res);
          })
          .catch((err) => {
            err.response.data.messages.forEach((item: { message: string }) =>
              toast.error(item.message)
            );
          });
      }
    },
    [onSubmit, selectedType]
  );

  const onParameterTypeChange = useCallback(
    (value: TUnit) => {
      setSelectedType(value);
      setLoading(true);
      client.arke
        .struct(value.id, {
          params: {
            exclude: [
              "inserted_at",
              "updated_at",
              "parameters",
              "persistence",
              "arke_id",
              "type",
            ],
          },
        })
        .then((res) => {
          setFields(
            res.data.content.parameters.map((item) => {
              item.refLink = item.ref;
              return item;
            })
          );
        })
        .finally(() => setLoading(false));
    },
    [client]
  );

  const handleClose = useCallback(() => {
    setSelectedType(undefined);
    setFields(undefined);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={!!open} title={title} onClose={handleClose}>
      <Select
        value={selectedType}
        values={parameterTypes}
        onChange={onParameterTypeChange}
        renderValue={(val: TUnit) => val.label}
        className="mb-4"
        placeholder="Select the type parameter"
        startAdornment={
          <AdjustmentsVerticalIcon className="h-5 w-5 stroke-white" />
        }
      />
      <Form
        fields={(fields as Field[]) ?? []}
        onSubmit={onFormSubmit}
        style={{ height: "100%" }}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="grid gap-4">
              {fields?.map((field) => (
                <Form.Field id={field.id as string} key={field.id as string} />
              ))}
            </div>
            <div className="mt-4 flex  gap-4">
              <Button className="w-full bg-neutral" onClick={onClose}>
                Close
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
    </Dialog>
  );
}
