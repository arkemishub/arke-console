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

import { Column } from "@arkejs/table";
import React, { useEffect, useState } from "react";
import useClient from "@/arke/useClient";
import { TUnit } from "@arkejs/client";
import { CrudState } from "@/types/crud";
import { Button } from "@arkejs/ui";
import {
  CrudAddEdit as UnitEdit,
  CrudAddEdit as UnitAdd,
  CrudDelete as UnitDelete,
} from "@/crud/common";
import { AddIcon } from "@/components/Icon";
import { Table } from "@/components/Table";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import EmptyState from "@/components/Table/EmptyState";
import {
  DocumentMagnifyingGlassIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useArkeTable from "@/hooks/useArkeTable";
import {
  buildStructClientConfig,
  STRUCT_DEFAULT_EXCLUDE,
} from "@/utils/client";

function UnitsTab({ arke }: { arke: TUnit }) {
  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });
  const [columns, setColumns] = useState<Column[]>([]);
  const client = useClient();
  const router = useRouter();
  const { project } = router.query;

  const { data, isLoading, filters, loadData, tableProps } = useArkeTable(
    "arke",
    arke.id as string,
    columns
  );

  useEffect(() => {
    const structExclude = STRUCT_DEFAULT_EXCLUDE.filter(
      (item) => item !== "id"
    );
    client.arke
      .struct(
        arke.id as string,
        buildStructClientConfig({ exclude: structExclude })
      )
      .then((res) => {
        const idColumn = res.data.content.parameters.filter(
          (item) => item.id === "id"
        );
        const columnsWithoutId = res.data.content.parameters.filter(
          (item) => item.id !== "id"
        );
        setColumns([...idColumn, ...columnsWithoutId] as Column[]);
      });
    loadData();
  }, []);

  return (
    <>
      <>
        <div className="flex justify-end">
          <Button
            color="primary"
            onClick={() =>
              setCrud((prevState) => ({ ...prevState, add: true }))
            }
          >
            Add {arke.label}
          </Button>
        </div>
        <Table
          data={data ?? []}
          loading={isLoading}
          {...tableProps}
          actions={{
            label: "",
            actions: [
              {
                content: <PencilIcon className="h-4 w-4" />,
                onClick: (rowData) =>
                  setCrud((prevState) => ({
                    ...prevState,
                    edit: rowData?.id as string,
                  })),
              },
              {
                content: <XMarkIcon className="h-4 w-4" />,
                onClick: (rowData) =>
                  setCrud((prevState) => ({
                    ...prevState,
                    delete: rowData?.id as string,
                  })),
              },
              {
                content: <DocumentMagnifyingGlassIcon className="h-4 w-4" />,
                onClick: (rowData) =>
                  router.push(`/${project}/arke/${arke.id}/${rowData.id}`),
              },
            ],
          }}
          noResult={
            data?.length === 0 && filters.length === 0 ? (
              <EmptyState
                name={arke.label}
                onCreate={() =>
                  setCrud((prevState) => ({ ...prevState, add: true }))
                }
              />
            ) : (
              <div className="flex h-20 items-center justify-center">
                No result found
              </div>
            )
          }
        />
        <UnitAdd
          title={
            <div className="flex items-center gap-4">
              <AddIcon className="text-primary" />
              Add {arke.label}
            </div>
          }
          open={!!crud.add}
          arkeId={arke.id}
          onClose={() => setCrud((p) => ({ ...p, add: false }))}
          onSubmit={(res) => {
            loadData();
            toast.success(`${res.data.content.id} created correctly`);
            setCrud((p) => ({ ...p, add: false }));
          }}
        />
        <UnitEdit
          arkeId={arke.id}
          unitId={crud?.edit as string}
          open={!!crud.edit}
          title="Edit"
          onClose={() =>
            setCrud((prevState) => ({ ...prevState, edit: false }))
          }
          onSubmit={() => {
            loadData();
            toast.success(`Unit edited correctly`);
            setCrud((prevState) => ({ ...prevState, edit: false }));
          }}
        />
        <UnitDelete
          arkeId={arke.id}
          unitId={crud?.delete as string}
          open={!!crud.delete}
          title="Delete"
          onClose={() =>
            setCrud((prevState) => ({ ...prevState, delete: false }))
          }
          onSubmit={() => {
            loadData();
            toast.success(`Unit deleted correctly`);
            setCrud((prevState) => ({ ...prevState, delete: false }));
          }}
        />
      </>
    </>
  );
}

export default UnitsTab;
