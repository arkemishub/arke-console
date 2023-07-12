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

import { Autocomplete, Button, Chip, Dialog } from "@arkejs/ui";
import React, { useCallback, useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import useClient from "@/arke/useClient";
import { TBaseParameter, TUnit } from "@arkejs/client";
import { AddIcon, LinkIcon, TrashIcon } from "@/components/Icon";
import toast from "react-hot-toast";
import { ParameterAdd } from "@/crud/parameter";
import { CrudState } from "@/types/crud";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function AssignParameterAdd({
  open,
  onClose,
  arkeId,
  onSubmit,
}: {
  open?: boolean;
  onClose: () => void;
  linkedParameters: TUnit[];
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
  const [selected, setSelected] = useState<TUnit[]>([]);
  const debouncedInputValue = useDebounce<string>(inputValue, 500);

  useEffect(() => {
    setInputValue("");
    setValues([]);
    setSelected([]);
  }, [open]);

  useEffect(() => {
    if (debouncedInputValue) {
      client.group
        .getAllUnits("parameter", {
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
    await Promise.all(
      selected.map(
        (parameter) =>
          parameter.arke_id &&
          client.arke.addParameter(arkeId, parameter.arke_id, parameter.id)
      )
    );
    onSubmit();
  }, [selected, arkeId, onSubmit]);

  return (
    <>
      <Dialog
        open={open as boolean}
        title={
          <div className="flex items-center gap-4">
            <LinkIcon className="text-primary" />
            Assign Parameters
          </div>
        }
        className="flex min-h-[400px] flex-col"
        onClose={onClose}
      >
        <Autocomplete
          onChange={(val) => {
            setSelected([...val]);
          }}
          onInputChange={(event) => setInputValue(event.target.value)}
          multiple
          values={values}
          value={selected}
          renderValue={(val) => val.id}
          renderChips={false}
          placeholder="Search a parameter"
          startAdornment={
            <MagnifyingGlassIcon className="h-5 w-5 stroke-white" />
          }
        />
        <div className="mt-2">
          or{" "}
          <span
            className="cursor-pointer text-primary underline"
            onClick={() => setCrud((p) => ({ ...p, add: true }))}
          >
            create new one
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {selected.map((sel) => (
            <Chip
              color="primary"
              key={sel.id}
              onDelete={() =>
                setSelected((prevState) =>
                  prevState.filter((item) => item.id !== sel.id)
                )
              }
            >
              {sel.id}
            </Chip>
          ))}
        </div>
        <div className="mt-auto flex gap-4 pt-4">
          <Button className="w-full bg-neutral" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" className="w-full" onClick={handleSubmit}>
            Assign
          </Button>
        </div>
      </Dialog>

      <ParameterAdd
        title={
          <div className="flex items-center gap-4">
            <AddIcon className="text-primary" />
            Add Parameter
          </div>
        }
        open={crud.add}
        onClose={() => setCrud((p) => ({ ...p, add: false }))}
        onSubmit={(res) => {
          toast.success(`Parameter ${res.data.content.id} created correctly`);
          setCrud((p) => ({ ...p, add: false }));
        }}
      />
    </>
  );
}

function AssignParameterDelete({
  onClose,
  arkeId,
  onDelete,
  parameter,
  open,
}: {
  parameter: TBaseParameter;
  onClose(): void;
  arkeId: string;
  onDelete: () => void;
  open: string | boolean | undefined;
}) {
  const client = useClient();

  const onSubmit = useCallback(() => {
    if (parameter.type) {
      client.arke
        .removeParameter(
          arkeId,
          parameter.type as string,
          parameter.id as string
        )
        .then(() => {
          onDelete();
        });
    }
  }, [arkeId, onDelete, parameter]);

  return (
    <Dialog
      open={!!open}
      title={
        <div className="flex items-center gap-4">
          <TrashIcon className="text-error" />
          Unassign Parameter
        </div>
      }
      onClose={onClose}
    >
      <p className="text-sm">Do you really want to unassign that parameter?</p>
      <div className="mt-4 flex gap-4">
        <Button className="w-full bg-neutral" onClick={onClose}>
          Cancel
        </Button>
        <Button className="w-full bg-error" onClick={onSubmit}>
          Unassign
        </Button>
      </div>
    </Dialog>
  );
}

export { AssignParameterAdd, AssignParameterDelete };
