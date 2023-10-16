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
import { TUnit } from "@arkejs/client";
import { CrudState } from "@/types/crud";
import { Button } from "@arkejs/ui";
import { CrudAddEdit as UnitAdd } from "@/crud/common";
import { arkeUnitsColumns } from "@/crud/arke";
import { AddIcon } from "@/components/Icon";
import { Table } from "@/components/Table";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

function UnitsTab({ arke }: { arke: TUnit }) {
  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TUnit[] | undefined>(undefined);
  const [count, setCount] = useState<number | undefined>(undefined);
  const client = useClient();
  const {
    setFilters,
    tableProps,
    sort,
    setSort,
    filters,
    goToPage,
    currentPage,
  } = useTable(
    typeof count !== "undefined"
      ? {
          pagination: {
            totalCount: count,
            type: "custom",
            pageSize: PAGE_SIZE,
          },
          columns: arkeUnitsColumns,
          sorting: {
            sortable: true,
            type: "custom",
          },
        }
      : null
  );

  const loadData = useCallback(
    (page?: number, filters?: Filter[], sort?: Sort[]) => {
      setIsLoading(true);
      client.unit
        .getAll(arke.id, {
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
          setData(res.data.content.items);
          setCount(res.data.content.count);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.response.status === 403) {
            toast.error(`You've not permission to get units`, {
              id: "permission_error",
            });
          }
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
              Add {arke.label}
            </Button>
          </div>
          <Table
            data={data}
            loading={isLoading}
            {...tableProps}
            goToPage={(page) => {
              goToPage(page);
              loadData(page, filters, sort);
            }}
            onFiltersChange={(filters) => {
              setFilters(filters);
              loadData(currentPage, filters, sort);
            }}
            onSortChange={(sort) => {
              setSort(sort);
              loadData(currentPage, filters, sort);
            }}
            noResult={
              <div className="flex flex-col items-center p-4 py-8 text-center">
                <div className="rounded-full bg-background-400 p-6">
                  <AddIcon className="h-12 w-12 text-primary" />
                </div>
                <span className="mt-4 text-xl">
                  Create your first {arke.label} to get started.
                </span>
                <div className="mt-4 flex">
                  <Button
                    className="border"
                    onClick={() =>
                      setCrud((prevState) => ({ ...prevState, add: true }))
                    }
                  >
                    Add {arke.label}
                  </Button>
                </div>
              </div>
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
        </>
      )}
    </>
  );
}

export default UnitsTab;
