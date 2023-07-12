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
import { Form, FormField } from "@arkejs/form";
import { Button, Dialog, Input, Spinner } from "@arkejs/ui";
import { TBaseParameter, TResponse, TUnit } from "@arkejs/client";
import useClient from "@/arke/useClient";
import { TrashIcon } from "@/components/Icon";

export function UserCrud({
  open,
  title,
  onClose,
  unitId,
  onSubmit,
}: {
  open: string | boolean | undefined;
  title: ReactNode;
  onClose(): void;
  unitId?: string;
  onSubmit(data: TResponse<TUnit>): void;
}) {
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<TBaseParameter[] | undefined>(undefined);

  const client = useClient();

  useEffect(() => {
    setFields([]);
    if (open) {
      setLoading(true);

      let promise;
      if (unitId) {
        promise = client.unit.struct("user", unitId, {
          headers: { "Arke-Project-Key": "arke_system" },
        });
      } else {
        promise = client.arke.struct("user", {
          headers: { "Arke-Project-Key": "arke_system" },
        });
      }

      promise
        .then((res) => {
          const parameters = res.data.content.parameters.map((item) => {
            if (item.id === "password_hash") {
              item.id = "password";
              return item;
            }
            return item;
          });
          setFields(parameters);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, unitId]);

  const onFormSubmit = useCallback(
    (data: Record<string, unknown>) => {
      let promise;
      if (unitId) {
        promise = client.unit.edit("user", unitId, data, {
          headers: { "Arke-Project-Key": "arke_system" },
        });
      } else {
        promise = client.unit.create("user", data, {
          headers: { "Arke-Project-Key": "arke_system" },
        });
      }

      promise.then((res) => {
        onSubmit(res);
      });
    },
    [client, unitId, onSubmit]
  );

  const handleClose = useCallback(() => {
    setFields(undefined);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={!!open} title={title} onClose={handleClose}>
      <Form
        fields={fields ?? []}
        onSubmit={onFormSubmit}
        style={{ height: "100%" }}
      >
        {loading || !fields ? (
          <Spinner />
        ) : (
          <>
            <div className="grid gap-4">
              <FormField id="username" />
              <FormField id="type" />
              <FormField id="first_name" />
              <FormField id="last_name" />
              <FormField id="first_access" />
              <FormField id="phone_number" />
              <FormField
                id="address"
                render={(props) => (
                  <Input
                    {...props}
                    label="Address"
                    className="w-full"
                    onChange={(e) => props.onChange(e.target.value)}
                  />
                )}
              />
              <FormField id="birth_date" />
              <FormField id="fiscal_code" />
              <FormField id="environment" />
              {!unitId && (
                <FormField
                  id="password"
                  render={(props) => (
                    <Input
                      {...props}
                      type="password"
                      label="Password"
                      className="w-full"
                      onChange={(e) => props.onChange(e.target.value)}
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

export function ArkeDelete({
  onClose,
  unitId,
  onDelete,
  open,
}: {
  onClose(): void;
  unitId: string;
  onDelete: () => void;
  open: string | boolean | undefined;
}) {
  const client = useClient();

  const onSubmit = useCallback(() => {
    client.arke.delete(unitId).then(() => {
      onDelete();
    });
  }, [unitId, client, onDelete]);

  return (
    <Dialog
      open={!!open}
      title={
        <div className="flex items-center gap-4">
          <TrashIcon className="text-error" />
          Delete User
        </div>
      }
      onClose={onClose}
    >
      <p className="text-sm">Do you really want to delete?</p>
      <div className="mt-4 flex gap-4">
        <Button className="w-full bg-neutral" onClick={onClose}>
          Cancel
        </Button>
        <Button className="w-full bg-error" onClick={onSubmit}>
          Delete
        </Button>
      </div>
    </Dialog>
  );
}
