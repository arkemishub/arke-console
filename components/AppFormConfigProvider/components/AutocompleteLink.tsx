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

import { RenderProps } from "@arkejs/form";
import useClient from "@/arke/useClient";
import { useEffect, useState } from "react";
import { TUnit } from "@arkejs/client";
import { Autocomplete } from "@arkejs/ui";
import toast from "react-hot-toast";

export type LinkRef = { id: string; arke_id: "group" | "arke" };

type AutocompleteLinkProps = RenderProps & {
  reference: LinkRef;
  onChange: (value: any) => void;
};

export default function AutocompleteLink(props: AutocompleteLinkProps) {
  const { reference, onChange } = props;
  const client = useClient();
  const [values, setValues] = useState<TUnit[]>([]);

  useEffect(() => {
    // getAll: arke / group (id: se é gruppo o arke)
    // filter_keys [OR]
    // params: load_links: true => getAll
    if (reference?.arke_id === "group") {
      // TODO: implement getAll by group and add filters with filter_keys
      // client.unit.getAll(reference.id).then((res) => {
      client.group
        .getAllUnits(reference.id)
        .then((res) => {
          setValues(res.data.content.items);
        })
        .catch(() =>
          toast.error("Something went wrong during group retrieval", {
            id: "error_link_group",
          })
        );
    }
    if (reference?.arke_id === "arke") {
      client.unit
        .getAll(reference.id)
        .then((res) => {
          setValues(res.data.content.items);
        })
        .catch(() =>
          toast.error("Something went wrong during arke retrieval", {
            id: "error_link_arke",
          })
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Autocomplete
      {...props}
      onChange={onChange}
      getDisplayValue={(value) =>
        `[${value.arke_id}] ${value.label ?? value.id}`
      }
      values={values}
      value={values.find((item) => item.id === props.value)}
    />
  );
}
