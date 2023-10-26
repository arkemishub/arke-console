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

interface PermissionSwitchProps {
  role: string;
  method: string;
  checked: boolean;
}

export function PermissionSwitch(props: PermissionSwitchProps) {
  const client = useClient();
  const { role, method } = props;
  const [checked, setChecked] = useState(props.checked);
  function onChange(status: boolean) {
    console.log(role, method, status);
    /*client.unit.edit("arke", role, {}).then((res) => console.log(res.data));
    setChecked(!checked);
    toast.success(`Permission ${role} (${method.toUpperCase()}) updated`);*/
    // TODO: reset check if api call failed
  }

  return (
    <Switch
      checked={checked}
      onChange={() => onChange(!checked)}
      color="primary"
    />
  );
}
