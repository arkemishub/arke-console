/*
 * Copyright 2023 Arkemis S.r.l.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactNode } from "react";
import { TableConfigProvider } from "@arkejs/table";
import { isImage } from "@/utils/file";
import Image from "next/image";
import { Checkbox, Json } from "@arkejs/ui";

const AppTableConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TableConfigProvider
      components={{
        boolean: (value) => (
          <Checkbox
            color="primary"
            checked={value}
            onChange={() => undefined}
          />
        ),
        // @ts-ignore
        dict: (value) => <Json value={JSON.stringify(value)} />,
        string: (value) => {
          return (
            <>
              {Array.isArray(value) ? (
                <div className="max-w-[320px] truncate">
                  {value.map((item) => item.value).join(",")}
                </div>
              ) : (
                <div>
                  {value?.value && value?.label ? (
                    <p>
                      {value?.value} ({value?.label})
                    </p>
                  ) : (
                    <p>{value?.toString() ?? "-"}</p>
                  )}
                </div>
              )}
            </>
          );
        },
        // TODO: types
        list: (value: any) => <Json value={JSON.stringify(value)} />,
        // TODO: we have to extend table with link
        // @ts-ignore
        link: (value) => (
          <>
            {value?.arke_id === "arke_file" && (
              <a href={value?.signed_url} target="_blank">
                {isImage(value.extension) && (
                  <div className="flex items-center gap-4">
                    <Image
                      alt={value.id}
                      src={value?.signed_url}
                      className="h-12 rounded"
                      width={40}
                      height={20}
                    />
                    {value?.name}
                  </div>
                )}
              </a>
            )}
          </>
        ),
      }}
    >
      {children}
    </TableConfigProvider>
  );
};

export default AppTableConfigProvider;
