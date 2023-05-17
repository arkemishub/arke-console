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
import Link from "next/link";
import dynamic from "next/dynamic";
import { Switch } from "@arkejs/ui";

const Json = dynamic(() => import("@arkejs/ui").then((module) => module.Json), {
  ssr: false,
});

export const columns: Column[] = [
  {
    label: "ID",
    id: "id",
    type: ColumnType.String,
    render: (data) => (
      <Link href={`/arke/${data.id}`} className="underline">
        {data.label as string}
      </Link>
    ),
  },
  { label: "Label", id: "label", type: ColumnType.String },
  {
    label: "Active",
    id: "active",
    type: ColumnType.Bool,
    render: (data) => (
      <Switch checked={!!data.active} color="primary" disabled />
    ),
  },
  {
    label: "Metadata",
    id: "metadata",
    sortable: false,
    render: (data) => (
      <Json
        readOnly
        value={JSON.stringify(data.metadata)}
        className="!min-h-[50px] max-w-[250px]"
      />
    ),
  },
];

export const arkeUnitsColumns: Column[] = [
  {
    label: "ID",
    id: "id",
    render: (rowData) => (
      <Link
        className="underline"
        href={`/arke/${rowData.arke_id}/${rowData.id}`}
      >
        {rowData.id as string}
      </Link>
    ),
  },
  {
    label: "Metadata",
    id: "metadata",
    sortable: false,
    render: (data) => (
      <Json
        readOnly
        value={JSON.stringify(data.metadata)}
        className="!min-h-[50px] max-w-[250px]"
      />
    ),
  },
];

export const linkedParametersColumns: Column[] = [
  {
    label: "ID",
    id: "id",
  },
  { label: "Label", id: "label" },
  {
    label: "Type",
    id: "type",
  },
  {
    label: "Metadata",
    id: "metadata",
    render: (data) => (
      <Json
        readOnly
        value={JSON.stringify(data.metadata)}
        className="!min-h-[50px] max-w-[250px]"
      />
    ),
  },
];
