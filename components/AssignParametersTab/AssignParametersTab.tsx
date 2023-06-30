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

import { Filter, Sort, useTable } from "@arkejs/table";
import { useCallback, useEffect, useState } from "react";
import useClient from "@/arke/useClient";
import { TBaseParameter, TUnit } from "@arkejs/client";
import { Table } from "@/components/Table";
import { Button } from "@arkejs/ui";
import { AssignParameterDelete, linkedParametersColumns } from "@/crud/arke";
import { AssignParameterAdd } from "@/crud/arke/AssignParameterCrud";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

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
  const { filters, tableProps, setSort, setFilters, goToPage, currentPage } =
    useTable(
      data
        ? {
            pagination: {
              totalCount: data.length,
              type: "custom",
              pageSize: PAGE_SIZE,
            },
            columns: linkedParametersColumns,
          }
        : null
    );

  const loadData = useCallback(
    (page?: number, filters?: Filter[], sort?: Sort[]) => {
      client.arke
        .struct(arke.id, {
          params: {
            filter:
              filters && filters?.length > 0
                ? `and(${filters.map(
                    (f) => `${f.operator}(${f.columnId},${f.value})`
                  )})`
                : null,
            offset: (page ?? 0) * PAGE_SIZE,
            limit: PAGE_SIZE,
            order: sort?.map((sort) => `${sort.columnId};${sort.type}`),
          },
        })
        .then((res) => {
          setData(res.data.content.parameters);
        });
    },
    [arke.id]
  );

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {data && (
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
            actions={{
              actions: [
                {
                  content: <XMarkIcon className="h-4 w-4" />,
                  onClick: (rowData) =>
                    setCrud((prevState) => ({
                      ...prevState,
                      delete: rowData as TBaseParameter,
                    })),
                },
              ],
            }}
            filterable={false}
            data={data}
            {...tableProps}
            goToPage={(page) => {
              goToPage(page);
              loadData(page);
            }}
            onFiltersChange={(filters) => {
              setFilters(filters);
              loadData(currentPage, filters);
            }}
            onSortChange={(sort) => {
              setSort(sort);
              loadData(currentPage, filters, sort);
            }}
          />
          <AssignParameterAdd
            arkeId={arke.id}
            linkedParameters={data as TUnit[]}
            open={crud.add}
            onClose={() =>
              setCrud((prevState) => ({ ...prevState, add: false }))
            }
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
        </>
      )}
    </>
  );
}

export default AssignParametersTab;
