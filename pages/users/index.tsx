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
  UserCrud as UserAdd,
  UserCrud as UserEdit,
  UserDelete,
  columns,
} from "@/crud/user";
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
import { acceptedRoles } from "@/arke/config";
import EmptyState from "@/components/Table/EmptyState";
import serverErrorRedirect from "@/server/serverErrorRedirect";

const PAGE_SIZE = 10;

const fetchArke = async (
  client: Client,
  page?: number,
  filters?: Filter[],
  sort?: Sort[]
) => {
  return client.unit.getAll("user", {
    headers: { "Arke-Project-Key": "arke_system" },
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

function Users(props: { data: TUnit[]; count: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TUnit[] | undefined>(props.data);
  const [count, setCount] = useState<number | undefined>(props.count);
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
      fetchArke(client, page, filters, sort).then((res) => {
        setData(res.data.content.items);
        setCount(res.data.content.count);
        setIsLoading(false);
      });
    },
    []
  );

  return (
    <Layout>
      <PageTitle
        title="Users"
        action={
          <Button
            color="primary"
            onClick={() =>
              setCrud((prevState) => ({ ...prevState, add: true }))
            }
          >
            Add User
          </Button>
        }
      />
      {data && (
        <Table
          loading={isLoading}
          data={data}
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
            ],
          }}
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
            data.length === 0 && filters.length === 0 ? (
              <EmptyState
                name="User"
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
          totalCount={totalCount}
        />
      )}

      <UserAdd
        title={
          <div className="flex items-center gap-4">
            <AddIcon className="text-primary" />
            Add User
          </div>
        }
        open={crud.add}
        onClose={() => setCrud((p) => ({ ...p, add: false }))}
        onSubmit={() => {
          loadData();
          toast.success(`User created correctly`);
          setCrud((p) => ({ ...p, add: false }));
        }}
      />
      <UserEdit
        title={
          <div className="flex items-center gap-4">
            <EditIcon className="text-primary" />
            Edit User
          </div>
        }
        open={!!crud.edit}
        unitId={crud.edit as string}
        onClose={() => setCrud((p) => ({ ...p, edit: false }))}
        onSubmit={() => {
          loadData();
          toast.success(`User edited correctly`);
          setCrud((p) => ({ ...p, edit: false }));
        }}
      />
      <UserDelete
        title="Delete User"
        open={!!crud.delete}
        onClose={() => setCrud((p) => ({ ...p, delete: false }))}
        unitId={crud.delete as string}
        onSubmit={() => {
          loadData();
          toast.success(`User deleted correctly`);
          setCrud((p) => ({ ...p, delete: false }));
        }}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  acceptedRoles,
  async (context) => {
    const client = getClient(context);
    try {
      const response = await fetchArke(client);

      return {
        props: {
          data: response.data.content.items,
          count: response.data.content.count,
        },
      };
    } catch (e) {
      return serverErrorRedirect(e);
    }
  }
);

export default Users;
