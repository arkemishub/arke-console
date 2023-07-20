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

import { Autocomplete, Button, Dialog } from "@arkejs/ui";
import React, { useCallback, useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import useClient from "@/arke/useClient";
import { HTTPStatusCode, TUnit } from "@arkejs/client";
import { LinkIcon } from "@/components/Icon";
import toast from "react-hot-toast";
import { CrudState } from "@/types/crud";

function LinkArkeOrGroup({
  open,
  onClose,
  arkeId,
  onSubmit,
}: {
  open?: boolean;
  onClose: () => void;
  arkeId: string;
  onSubmit: () => void;
}) {
  const client = useClient();
  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });
  const [inputValue, setInputValue] = useState("");
  const [values, setValues] = useState<TUnit[]>([]);
  const [selected, setSelected] = useState<TUnit>();
  const debouncedInputValue = useDebounce<string>(inputValue, 500);

  useEffect(() => {
    if (debouncedInputValue) {
      client.group
        .getAllUnits("arke_or_group", {
          params: {
            offset: 0,
            limit: 5,
            filter: `and(contains(id,${debouncedInputValue}))`,
            order: `label;asc`,
          },
        })
        .then((res) => {
          setValues(res.data.content.items);
        });
    }
  }, [debouncedInputValue]);

  const handleSubmit = useCallback(async () => {
    const linkId = `link_${selected?.id}`;
    const linkParameter = () =>
      client.arke
        .addParameter(arkeId, "link", linkId)
        .then((res) => onSubmit())
        .catch((err) => {
          toast.error("Something went wrong during link connection");
        });

    await client.unit
      .create("link", {
        id: linkId,
        label: `Link ${selected?.label}`,
        type: "link",
        arke_or_group_id: selected?.id,
      })
      .then((res) => linkParameter())
      .catch((err) => {
        // Arke Link not exist
        if (err.status !== HTTPStatusCode.BadRequest) {
          linkParameter();
        }
      });
  }, [selected, arkeId, onSubmit]);

  return (
    <>
      <Dialog
        open={open as boolean}
        title={
          <div className="flex items-center gap-4">
            <LinkIcon className="text-primary" />
            Link Arke or Group
          </div>
        }
        className="flex min-h-[400px] flex-col"
        onClose={onClose}
      >
        <Autocomplete
          onChange={(val) => setSelected(val)}
          onInputChange={(event) => setInputValue(event.target.value)}
          values={values}
          value={selected}
          renderChips={false}
          placeholder="Search an Arke or Group"
          renderValue={(value) => {
            return `[${(value as TUnit).arke_id}] ${
              (value as TUnit).label ?? (value as TUnit).id
            }`;
          }}
        />

        <div className="mt-auto flex gap-4 pt-4">
          <Button className="w-full bg-neutral" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" className="w-full" onClick={handleSubmit}>
            Link
          </Button>
        </div>
      </Dialog>
    </>
  );
}

export { LinkArkeOrGroup };
