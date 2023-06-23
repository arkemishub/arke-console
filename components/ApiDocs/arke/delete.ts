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

const deleteDocs = ({ arkeId }: { arkeId: string }) => ({
  title: `Delete ${arkeId}`,
  description: `Delete a single ${arkeId} unit.`,
  code: [
    {
      language: "javascript",
      code: `
      import { Client } from '@arkejs/clientjs';
      
      const client = new Client({
        serverUrl: 'https://api.example.com',
        project: 'my-project',
      });
      
      await client.unit.delete('${arkeId}', '<unit_id>');
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
        {
          parameter: "unit_id",
          type: "string",
          description: "Unit ID",
        },
      ],
    },
  ],
});

export default deleteDocs;
