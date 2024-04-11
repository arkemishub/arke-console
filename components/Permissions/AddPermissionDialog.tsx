/*
 * Copyright 2024 Arkemis S.r.l.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Button, Dialog, Switch } from "@arkejs/ui";
import { Field, Form, useForm } from "@arkejs/form";
import ArkeSearch from "@/components/ArkeSearch/ArkeSearch";
import toast from "react-hot-toast";
import useClient from "@/arke/useClient";
import { TUnit } from "@arkejs/client";

type Schema = {
  parent?: TUnit;
  get?: string;
  post?: string;
  put?: string;
  delete?: string;
  filter?: string;
};

const fields: Field[] = [
  { id: "parent" },
  { id: "get", type: "boolean", label: "GET", value: false },
  { id: "post", type: "boolean", label: "POST", value: false },
  { id: "put", type: "boolean", label: "PUT", value: false },
  { id: "delete", type: "boolean", label: "DELETE", value: false },
  { id: "filter", type: "string", label: "Filter" },
];

export default function AddPermissionDialog({
  roleID,
  open,
  onClose,
  ...props
}: {
  roleID: string | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (roleID: string) => void;
}) {
  const client = useClient();
  const {
    formProps,
    methods: { reset },
  } = useForm({ fields });

  const onSubmit = async (data: Schema) => {
    if (!data?.parent?.id || !roleID) return;

    try {
      await client.unit.topology.addLink(
        { arkeId: "arke", id: roleID },
        "permission",
        { arkeId: "arke", id: data.parent.id },
        {
          metadata: {
            get: data.get,
            post: data.post,
            put: data.put,
            delete: data.delete,
            filter: data.filter || null,
          },
        }
      );

      // reset on close
      reset();
      props.onSubmit(roleID);
      toast.success(`Permissions added to ${roleID}`);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog
      disableBackdropClose
      open={open}
      onClose={handleClose}
      title={`Add permission to ${roleID}`}
    >
      <Form
        {...formProps}
        onSubmit={onSubmit}
        components={{
          boolean: ({ field }) => (
            <Switch color="primary" {...field} checked={!!field.value} />
          ),
        }}
      >
        <div className="grid gap-4">
          <Form.Field
            id="parent"
            render={({ field }) => <ArkeSearch {...field} />}
          />
          <div className="grid grid-cols-4 gap-4">
            <Form.Field id="get" />
            <Form.Field id="post" />
            <Form.Field id="put" />
            <Form.Field id="delete" />
          </div>
          <Form.Field id="filter" />
        </div>
        <div className="mt-4 flex gap-4">
          <Button className="btn-outlined w-full bg-neutral" onClick={onClose}>
            Close
          </Button>
          <Button className="w-full" color="primary" type="submit">
            Confirm
          </Button>
        </div>
      </Form>
    </Dialog>
  );
}
