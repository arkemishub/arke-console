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
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { TStruct } from "@arkejs/client";

const exclude = [
  "id",
  "active",
  "arke_id",
  "type",
  "metadata",
  "inserted_at",
  "updated_at",
  "parameters",
];

export default function useStruct(
  arkeOrGroupId: string,
  unit?: string | undefined,
  callback?: (
    parameters: TStruct["parameters"],
    values: Record<string, unknown>
  ) => void | TStruct["parameters"],
  arkeOrGroup: "arke" | "group" = "arke"
) {
  const [loading, setLoading] = useState(false);
  const [parameters, setParameters] = useState<TStruct["parameters"]>([]);
  const client = useClient();

  useEffect(() => {
    if (arkeOrGroupId) {
      setLoading(true);
      const promise = !unit
        ? client[arkeOrGroup].struct(arkeOrGroupId, {
            params: { exclude },
          })
        : client.unit.struct(arkeOrGroupId, unit as string, {
            params: { exclude },
          });
      promise
        .then(
          (res) => {
            const params = res.data.content.parameters.map((item) => {
              item.value = item.value ? item.value : item.default;
              return item;
            });
            setParameters(params);
            const values = params.reduce(
              (acc, cur) => ({ ...acc, [cur.id as string]: cur.value }),
              {}
            );
            const callbackParams = callback?.(params, values);
            if (callbackParams) {
              setParameters(callbackParams);
            }
          },
          (err) =>
            err.response.data.messages.forEach((item: { message: string }) =>
              toast.error(item.message)
            )
        )
        .finally(() => setLoading(false));
    }
  }, [arkeOrGroupId, unit]);

  return { loading, parameters };
}
