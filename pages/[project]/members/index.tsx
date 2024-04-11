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

import { useEffect, useState } from "react";
import { CrudState } from "@/types/crud";
import { TUnit } from "@arkejs/client";
import { GetServerSideProps } from "next";
import { withAuth } from "@/server/withAuth";
import { getClient } from "@/arke/getClient";
import { Table } from "@/components/Table";
import { Button, Json } from "@arkejs/ui";
import {
  MemberCrud as MemberAdd,
  MemberCrud as MemberEdit,
} from "@/crud/member/MemberCrud";
import { toast } from "react-hot-toast";
import { PageTitle } from "@/components/PageTitle";
import { AddIcon } from "@/components/Icon";
import { ProjectLayout } from "@/components/Layout";
import serverErrorRedirect from "@/server/serverErrorRedirect";
import { acceptedRoles } from "@/arke/config";
import EmptyState from "@/components/Table/EmptyState";
import useArkeTable from "@/hooks/useArkeTable";
import { buildStructClientConfig } from "@/utils/client";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CrudDelete } from "@/crud/common";
import { DEFAULT_PAGE_SIZE } from "@/utils/table";

export default function Members(props: {
  data: TUnit[];
  columns: TUnit[];
  count: number;
}) {
  const client = getClient();
  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });

  const { data, filters, isLoading, loadData, tableProps } = useArkeTable(
    "group",
    "arke_auth_member",
    props.columns,
    {
      data: props.data,
      count: props.count,
    },
    async (data: any) => {
      const items = [];
      for (const item of data.items) {
        const userId: any = await item.arke_system_user;
        const arkeSystemUserData = (
          await client.unit.get("user", userId as string, {
            headers: {
              "Arke-Project-Key": "arke_system",
            },
          })
        ).data.content;
        items.push({ ...arkeSystemUserData, ...item });
      }

      return { ...data, items };
    }
  );

  useEffect(() => {
    loadData();
  }, []);

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

      <Table
        data={data}
        loading={isLoading}
        actions={{
          label: "",
          actions: [
            {
              content: <PencilIcon className="h-4 w-4" />,
              onClick: (rowData) => {
                setCrud((prevState) => ({
                  ...prevState,
                  edit: {
                    unitId: rowData?.id as string,
                    arkeId: rowData.arke_id as string,
                  },
                }));
              },
            },
            {
              content: <XMarkIcon className="h-4 w-4" />,
              onClick: (rowData) => {
                setCrud((prevState) => ({
                  ...prevState,
                  delete: {
                    unitId: rowData?.id as string,
                    arkeId: rowData.arke_id as string,
                  },
                }));
              },
            },
          ],
        }}
        {...tableProps}
        noResult={
          !data || (data.length === 0 && filters.length === 0) ? (
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

      {Boolean(crud.add) && (
        <MemberAdd
          title={
            <div className="flex items-center gap-4">
              <AddIcon className="text-primary" />
              Add member
            </div>
          }
          open={Boolean(crud.add)}
          onClose={() => setCrud((p) => ({ ...p, add: false }))}
          onSubmit={(res) => {
            loadData();
            toast.success(`Member created correctly`);
            setCrud((p) => ({ ...p, add: false }));
          }}
        />
      )}

      {Boolean(crud.edit) && (
        <MemberEdit
          title={
            <div className="flex items-center gap-4">
              <AddIcon className="text-primary" />
              Edit member
            </div>
          }
          // @ts-ignore
          arkeId={crud.edit?.arkeId as string}
          // @ts-ignore
          id={crud.edit?.unitId as string}
          open={Boolean(crud.edit)}
          onClose={() => setCrud((p) => ({ ...p, edit: false }))}
          onSubmit={(res) => {
            loadData();
            toast.success(`Member edited correctly`);
            setCrud((p) => ({ ...p, edit: false }));
          }}
        />
      )}

      {Boolean(crud.delete) && (
        <CrudDelete
          // @ts-ignore
          arkeId={crud.delete.arkeId}
          // @ts-ignore
          unitId={crud.delete.unitId}
          open={Boolean(crud.delete)}
          title="Elimina membro"
          onClose={() => setCrud((p) => ({ ...p, delete: false }))}
          onSubmit={() => {
            loadData();
            toast.success(`Member deleted correctly`);
            setCrud((p) => ({ ...p, delete: false }));
          }}
        />
      )}
    </ProjectLayout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  acceptedRoles,
  async (context) => {
    const client = getClient(context);

    try {
      const responseStruct = await client.group.struct(
        "arke_auth_member",
        buildStructClientConfig()
      );
      const responseGetAll = await client.group.getAllUnits(
        "arke_auth_member",
        { params: { offset: 0, limit: DEFAULT_PAGE_SIZE } }
      );

      const columns = [
        { id: "arke_id", label: "Type" },
        { id: "email", label: "Email", sorting: false },
        { id: "username", label: "Username", sorting: false },
        ...responseStruct.data.content.parameters,
      ];
      return {
        props: {
          columns,
          data: responseGetAll.data.content.items,
          count: responseGetAll.data.content.count,
        },
      };
    } catch (e) {
      return serverErrorRedirect(e);
    }
  }
);
