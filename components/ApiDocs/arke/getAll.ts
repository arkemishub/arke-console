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

import { columns } from "@/components/ApiDocs/config";

const getAllDocs = ({ arkeId }: { arkeId: string }) => ({
  title: `Get all ${arkeId} units`,
  description: `Fetch ${arkeId} record lists. Supports sorting, pagination, and filtering.`,
  code: [
    {
      language: "javascript",
      code: `
      import { Client } from '@arkejs/clientjs';
      
      const client = new Client({
        serverUrl: 'https://api.example.com',
        project: 'my-project',
      });
      
      const response = await client.unit.getAll('${arkeId}');
      const arkeList = response.data.items;
      `,
    },
  ],
  tables: [
    {
      title: "Path Parameters",
      columns,
      rows: [
        {
          parameter: "arke_id",
          type: "string",
          description: "Arke ID",
        },
      ],
    },
    {
      title: "Query Parameters",
      columns,
      rows: [
        {
          parameter: "limit",
          type: "integer",
          description: "Limits the number of returned results",
        },
        {
          parameter: "offset",
          type: "integer",
          description: "Set an offset",
        },
        {
          parameter: "filter",
          type: "string",
          description: "Arke API filter",
        },
        {
          parameter: "order",
          type: "string[]",
          description: "Define in which order get the returned results",
        },
      ],
    },
  ],
});

export default getAllDocs;
