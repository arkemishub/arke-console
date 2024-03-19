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
import { Switch } from "@arkejs/ui";
import { useState } from "react";
import toast from "react-hot-toast";
import { TUnit } from "@arkejs/client";

type PermissionSwitchProps = {
  roleID: string;
  unitID: string;
  method: string;
} & TUnit<true>;

export function PermissionSwitch({
  roleID,
  unitID,
  method,
  link,
}: PermissionSwitchProps) {
  const [checked, setChecked] = useState(link?.metadata[method]);
  const client = useClient();
  async function onChange(value: boolean) {
    try {
      await client.unit.topology.editLink(
        { arkeId: "arke", id: roleID },
        "permission",
        { arkeId: "arke", id: unitID },
        { metadata: { ...link?.metadata, [method]: value } }
      );
      setChecked(value);
      toast.success(`Permission ${roleID} (${method.toUpperCase()}) updated`);
    } catch (err) {
      toast.error("Something went wrong");
    }
  }

  return (
    <Switch
      checked={checked as boolean}
      onChange={() => onChange(!checked)}
      color="primary"
    />
  );
}
