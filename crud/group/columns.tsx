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
import { TUnit } from "@arkejs/client";
import { Chip } from "@arkejs/ui";

export const columns: Column[] = [
  {
    label: "ID",
    id: "id",
    type: ColumnType.String,
  },
  {
    label: "Arke List",
    id: "arke_list",
    type: ColumnType.String,
    render: (rowData) => (
      <div className="flex gap-1">
        {(rowData.arke_list as TUnit[]).map((item, index) => (
          <Chip key={index} className="bg-primary p-1 text-black">
            {item.id}
          </Chip>
        ))}
      </div>
    ),
  },
  { label: "Label", id: "label", type: ColumnType.String },
  { label: "Description", id: "description", type: ColumnType.String },
];
