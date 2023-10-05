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
import { useEffect, useState } from "react";
import { TUnit } from "@arkejs/client";
import { Autocomplete } from "@arkejs/ui";
import toast from "react-hot-toast";
import Dropzone from "@/components/AppFormConfigProvider/components/Dropzone";

export type LinkRef = { id: string; arke_id: "group" | "arke" };

type AutocompleteLinkProps = {
  link_ref: LinkRef;
  onChange: (value: any) => void;
  value: string;
};

export default function AutocompleteLink(props: AutocompleteLinkProps) {
  const { link_ref, onChange } = props;
  const client = useClient();
  const [values, setValues] = useState<TUnit[]>([]);

  useEffect(() => {
    if (link_ref?.arke_id === "group") {
      client.group
        .getAllUnits(link_ref.id)
        .then((res) => {
          setValues(res.data.content.items);
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

  function getValue() {
    if (Array.isArray(props.value)) {
      return values.filter((item) => props.value?.includes(item.id));
    } else {
      return values.find((item) => {
        return item.id === props.value;
      });
    }
  }

  return (
    <>
      {link_ref.id === "arke_file" ? (
        <Dropzone {...props} onChange={(files) => onChange(files[0])} />
      ) : (
        <Autocomplete
          {...props}
          onChange={(value) => {
            if (Array.isArray(value)) {
              onChange((value as TUnit[]).map((item) => item.id));
            } else {
              onChange((value as TUnit).id);
            }
          }}
          renderValue={(value) => {
            return `[${(value as TUnit).arke_id}] ${
              (value as TUnit).label ?? (value as TUnit).id
            }`;
          }}
          values={values}
          value={getValue()}
        />
      )}
    </>
  );
}
