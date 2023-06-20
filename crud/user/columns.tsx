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

import { Column, ColumnType } from "@arkejs/table";
import dynamic from "next/dynamic";
import { Switch } from "@arkejs/ui";

const Json = dynamic(() => import("@arkejs/ui").then((module) => module.Json), {
  ssr: false,
});

export const columns: Column[] = [
  { label: "Username", id: "username", type: ColumnType.String },
  { label: "First name", id: "first_name", type: ColumnType.String },
  { label: "Last name", id: "last_name", type: ColumnType.String },
  {
    label: "Active",
    id: "active",
    type: ColumnType.Bool,
    render: (data) => (
      <Switch checked={!!data.active} color="primary" disabled />
    ),
  },
  {
    label: "Last login",
    id: "last_login",
    type: ColumnType.Date,
  },
  {
    label: "First Access",
    id: "first_access",
    type: ColumnType.Bool,
    render: (data) => (
      <Switch checked={!!data.first_access} color="primary" disabled />
    ),
  },
];
