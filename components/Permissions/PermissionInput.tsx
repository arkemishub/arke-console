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
import useClient from "@/arke/useClient";
import { Form, useForm } from "@arkejs/form";
import { Button } from "@arkejs/ui";
import { CheckIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { TUnit } from "@arkejs/client";

type PermissionInputProps = {
  roleID: string;
  value: string;
  unitID: string;
} & TUnit<true>;

export function PermissionInput({
  roleID,
  unitID,
  value,
  link: { metadata },
}: PermissionInputProps) {
  const client = useClient();
  const {
    formProps,
    methods: { handleSubmit },
  } = useForm({
    fields: [{ id: "filter", type: "string", value: value }],
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      await client.unit.topology.editLink(
        { arkeId: "arke", id: roleID },
        "permission",
        { arkeId: "arke", id: unitID },
        { metadata: { ...metadata, filter: data.filter } }
      );
      toast.success(`Filter updated`);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-2"
      {...formProps}
    >
      <Form.Field id="filter" />
      <Button type="submit" color="primary" className="h-full">
        <CheckIcon className="h-5 w-5" />
      </Button>
    </Form>
  );
}
