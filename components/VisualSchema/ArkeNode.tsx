import React, { memo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@arkejs/ui";
import { CrudState } from "@/types/crud";
import toast from "react-hot-toast";
import { TUnit } from "@arkejs/client";
import { AssignParameterAdd } from "@/crud/arke";
import { AddIcon, EditIcon, LinkIcon, TrashIcon } from "@/components/Icon";
import { RemoveIcon } from "@/components/Icon/RemoveIcon";
import arkeId from "@/pages/arke/[arkeId]";
import { LinkArkeOrGroup } from "@/crud/arke/LinkArkeOrGroup";
import { Handle, Position } from "reactflow";

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
        <div className="flex w-1/12 cursor-pointer justify-end">
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
                <div className="mr-1">{item.label}</div>
                <div>({item.type})</div>
              </>
            ) : (
              <div className="flex text-primary">
                <div className="mr-1">{item.ref.label}</div>
                <div>({item.ref.type})</div>
              </div>
            )}
          </div>
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