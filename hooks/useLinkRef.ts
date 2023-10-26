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

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useClient from "@/arke/useClient";
import { LinkRef } from "@/types/link";
import { TUnit } from "@arkejs/client";

export default function useLinkRef(link_ref: LinkRef) {
  const [values, setValues] = useState<TUnit[]>([]);
  const client = useClient();

  useEffect(() => {
    if (link_ref?.arke_id === "group") {
      client.group
        .getAllUnits(link_ref.id)
        .then((res) => {
          setValues(res.data.content.items as TUnit[]);
        })
        .catch(() =>
          toast.error("Something went wrong during group retrieval", {
            id: "error_link_group",
          })
        );
    }
    if (link_ref?.arke_id === "arke") {
      client.unit
        .getAll(link_ref.id)
        .then((res) => {
          setValues(res.data.content.items as TUnit[]);
        })
        .catch(() =>
          toast.error("Something went wrong during arke retrieval", {
            id: "error_link_arke",
          })
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { values };
}
