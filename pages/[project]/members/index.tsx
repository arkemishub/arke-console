/*
 * Copyright 2023 Arkemis S.r.l.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useCallback, useState } from "react";
import { Column, Filter, Sort, useTable } from "@arkejs/table";
import {
  BanknotesIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CrudState } from "@/types/crud";
import { TUnit } from "@arkejs/client";
import { GetServerSideProps } from "next";
import { withAuth } from "@/server/withAuth";
import { getClient } from "@/arke/getClient";
import useClient from "@/arke/useClient";
import {
  getTableColumns,
  getTableConfig,
  getTableData,
} from "@/utils/tableUtils";
import { Table } from "@/components/Table";
import { Button, Input } from "@arkejs/ui";
import {
  MemberCrud as MemberAdd,
  MemberCrud as MemberEdit,
} from "@/crud/member/MemberCrud";
import { CrudDelete as MemberDelete } from "@/crud/common";
import { columns } from "@/crud/member";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { PageTitle } from "@/components/PageTitle";
import { AddIcon } from "@/components/Icon";
import { ProjectLayout } from "@/components/Layout";
import serverErrorRedirect from "@/server/serverErrorRedirect";
import { acceptedRoles } from "@/arke/config";
import EmptyState from "@/components/Table/EmptyState";

export default function Members(props: {
  data: TUnit[];
  columns: TUnit[];
  count: number;
}) {
  const client = useClient();
  const router = useRouter();
  const [data, setData] = useState<TUnit[]>(props.data);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(props.count);
  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });
  const {
    setFilters,
    tableProps,
    sort,
    setSort,
    filters,
    goToPage,
    currentPage,
  } = useTable(getTableConfig(columns, count));

  const loadData = useCallback(
    (
      page?: number,
      filters?: Filter[],
      sort?: Sort[],
      operator?: "and" | "or"
    ) => {
      setIsLoading(true);
      getTableData({
        client,
        arkeOrGroup: "group",
        arkeOrGroupId: "member_group",
        page,
        filters,
        sort,
        operator,
      }).then((res) => {
        setData(res.data.content.items);
        setCount(res.data.content.count);
        setIsLoading(false);
      });
    },
    []
  );

  return (
    <ProjectLayout>
      <PageTitle
        title="Members"
        action={
          <Button
            color="primary"
            onClick={() =>
              setCrud((prevState) => ({ ...prevState, add: true }))
            }
          >
            Add Member
          </Button>
        }
      />

      <>
        <Table
          data={data}
          loading={isLoading}
          actions={{
            label: "",
            actions: [
              /*{
                content: <PencilIcon className="h-4 w-4" />,
                onClick: (rowData) => {
                  setCrud((prevState) => ({
                    ...prevState,
                    edit: rowData?.id as string,
                  }));
                },
              },
              {
                content: <XMarkIcon className="h-4 w-4" />,
                onClick: (rowData) => {
                  setCrud((prevState) => ({
                    ...prevState,
                    delete: rowData?.id as string,
                  }));
                },
              },*/
            ],
          }}
          {...tableProps}
          goToPage={(page: number) => {
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
                name="Member"
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
          filterable={false}
        />
      </>

      <MemberAdd
        title={
          <div className="flex items-center gap-4">
            <AddIcon className="text-primary" />
            Add member
          </div>
        }
        open={crud.add as boolean}
        onClose={() => setCrud((p) => ({ ...p, add: false }))}
        onSubmit={(res) => {
          loadData();
          toast.success(`Member created correctly`);
          setCrud((p) => ({ ...p, add: false }));
        }}
      />

      <MemberEdit
        title={
          <div className="flex items-center gap-4">
            <AddIcon className="text-primary" />
            Edit member
          </div>
        }
        open={crud.edit as boolean}
        onClose={() => setCrud((p) => ({ ...p, edit: false }))}
        onSubmit={(res) => {
          loadData();
          toast.success(`Member edited correctly`);
          setCrud((p) => ({ ...p, edit: false }));
        }}
      />
    </ProjectLayout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  acceptedRoles,
  async (context) => {
    const client = getClient(context);

    try {
      const responseStruct = await getTableColumns({
        client,
        arkeOrGroup: "group",
        arkeOrGroupId: "arke_auth_member",
      });
      const responseGetAll = await getTableData({
        client,
        arkeOrGroup: "group",
        arkeOrGroupId: "arke_auth_member",
      });

      return {
        props: {
          columns: responseStruct.data.content.parameters,
          data: responseGetAll.data.content.items,
          count: responseGetAll.data.content.count,
        },
      };
    } catch (e) {
      return serverErrorRedirect(e);
    }
  }
);
