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

import React, { memo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CrudState } from "@/types/crud";
import toast from "react-hot-toast";
import { TUnit } from "@arkejs/client";
import { AssignParameterAdd } from "@/crud/arke";
import { EditIcon, LinkIcon, TrashIcon } from "@/components/Icon";
import { RemoveIcon } from "@/components/Icon/RemoveIcon";
import { LinkArkeOrGroup } from "@/crud/arke/LinkArkeOrGroup";

interface ArkeNodeProps {
  data: {
    arke: TUnit;
    parameters: TUnit[];
    onLoadData(): void;
    onEditArke(arke: TUnit): void;
    onDeleteArke(arke: TUnit): void;
    onUnassignParameter(arke: TUnit, parameter: TUnit): void;
  };
}
function ArkeNode(props: ArkeNodeProps) {
  const [crud, setCrud] = useState<CrudState & { link: boolean }>({
    add: false,
    edit: false,
    delete: false,
    link: false,
  });
  const {
    arke,
    parameters,
    onLoadData,
    onUnassignParameter,
    onEditArke,
    onDeleteArke,
  } = props.data;
  const defaults = ["id", "arke_id", "metadata", "inserted_at", "updated_at"];

  return (
    <div className="arke-node">
      <div className="arke-node__header">
        <div className="flex w-11/12 items-center">
          <div
            className={twMerge(
              "mr-1 h-[6px] w-[6px] rounded-full",
              arke.active ? "bg-success" : "bg-error"
            )}
          />
          <strong className="truncate">{arke.label}</strong>
          <div onClick={() => onEditArke(arke)}>
            <EditIcon className="mx-1 w-3 cursor-pointer" />
          </div>
        </div>
        <div className="flex w-1/12 cursor-pointer items-center justify-end">
          <div onClick={() => onDeleteArke(arke)}>
            <TrashIcon className="w-3 text-error" />
          </div>
        </div>
      </div>
      <div className="p-2">
        <div
          className="flex cursor-pointer items-center underline"
          onClick={() => setCrud((p) => ({ ...p, add: true }))}
        >
          <PlusIcon className="mr-1 w-3" />
          Assign new parameter
        </div>
        <div
          className="mb-2 flex cursor-pointer items-center underline"
          onClick={() => setCrud((prevState) => ({ ...prevState, link: true }))}
        >
          <LinkIcon className="mr-1 w-3" />
          Connect arke or group
        </div>

        {parameters.map((item: TUnit & any) => (
          <>
            <div
              key={item.id}
              className={twMerge(
                "flex items-center",
                defaults.includes(item.id) && "text-neutral-400"
              )}
            >
              <div
                className="cursor-pointer"
                onClick={() => onUnassignParameter(arke, item)}
              >
                <RemoveIcon
                  className={twMerge(
                    "mr-1 w-3 stroke-white",
                    defaults.includes(item.id) && "invisible"
                  )}
                />
              </div>

              {!item.ref ? (
                <>
                  <div className="mx-1 mb-2 flex-1">
                    <div>{item.label}</div>
                    <div className="text-[7px] text-neutral-400">{item.id}</div>
                  </div>
                  <div className="text-[9px]">({item.type})</div>
                </>
              ) : (
                <div className="flex text-primary">
                  <div className="mr-1">{item.ref.label}</div>
                  <div>({item.ref.type ?? item.ref.arke_id})</div>
                </div>
              )}
            </div>
            <div className="mb-1 h-[1px] w-full bg-neutral-400 opacity-20" />
          </>
        ))}
      </div>

      <AssignParameterAdd
        arkeId={arke.id}
        linkedParameters={parameters as TUnit[]}
        open={crud.add}
        onClose={() => setCrud((prevState) => ({ ...prevState, add: false }))}
        onSubmit={() => {
          toast.success(`Parameters assigned correctly`);
          onLoadData();
          setCrud((prevState) => ({ ...prevState, add: false }));
        }}
      />

      <LinkArkeOrGroup
        arkeId={arke.id}
        open={crud.link}
        onClose={() => setCrud((prevState) => ({ ...prevState, link: false }))}
        onSubmit={() => {
          toast.success(`Link connected correctly`);
          onLoadData();
          setCrud((prevState) => ({ ...prevState, link: false }));
        }}
      />
    </div>
  );
}

export default memo(ArkeNode);
