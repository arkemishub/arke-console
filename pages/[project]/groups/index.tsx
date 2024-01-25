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

import { useState } from "react";
import { TUnit } from "@arkejs/client";
import { CrudState } from "@/types/crud";
import { columns } from "@/crud/group";
import {
  CrudAddEdit as GroupAdd,
  CrudAddEdit as GroupEdit,
  CrudDelete as ParameterDelete,
} from "@/crud/common";
import { PageTitle } from "@/components/PageTitle";
import { Button } from "@arkejs/ui";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { GetServerSideProps } from "next";
import { withAuth } from "@/server/withAuth";
import { getClient } from "@/arke/getClient";
import { ProjectLayout } from "@/components/Layout";
import { Table } from "@/components/Table";
import { AddIcon, EditIcon, TrashIcon } from "@/components/Icon";
import toast from "react-hot-toast";
import { acceptedRoles } from "@/arke/config";
import EmptyState from "@/components/Table/EmptyState";
import useArkeTable from "@/hooks/useArkeTable";
import serverErrorRedirect from "@/server/serverErrorRedirect";

function Groups(props: { groups: TUnit[]; count: number }) {
  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });

  const {
    data: groups,
    isLoading,
    filters,
    loadData,
    tableProps,
  } = useArkeTable("arke", "group", columns, {
    data: props.groups,
    count: props.count,
  });

  return (
    <ProjectLayout>
      <PageTitle
        title="Groups"
        action={
          <Button
            color="primary"
            onClick={() =>
              setCrud((prevState) => ({ ...prevState, add: true }))
            }
          >
            Add Group
          </Button>
        }
      />
      <Table
        data={groups}
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
                    arkeId: rowData?.arke_id as string,
                  },
                }));
              },
            },
            {
              content: <XMarkIcon className="h-4 w-4" />,
              onClick: (rowData) =>
                setCrud((prevState) => ({
                  ...prevState,
                  delete: {
                    unitId: rowData?.id as string,
                    arkeId: rowData?.arke_id as string,
                  },
                })),
            },
          ],
        }}
        {...tableProps}
        noResult={
          !groups || (groups.length === 0 && filters.length === 0) ? (
            <EmptyState
              name="Group"
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

      <GroupAdd
        arkeId="group"
        include={["id"]}
        title={
          <div className="flex items-center gap-4">
            <AddIcon className="text-primary" />
            Add Group
          </div>
        }
        open={crud.add}
        onClose={() => setCrud((p) => ({ ...p, add: false }))}
        onSubmit={(res) => {
          loadData();
          toast.success(`Group ${res.data.content.id} created correctly`);
          setCrud((p) => ({ ...p, add: false }));
        }}
      />
      <GroupEdit
        title={
          <div className="flex items-center gap-4">
            <EditIcon className="text-primary" />
            Edit Group
          </div>
        }
        open={!!crud.edit}
        arkeId={
          typeof crud.edit === "object" ? (crud.edit?.arkeId as string) : ""
        }
        unitId={
          typeof crud.edit === "object" ? (crud?.edit?.unitId as string) : ""
        }
        onClose={() => setCrud((p) => ({ ...p, edit: false }))}
        onSubmit={(res) => {
          loadData();
          toast.success(`Group ${res.data.content.id} edited correctly`);
          setCrud((p) => ({ ...p, edit: false }));
        }}
      />
      <ParameterDelete
        title={
          <div className="flex items-center gap-4">
            <TrashIcon className="text-error" />
            Delete Group
          </div>
        }
        open={!!crud.delete}
        onClose={() => setCrud((p) => ({ ...p, delete: false }))}
        arkeId={
          typeof crud.delete === "object"
            ? (crud?.delete?.arkeId as string)
            : ""
        }
        unitId={
          typeof crud.delete === "object"
            ? (crud?.delete?.unitId as string)
            : ""
        }
        onSubmit={() => {
          loadData();
          toast.success(`Group deleted correctly`);
          setCrud((p) => ({ ...p, delete: false }));
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
      const response = await client.group.getAll();
      return {
        props: {
          groups: response.data.content.items,
          count: response.data.content.count,
        },
      };
    } catch (e) {
      return serverErrorRedirect(e);
    }
  }
);

export default Groups;
