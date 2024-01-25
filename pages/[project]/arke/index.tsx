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
import { HTTPStatusCode, TUnit, TResponse } from "@arkejs/client";
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
import { ProjectLayout } from "@/components/Layout";
import { Table } from "@/components/Table";
import { AddIcon, EditIcon } from "@/components/Icon";
import toast from "react-hot-toast";
import { acceptedRoles } from "@/arke/config";
import { useRouter } from "next/router";
import EmptyState from "@/components/Table/EmptyState";
import useArkeTable from "@/hooks/useArkeTable";
import serverErrorRedirect from "@/server/serverErrorRedirect";

function Arke(props: { data: TUnit[]; count: number }) {
  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });
  const router = useRouter();
  const { project } = router.query;
  const { data, isLoading, filters, count, loadData, tableProps } =
    useArkeTable("arke", "arke", columns(project as string), {
      data: props.data,
      count: props.count,
    });

  return (
    <ProjectLayout>
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
      {data && (
        <Table
          data={data}
          loading={isLoading}
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
          noResult={
            data.length === 0 && filters.length === 0 ? (
              <EmptyState
                name="Arke"
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
          totalCount={count}
        />
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
    </ProjectLayout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  acceptedRoles,
  async (context) => {
    const client = getClient(context);
    try {
      const response = await client.arke.getAll();
      return {
        props: {
          data: response.data.content.items,
          count: response.data.content.count,
        },
      };
    } catch (err) {
      return serverErrorRedirect(err);
    }
  }
);

export default Arke;
