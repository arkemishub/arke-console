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

import { Column } from "@arkejs/table";
import { PermissionSwitch } from "@/components/Permissions/PermissionSwitch";
import { PermissionInput } from "@/components/Permissions/PermissionInput";

export const columns: Column[] = [
  { id: "role", label: "Role" },
  {
    id: "get",
    label: "Get",
    render: (rowData) => (
      <PermissionSwitch
        role={rowData.role as string}
        method="get"
        checked={rowData.get}
      />
    ),
  },
  {
    id: "post",
    label: "Post",
    render: (rowData) => (
      <PermissionSwitch
        role={rowData.role as string}
        method="post"
        checked={rowData.post}
      />
    ),
  },
  {
    id: "put",
    label: "Put",
    render: (rowData) => (
      <PermissionSwitch
        role={rowData.role as string}
        method="put"
        checked={rowData.put}
      />
    ),
  },
  {
    id: "delete",
    label: "Delete",
    render: (rowData) => (
      <PermissionSwitch
        role={rowData.role as string}
        method="delete"
        checked={rowData.delete}
      />
    ),
  },
  {
    id: "filter",
    label: "Filter",
    render: (rowData) => (
      <PermissionInput
        {...rowData}
        role={rowData.role as string}
        // @ts-ignore
        value={rowData.filter.value}
      />
    ),
  },
];
