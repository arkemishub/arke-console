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
import { cleanId } from "../../utils/helper";
import toast from "react-hot-toast";

export function ArkeCrud({
  open,
  title,
  onClose,
  arkeId,
  onSubmit,
}: {
  open: string | boolean | undefined;
  title: ReactNode;
  onClose(): void;
  arkeId?: string;
  onSubmit(data: TResponse<TUnit>): void;
}) {
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<TBaseParameter[]>([]);

  const client = useClient();

  useEffect(() => {
    if (open) {
      setLoading(true);

      let promise;
      if (arkeId) {
        promise = client.unit.struct("arke", arkeId, {});
      } else {
        promise = client.arke.baseStruct({});
      }

      promise.then((res) => {
        setFields(res.data.content.parameters);
        setLoading(false);
      });
    }
  }, [open, arkeId]);

  const onFormSubmit = useCallback(
    (data: Record<string, unknown>) => {
      let promise;
      if (arkeId) {
        promise = client.arke.edit(arkeId, data);
      } else {
        promise = client.arke.create(data);
      }

      promise.then((res) => {
        onSubmit(res);
      });
    },
    [client, arkeId, onSubmit]
  );

  return (
    <Dialog open={!!open} title={title} onClose={onClose}>
      <Form fields={fields} onSubmit={onFormSubmit} style={{ height: "100%" }}>
        {() =>
          loading ? (
            <Spinner />
          ) : (
            <>
              <div className="grid gap-4">
                {!arkeId && (
                  <FormField
                    id="id"
                    render={(props) => (
                      <Input
                        {...props}
                        label="ID"
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
                        helperText="Insert a lowercase ID, allowed characters: alphanumeric, underscore and hyphen"
                      />
                    )}
                  />
                )}
                <FormField id="label" />
                <FormField id="active" />
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
          )
        }
      </Form>
    </Dialog>
  );
}

export function ArkeDelete({
  onClose,
  arkeId,
  onDelete,
  open,
}: {
  onClose(): void;
  arkeId: string;
  onDelete: () => void;
  open: string | boolean | undefined;
}) {
  const client = useClient();

  const onSubmit = useCallback(() => {
    client.arke.delete(arkeId).then(() => {
      onDelete();
    });
  }, [arkeId, client, onDelete]);

  return (
    <Dialog
      open={!!open}
      title={
        <div className="flex items-center gap-4">
          <TrashIcon className="text-error" />
          Delete Arke
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
