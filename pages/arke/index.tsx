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
import useClient from "@/arke/useClient";
import { useCallback, useState } from "react";
import { Client, TUnit } from "@arkejs/client";
import {
  ArkeCrud as ArkeAdd,
  ArkeCrud as ArkeEdit,
  ArkeDelete,
  columns,
} from "@/crud/arke";
import { CrudState } from "@/types/crud";
import { PageTitle } from "@/components/PageTitle";
import { Button } from "@arkejs/ui";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getClient } from "@/arke/getClient";
import { GetServerSideProps } from "next";
import { withAuth } from "@/server/withAuth";
import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";
import { AddIcon, EditIcon } from "@/components/Icon";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

const fetchArke = async (
  client: Client,
  page?: number,
  filters?: Filter[],
  sort?: Sort[]
) => {
  return client.arke.getAll({
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
  });
};

function Arke(props: { data: TUnit[]; count: number }) {
  const [data, setData] = useState<TUnit[] | undefined>(props.data);
  const [count, setCount] = useState<number | undefined>(props.count);
  const [isLoading, setIsLoading] = useState(false);
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
          },
        }
      : null
  );

  const loadData = useCallback(
    (page?: number, filters?: Filter[], sort?: Sort[]) => {
      setIsLoading(true);
      fetchArke(client, page, filters, sort).then((res) => {
        setIsLoading(false);
        setData(res.data.content.items);
        setCount(res.data.content.count);
      });
    },
    []
  );

  return (
    <Layout>
      <PageTitle
        title="Arke"
        action={
          <Button
            color="primary"
            onClick={() =>
              setCrud((prevState) => ({ ...prevState, add: true }))
            }
          >
            Add Arke
          </Button>
        }
      />
      {data && !isLoading && (
        <>
          <Table
            data={data}
            actions={{
              label: "Actions",
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
              ],
            }}
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
            noResult={
              <div className="flex flex-col items-center p-4 py-8 text-center">
                <div className="rounded-full bg-background-400 p-6">
                  <AddIcon className="h-12 w-12 text-primary" />
                </div>
                <span className="mt-4 text-xl">
                  Create your first Arke to get started.
                </span>
                Do you need a hand? Check out our documentation.
                <div className="mt-4 flex">
                  <Button
                    className="border"
                    onClick={() =>
                      setCrud((prevState) => ({ ...prevState, add: true }))
                    }
                  >
                    Add Arke
                  </Button>
                </div>
              </div>
            }
            totalCount={totalCount}
          />
        </>
      )}
      <ArkeAdd
        title={
          <div className="flex items-center gap-4">
            <AddIcon className="text-primary" />
            Add Arke
          </div>
        }
        open={crud.add}
        onClose={() => setCrud((p) => ({ ...p, add: false }))}
        onSubmit={(res) => {
          loadData();
          toast.success(`Arke ${res.data.content.id} created correctly`);
          setCrud((p) => ({ ...p, add: false }));
        }}
      />
      <ArkeEdit
        title={
          <div className="flex items-center gap-4">
            <EditIcon className="text-primary" />
            Edit Arke
          </div>
        }
        open={!!crud.edit}
        arkeId={crud.edit as string}
        onClose={() => setCrud((p) => ({ ...p, edit: false }))}
        onSubmit={(res) => {
          loadData();
          toast.success(`Arke ${res.data.content.id} edited correctly`);
          setCrud((p) => ({ ...p, edit: false }));
        }}
      />
      <ArkeDelete
        open={!!crud.delete}
        onClose={() => setCrud((p) => ({ ...p, delete: false }))}
        arkeId={crud.delete as string}
        onDelete={() => {
          loadData();
          toast.success(`Arke deleted correctly`);
          setCrud((p) => ({ ...p, delete: false }));
        }}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const client = getClient(context);
    const response = await fetchArke(client);

    return {
      props: {
        data: response.data.content.items,
        count: response.data.content.count,
      },
    };
  }
);

export default Arke;
