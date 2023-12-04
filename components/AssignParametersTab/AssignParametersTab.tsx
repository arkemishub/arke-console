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

import { Column, Filter, Sort, useTable } from "@arkejs/table";
import { useCallback, useEffect, useState } from "react";
import useClient from "@/arke/useClient";
import { TBaseParameter, TUnit } from "@arkejs/client";
import { Table } from "@/components/Table";
import { Button } from "@arkejs/ui";
import {
  AssignParameterDelete,
  AssignParameterEdit,
  linkedParametersColumns,
} from "@/crud/arke";
import { AssignParameterAdd } from "@/crud/arke/AssignParameterCrud";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { DEFAULT_PAGE_SIZE } from "@/utils/table";

const PAGE_SIZE = 10;

function AssignParametersTab({ arke }: { arke: TUnit }) {
  const [crud, setCrud] = useState<{
    add: boolean;
    edit: TBaseParameter | false;
    delete: TBaseParameter | false;
  }>({
    add: false,
    edit: false,
    delete: false,
  });
  const [data, setData] = useState<TBaseParameter[] | undefined>(undefined);
  const client = useClient();
  const { tableProps, goToPage, currentPage } = useTable({
    pagination: {
      totalCount: data?.length ?? 0,
      type: "custom",
      pageSize: DEFAULT_PAGE_SIZE,
    },
    columns: linkedParametersColumns,
    sorting: {
      sortable: false,
    },
  });

  const loadData = useCallback(() => {
    client.arke.struct(arke.id).then((res) => {
      setData(
        res.data.content.parameters.map((item) => {
          item.refLink = item.ref;
          return item;
        })
      );
    });
  }, [arke.id]);

  useEffect(() => {
    loadData();
  }, []);

  const pagedData =
    data?.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE) ?? [];

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
            Assign Parameters
          </Button>
        </div>
        <Table
          {...tableProps}
          actions={{
            label: "",
            actions: [
              {
                content: <XMarkIcon className="h-4 w-4" />,
                onClick: (rowData) =>
                  setCrud((prevState) => ({
                    ...prevState,
                    delete: rowData as TBaseParameter,
                  })),
              },
              {
                content: <PencilIcon className="h-4 w-4" />,
                onClick: (rowData) =>
                  setCrud((prevState) => ({
                    ...prevState,
                    edit: rowData as TBaseParameter,
                  })),
              },
            ],
          }}
          filterable={false}
          data={pagedData}
          goToPage={(page: number) => {
            goToPage(page);
          }}
        />
        <AssignParameterAdd
          arkeId={arke.id}
          linkedParameters={data as TUnit[]}
          open={crud.add}
          onClose={() => setCrud((prevState) => ({ ...prevState, add: false }))}
          onSubmit={() => {
            loadData();
            toast.success(`Parameters assigned correctly`);
            setCrud((prevState) => ({ ...prevState, add: false }));
          }}
        />
        <AssignParameterDelete
          parameter={crud.delete as TBaseParameter}
          onClose={() =>
            setCrud((prevState) => ({ ...prevState, delete: false }))
          }
          arkeId={arke.id}
          onDelete={() => {
            loadData();
            setCrud((prevState) => ({ ...prevState, delete: false }));
          }}
          open={!!crud.delete}
        />
        <AssignParameterEdit
          parameter={crud.edit as TBaseParameter}
          onClose={() =>
            setCrud((prevState) => ({ ...prevState, edit: false }))
          }
          arkeId={arke.id}
          onEdit={() => {
            loadData();
            toast.success(`Parameter edited successfully`);
            setCrud((prevState) => ({ ...prevState, edit: false }));
          }}
          open={!!crud.edit}
        />
      </>
    </>
  );
}

export default AssignParametersTab;
