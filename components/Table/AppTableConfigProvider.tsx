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

import { ReactNode } from "react";
import { TableConfigProvider } from "@arkejs/table";
import { isImage } from "@/utils/file";
import Image from "next/image";

const AppTableConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TableConfigProvider
      components={{
        string: (value) => <p>{value?.label ?? value}</p>,
        // TODO: we have to extend table with link
        // @ts-ignore
        link: (value) => (
          <>
            {value.arke_id === "arke_file" && (
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
