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

export const columns: Column[] = [
  {
    label: "Name",
    id: "first_name",
    type: ColumnType.String,
    render: (rowData) => (
      <div>
        {rowData.fullname
          ? (rowData.fullname as string)
          : (rowData.name as string)}
      </div>
    ),
  },
  {
    label: "Type",
    id: "arke_id",
    type: ColumnType.String,
  },
  {
    label: "Email",
    id: "email",
    type: ColumnType.String,
    render: (rowData) => (
      <a className="text-primary" href={`mailto:${rowData.email}`}>
        {rowData.email as string}
      </a>
    ),
  },
];
