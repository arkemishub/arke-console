import React, { useCallback, useEffect, useState } from "react";
import { Client, LinkDirection, TUnit } from "@arkejs/client";
import useClient from "@/arke/useClient";
import { CrudState } from "@/types/crud";
import { Filter, Sort, useTable } from "@arkejs/table";
import { columns } from "@/crud/permission/columns";
import { Table } from "@/components/Table";
import { AddIcon } from "@/components/Icon";
import { Button } from "@arkejs/ui";

const PAGE_SIZE = 5;
const fetchArkePermission = async (
  role: string,
  client: Client,
  page?: number,
  filters?: Filter[],
  sort?: Sort[]
) => {
  return client.unit.topology.getLinks(
    { arkeId: "arke", id: role },
    LinkDirection.Child,
    {
      params: {
        link_type: "permission",
        depth: 0,
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
    }
  );
};

export function PermissionTable(props: { role: string }) {
  const { role } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TUnit[] | undefined>([]);
  const [count, setCount] = useState<number | undefined>(0);
  const client = useClient();

  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });

  const {
    setFilters,
    tableProps,
    totalCount,
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
          columns,
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
      fetchArkePermission(role, client, page, filters, sort).then((res) => {
        setData(res.data.content.items);
        setCount(res.data.content.count);
        setIsLoading(false);
      });
    },
    []
  );

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="permission-table">
      <Table
        loading={isLoading}
        data={data ?? []}
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
              Create your first Permission to get started.
            </span>
            Do you need a hand? Check out our documentation.
            <div className="mt-4 flex">
              <Button
                className="border"
                onClick={() =>
                  setCrud((prevState) => ({ ...prevState, add: true }))
                }
              >
                Add permission
              </Button>
            </div>
          </div>
        }
        totalCount={totalCount}
      />
    </div>
  );
}
