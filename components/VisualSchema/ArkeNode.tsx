import React, { memo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@arkejs/ui";
import { CrudState } from "@/types/crud";
import toast from "react-hot-toast";
import { TUnit } from "@arkejs/client";
import { AssignParameterAdd } from "@/crud/arke";
import { EditIcon, TrashIcon } from "@/components/Icon";
import { RemoveIcon } from "@/components/Icon/RemoveIcon";
import arkeId from "@/pages/arke/[arkeId]";

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
  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
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
          className="mb-2 flex cursor-pointer underline"
          onClick={() => setCrud((p) => ({ ...p, add: true }))}
        >
          <PlusIcon className="mr-1 w-3" />
          Assign new parameter
        </div>
        {parameters.map((item) => (
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
            <div className="mr-1">{item.label}</div>
            <div>({item.type})</div>
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
    </div>
  );
}

export default memo(ArkeNode);
