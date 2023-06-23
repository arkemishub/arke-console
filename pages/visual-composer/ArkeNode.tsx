import React, { memo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@arkejs/ui";
import { CrudState } from "@/types/crud";
import toast from "react-hot-toast";
import { TUnit } from "@arkejs/client";
import { AssignParameterAdd } from "@/crud/arke";

interface ArkeNodeProps {
  data: { arke; parameters; onUpdateData };
}
function ArkeNode(props: ArkeNodeProps) {
  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });
  const { arke, parameters, onUpdateData } = props.data;
  const defaults = ["id", "arke_id", "metadata", "inserted_at", "updated_at"];

  return (
    <div className="arke-node">
      <div className="arke-node__header">
        <strong>{arke.label}</strong>
      </div>
      <div className="arke-node__body">
        {parameters.map((item: { id: string; label: string; type: string }) => (
          <div
            key={item.id}
            className={twMerge(
              "flex",
              defaults.includes(item.id) && "text-neutral-400"
            )}
          >
            <div className="mr-1">{item.label}</div>
            <div>({item.type})</div>
          </div>
        ))}
        <Button
          className="mt-2 flex w-full rounded-theme bg-neutral-800 p-1.5 text-neutral-300"
          onClick={() => setCrud((p) => ({ ...p, add: true }))}
        >
          <PlusIcon className="mr-1 w-3" />
          Assign new parameter
        </Button>
      </div>

      <AssignParameterAdd
        arkeId={arke.id}
        linkedParameters={parameters as TUnit[]}
        open={crud.add}
        onClose={() => setCrud((prevState) => ({ ...prevState, add: false }))}
        onSubmit={() => {
          toast.success(`Parameters assigned correctly`);
          onUpdateData();
          setCrud((prevState) => ({ ...prevState, add: false }));
        }}
      />
    </div>
  );
}

export default memo(ArkeNode);
